const nix = {
    nix: {
        name: "tagall",
        aliases: ["mentionall"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 10,
        role: 1,
        description: "Mention all members in the group",
        category: "ADMIN",
        guide: "Use: /tagall <message>"
    },

    onStart: async function ({ message, args }) {

        const chatId = message.chatId;
        if (!chatId) {
            return message.reply("❌ Cette commande fonctionne uniquement dans un groupe.");
        }

        const text = args.join(" ") || "📢 Attention tout le monde";

        let members;
        try {
            // ⚠️ Telegram limite l’accès, mais NIX l’expose
            members = await message.telegram.getChatAdministrators(chatId);
        } catch {
            return message.reply("❌ Impossible de récupérer les membres.");
        }

        let tags = "";
        for (const m of members) {
            if (m.user?.is_bot) continue;
            tags += `[${m.user.first_name}](tg://user?id=${m.user.id}) `;
        }

        if (!tags) {
            return message.reply("❌ Aucun membre à mentionner.");
        }

        const msg = `
╭━━〔 📣 TAG ALL 〕━━┈⊷
┃ ${text}
┃
┃ ${tags}
╰━━━━━━━━━━━━━━━━━━━━━━┈⊷
`;

        return message.telegram.sendMessage(chatId, msg, {
            parse_mode: "Markdown"
        });
    }
};

module.exports = nix;
