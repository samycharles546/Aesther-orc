const nix = {
    nix: {
        name: "slot",
        aliases: ["slots", "casino"],
        author: "Samy Charles",
        version: "1.0",
        cooldowns: 5,
        role: 0,
        description: "Play slot machine 🎰",
        category: "GAME",
        guide: "Use: /slot"
    },

    onStart: async function ({ message }) {

        const fruits = ["🍒", "🍋", "🍉", "🍇", "🍎", "⭐"];

        const r1 = fruits[Math.floor(Math.random() * fruits.length)];
        const r2 = fruits[Math.floor(Math.random() * fruits.length)];
        const r3 = fruits[Math.floor(Math.random() * fruits.length)];

        let result;
        if (r1 === r2 && r2 === r3) {
            result = "🎉 JACKPOT ! Tu as gagné 🌸✨";
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            result = "😄 Presque ! Deux symboles identiques 🍀";
        } else {
            result = "💔 Perdu… retente ta chance 🌸";
        }

        const msg = `
╭━━〔 🎰 AESTHER SLOT 〕━━┈⊷
┃
┃   ${r1}  │  ${r2}  │  ${r3}
┃
┃ ${result}
┃
╰━━━━━━━━━━━━━━━━━━━━━━┈⊷
`;

        return message.reply(msg);
    }
};

module.exports = nix;
