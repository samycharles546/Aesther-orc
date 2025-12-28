const Canvas = require("canvas");
const { randomBytes } = require("crypto");

const defaultFont = `${__dirname}/assets/font/BeVietnamPro-SemiBold.ttf`;
Canvas.registerFont(defaultFont, { family: "BeVietnamPro-SemiBold" });

const rankCmd = {
    nix: {
        name: "rank",
        aliases: ["level", "xp"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 5,
        role: 0,
        description: "Show your kawaii rank as an image",
        category: "INFO",
        guide: "Use: /rank or /rank @user"
    },

    onStart: async function ({ message, event, usersData }) {
        const userID = event.mentions && Object.keys(event.mentions)[0] || message.from.id;
        const userName = event.mentions && Object.values(event.mentions)[0]?.first_name || message.from?.first_name || "User";

        const userData = await usersData.get(userID) || { exp: 0 };
        const exp = userData.exp || 0;

        // Level calculation
        const deltaNext = 5;
        const expToLevel = (exp, delta = deltaNext) => Math.floor((1 + Math.sqrt(1 + 8 * exp / delta)) / 2);
        const levelToExp = (level, delta = deltaNext) => Math.floor(((Math.pow(level, 2) - level) * delta) / 2);

        const level = expToLevel(exp, deltaNext);
        const expNextLevel = levelToExp(level + 1, deltaNext) - levelToExp(level, deltaNext);
        const currentExp = expNextLevel - (levelToExp(level + 1, deltaNext) - exp);

        const allUsers = await usersData.getAll();
        allUsers.sort((a, b) => b.exp - a.exp);
        const rank = allUsers.findIndex(u => u.userID == userID) + 1;

        // --- Canvas setup ---
        const width = 1000;
        const height = 400;
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#fce4ec";
        ctx.fillRect(0, 0, width, height);

        // Sub card
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.roundRect(20, 20, width - 40, height - 40, 30);
        ctx.fill();

        // Draw avatar placeholder
        ctx.fillStyle = "#ffc0cb";
        const avatarSize = 120;
        const avatarX = 60;
        const avatarY = height / 2 - avatarSize / 2;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw texts
        ctx.fillStyle = "#ff4081";
        ctx.font = "bold 40px BeVietnamPro-SemiBold";
        ctx.fillText(userName, 220, 100);

        ctx.fillStyle = "#ff80ab";
        ctx.font = "32px BeVietnamPro-SemiBold";
        ctx.fillText(`Level: ${level}`, 220, 180);
        ctx.fillText(`Exp: ${currentExp}/${expNextLevel}`, 220, 230);
        ctx.fillText(`Rank: #${rank}/${allUsers.length}`, 220, 280);

        // EXP bar
        const barWidth = 600;
        const barHeight = 30;
        const barX = 220;
        const barY = 320;
        ctx.fillStyle = "#ffb6c1";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "#ff4081";
        const filledWidth = Math.floor((currentExp / expNextLevel) * barWidth);
        ctx.fillRect(barX, barY, filledWidth, barHeight);

        // Convert to buffer
        const buffer = canvas.toBuffer("image/png");
        return message.reply({ attachment: buffer });
    }
};

// Add roundRect prototype (for Canvas < 2.11)
Canvas.RenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

module.exports = rankCmd;
