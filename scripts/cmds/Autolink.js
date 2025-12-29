const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../database/autolink.json");

function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const linkRegex = /(https?:\/\/|www\.|t\.me\/|\.com|\.net|\.org)/i;

const nix = {
    nix: {
        name: "autolink",
        aliases: [],
        author: "Samy Charles",
        version: "1.1",
        cooldowns: 3,
        role: 1,
        description: "Auto delete links in group",
        category: "ADMIN",
        guide: "Use: /autolink on | off"
    },

    onStart: async function ({ message, args }) {

        // ✅ BON ID DE GROUPE POUR NIX
        const chatId = message.chatId;
        if (!chatId) {
            return message.reply("❌ Cette commande fonctionne uniquement dans un groupe.");
        }

        const data = loadDB();
        const option = (args[0] || "").toLowerCase();

        if (!["on", "off"].includes(option)) {
            return message.reply("⚠️ Utilisation : /autolink on | off");
        }

        data[chatId] = data[chatId] || { enabled: false, warns: {} };
        data[chatId].enabled = option === "on";
        data[chatId].warns = {};

        saveDB(data);

        return message.reply(
            option === "on"
                ? "✅ AutoLink ACTIVÉ.\nLes liens seront supprimés."
                : "❎ AutoLink DÉSACTIVÉ."
        );
    },

    onChat: async function ({ message }) {

        if (!message.text) return;

        const chatId = message.chatId;
        const userId = message.from?.id;

        if (!chatId || !userId) return;

        const data = loadDB();
        if (!data[chatId]?.enabled) return;
        if (!linkRegex.test(message.text)) return;

        // 🗑️ suppression instantanée
        try {
            await message.delete();
        } catch {
            return;
        }

        data[chatId].warns[userId] = (data[chatId].warns[userId] || 0) + 1;

        if (data[chatId].warns[userId] >= 3) {
            try {
                await message.telegram.kickChatMember(chatId, userId);
            } catch {}

            delete data[chatId].warns[userId];
            saveDB(data);

            return message.telegram.sendMessage(
                chatId,
                `🚫 ${message.from.first_name} supprimé pour spam de liens (3/3)`
            );
        }

        saveDB(data);

        return message.telegram.sendMessage(
            chatId,
            `⚠️ ${message.from.first_name}, liens interdits.\nAvertissement ${data[chatId].warns[userId]}/3`
        );
    }
};

module.exports = nix;
