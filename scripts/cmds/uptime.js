const nix = {
    nix: {
        name: "uptime",
        aliases: ["up", "runtime"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 5,
        role: 0,
        description: "Show bot uptime",
        category: "INFO",
        guide: "Use: /uptime"
    },

    onStart: async function ({ message }) {
        const totalSeconds = process.uptime();

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const uptimeText = `
╭━━〔 ⏱️ AESTHER UPTIME 〕━━┈⊷
┃ 🤖 Bot : AESTHER
┃ 🧬 Status : Online
┃ ⏰ Uptime :
┃    ${days}d ${hours}h ${minutes}m ${seconds}s
╰━━━━━━━━━━━━━━━━━━━━━━┈⊷
`;

        return message.reply(uptimeText);
    }
};

module.exports = nix;
