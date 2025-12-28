const nix = {
    nix: {
        name: "cupidon",
        aliases: ["love"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 5,
        role: 0,
        description: "Compatibilité amoureuse 💘",
        category: "FUN",
        guide: "Use: /cupidon @user1 @user2"
    },

    onStart: async function ({ message, args }) {

        if (args.length < 2) {
            return message.reply("❌ Utilisation : /cupidon @user1 @user2");
        }

        const name1 = args[0].replace("@", "");
        const name2 = args[1].replace("@", "");

        // 💖 Pourcentage (40% à 100%)
        const percent = Math.floor(Math.random() * 61) + 40;

        // ❤️ Barre de progression texte
        const totalBars = 10;
        const filledBars = Math.round((percent / 100) * totalBars);
        const emptyBars = totalBars - filledBars;

        const bar = "❤️".repeat(filledBars) + "🤍".repeat(emptyBars);

        // 🌸 Message kawaii
        const msg = `
╭━━〔 💘 CUPIDON MATCH 💘 〕━━┈⊷
┃ 👤 ${name1}
┃ 👤 ${name2}
┃
┃ 💞 Compatibilité : ${percent}%
┃ ${bar}
┃
┃ ${percent >= 80 ? "💍 Couple parfait !" :
     percent >= 60 ? "😍 Très belle connexion !" :
     percent >= 50 ? "😊 Ça peut marcher" :
     "💔 Relation compliquée"}
╰━━━━━━━━━━━━━━━━━━━━━━┈⊷
`;

        return message.reply(msg);
    }
};

module.exports = nix;
