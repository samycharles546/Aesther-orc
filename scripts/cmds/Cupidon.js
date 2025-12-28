const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const nix = {
    nix: {
        name: "cupidon",
        aliases: ["love"],
        author: "Samy Charles",
        version: "2.0",
        cooldowns: 5,
        role: 0,
        description: "Compatibilité amoureuse en image 💘",
        category: "FUN",
        guide: "Use: /cupidon @user1 @user2"
    },

    onStart: async function ({ message, args, bot }) {

        if (args.length < 2) {
            return message.reply("❌ Utilisation : /cupidon @user1 @user2");
        }

        const user1 = args[0].replace("@", "");
        const user2 = args[1].replace("@", "");

        // 🎯 Pourcentage aléatoire réaliste
        const percent = Math.floor(Math.random() * 61) + 40; // 40–100

        // 🖼️ Canvas
        const width = 800;
        const height = 400;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // 🎨 Fond
        ctx.fillStyle = "#ffe6f0";
        ctx.fillRect(0, 0, width, height);

        // 💖 Titre
        ctx.fillStyle = "#ff4d88";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("💘 LOVE MATCH 💘", width / 2, 50);

        // 📷 Photos de profil Telegram
        const getAvatar = async (username) => {
            try {
                const user = await bot.telegram.getChat("@" + username);
                if (!user.photo) return null;
                const file = await bot.telegram.getFile(user.photo.big_file_id);
                const url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
                const img = await loadImage((await axios.get(url, { responseType: "arraybuffer" })).data);
                return img;
            } catch {
                return null;
            }
        };

        const avatar1 = await getAvatar(user1);
        const avatar2 = await getAvatar(user2);

        // 🧑 Avatar gauche
        if (avatar1) ctx.drawImage(avatar1, 80, 100, 120, 120);
        // 🧑 Avatar droite
        if (avatar2) ctx.drawImage(avatar2, 600, 100, 120, 120);

        // 🧾 Noms
        ctx.fillStyle = "#333";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(user1, 140, 250);
        ctx.fillText(user2, 660, 250);

        // ❤️ Barre de progression
        const barX = 200;
        const barY = 300;
        const barWidth = 400;
        const barHeight = 25;

        ctx.fillStyle = "#ddd";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "#ff3366";
        ctx.fillRect(barX, barY, (percent / 100) * barWidth, barHeight);

        // 📊 Pourcentage
        ctx.fillStyle = "#000";
        ctx.font = "bold 24px Arial";
        ctx.fillText(`${percent}%`, width / 2, barY - 10);

        // 📤 Envoi image
        const buffer = canvas.toBuffer("image/png");
        return message.replyWithPhoto({ source: buffer });
    }
};

module.exports = nix;
