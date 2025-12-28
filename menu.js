const fs = require("fs");

const nix = {
    nix: {
        name: "menu",
        aliases: ["help", "commands"],
        author: "Samy Charles",
        version: "2.0",
        cooldowns: 5,
        role: 0,
        description: "Show kawaii AESTHER menu",
        category: "INFO",
        guide: "Use: /menu"
    },

    onStart: async function ({ message, role, commands }) {

        const userName = message.from?.first_name || "User";
        const myName = "Samy Charles";
        const myUID = "61582382664051";
        const prefix = "/";

        // 🔹 Build categories
        const categories = {};
        for (const [name, cmd] of commands) {
            if (cmd.nix?.role > role) continue;
            const cat = cmd.nix?.category || "Misc";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(name);
        }

        // 🌸 Build kawaii menu
        let msg = `
╭━━〔 🌸✨ ﹝@ 𝗔𝗘𝗦𝗧𝗛𝗘𝗥🍀🥙﹞ 〕━━┈⊷
┃🪐╭───────────────────────────
┃🪐│ 🤖 BOT : 𝗔𝗘𝗦𝗧𝗛𝗘𝗥 🌸
┃🪐│ 👤 USER : ⵌ︳「${userName}」
┃🪐│ 👑 OWNER : ${myName} | ${myUID}
┃🪐│ 💻 DEV : ${myName}
┃🪐│ 🧬 VERSION : 2.0 Kawaii
┃🪐│ 🌍 MODE : Public 🍀
┃🪐│ ⚙️ PREFIX : [ ${prefix} ]
┃🪐╰───────────────────────────
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷

╭━━〔 🪐 COMMAND MENU 🌸✨ 〕━━┈⊷
`;

        Object.keys(categories).sort().forEach(cat => {
            msg += `┃🪐│ ✧ ${cat.toUpperCase()} 🍀\n`;
            categories[cat].sort().forEach(cmdName => {
                msg += `┃🪐│    ➳ ${prefix}${cmdName}\n`;
            });
            msg += "┃🪐│ ────────────────────────\n";
        });

        msg += `
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷
💌 Powered by ${myName} 🌸✨
`;

        return message.reply(msg);
    }
};

module.exports = nix;
