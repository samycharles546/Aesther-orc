const nix = {
    nix: {
        name: "stars",
        aliases: [],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 3,
        role: 0,
        description: "Send welcome stars message",
        category: "INFO",
        guide: "Use: /stars"
    },

    onStart: async function ({ message }) {

        const userName = message.from?.first_name || "there";

        const msg = `✨ Hey, ${userName} ⭐

Press /menu or /ai (questions) to start the discussion.
Thank you 💖`;

        return message.reply(msg);
    }
};

module.exports = nix;
