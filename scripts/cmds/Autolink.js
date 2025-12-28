const autolinkDB = new Map(); // Stock les états ON/OFF par chat
const warnDB = new Map(); // Stock les avertissements par utilisateur

const linkRegex = /((https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([\/?&=#\w-]*)?)/gi;

module.exports = {
    config: {
        name: "autolink",
        aliases: ["linkfilter", "antilink"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 5,
        role: 1, // admin du bot
        description: "Activate or deactivate anti-link filter in group",
        category: "ADMIN",
        guide: "Use: /autolink on | off"
    },

    onStart: async function({ message, args, api }) {
        const chatID = message.chat.id;

        if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
            return message.reply("Usage: /autolink on | off");
        }

        if (args[0].toLowerCase() === "on") {
            autolinkDB.set(chatID, true);
            return message.reply("✅ Anti-link filter is now **ON** in this group.");
        } else {
            autolinkDB.set(chatID, false);
            return message.reply("❌ Anti-link filter is now **OFF** in this group.");
        }
    },

    onChat: async function({ message, api }) {
        const chatID = message.chat.id;
        const userID = message.from.id;

        // Vérifie si autolink est activé
        if (!autolinkDB.get(chatID)) return;

        // Ignore admins
        const admins = await api.getChatAdministrators(chatID);
        if (admins.some(a => a.user.id === userID)) return;

        const text = message.text || "";
        const mentions = message.entities?.filter(e => e.type === "mention" || e.type === "text_mention") || [];

        // Si message contient lien
        if (linkRegex.test(text) || mentions.some(m => m.user && !admins.some(a => a.user.id === m.user.id))) {

            // Supprime le message
            try { await api.deleteMessage(chatID, message.message_id); } catch(e){}

            // Gestion avertissements
            const key = `${chatID}_${userID}`;
            const warns = (warnDB.get(key) || 0) + 1;
            warnDB.set(key, warns);

            if (warns < 3) {
                await api.sendMessage(chatID, `⚠️ ${message.from.first_name}, tu as envoyé un lien ou mention non autorisée. Avertissement ${warns}/3`);
            } else {
                // Action finale (kick)
                try { await api.kickChatMember(chatID, userID); } catch(e) {}
                await api.sendMessage(chatID, `❌ ${message.from.first_name} a été retiré pour avoir dépassé 3 avertissements.`);
                warnDB.delete(key);
            }
        }
    }
};
