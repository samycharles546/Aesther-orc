const axios = require("axios");

// 🔤 Conversion gothique
function toGothicStyle(text) {
    const map = {
        A:'𝖠',B:'𝖡',C:'𝖢',D:'𝖣',E:'𝖤',F:'𝖥',G:'𝖦',H:'𝖧',
        I:'𝖨',J:'𝖩',K:'𝖪',L:'𝖫',M:'𝖬',N:'𝖭',O:'𝖮',P:'𝖯',
        Q:'𝖰',R:'𝖱',S:'𝖲',T:'𝖳',U:'𝖴',V:'𝖵',W:'𝖶',X:'𝖷',
        Y:'𝖸',Z:'𝖹',
        a:'𝖺',b:'𝖻',c:'𝖼',d:'𝖽',e:'𝖾',f:'𝖿',g:'𝗀',h:'𝗁',
        i:'𝗂',j:'𝗃',k:'𝗄',l:'𝗅',m:'𝗆',n:'𝗇',o:'𝗈',p:'𝗉',
        q:'𝗊',r:'𝗋',s:'𝗌',t:'𝗍',u:'𝗎',v:'𝗏',w:'𝗐',x:'𝗑',
        y:'𝗒',z:'𝗓',' ':' ','.':'.',',':','
    };
    return text.split('').map(c => map[c] || c).join('');
}

// 🎀 Format réponse
function formatResponse(reply) {
    return `🌸✨ ﹝@ 𝗔𝗘𝗦𝗧𝗛𝗘𝗥🍀🥙﹞  
${toGothicStyle(reply)}`;
}

const nix = {
    nix: {
        name: "ai",
        aliases: ["aesther", "ae"],
        author: "Samycharles",
        version: "2.4.0",
        cooldowns: 3,
        role: 0,
        description: "Chat with Aesther AI",
        category: "AI",
        guide: "Use: {pn} ai <message>"
    },

    onStart: async function ({ message, args }) {
        const q = args.join(" ").trim();
        if (!q) {
            return message.reply("❌ | Écris un message pour Aesther.");
        }

        try {
            await message.reply("⏳ Aesther réfléchit...");

            const res = await axios.get(
                "https://arychauhann.onrender.com/api/gemini-proxy2",
                {
                    params: { prompt: q },
                    timeout: 45000,
                    headers: { "Content-Type": "application/json" }
                }
            );

            const reply =
                res.data?.result?.trim() ||
                "Désolée… je n’ai pas compris la réponse de l’API 🥺";

            await message.reply(formatResponse(reply));

        } catch (err) {
            console.error("❌ Aesther AI error:", err?.message || err);
            await message.reply("❌ | Erreur de connexion avec l’API Aesther.");
        }
    }
};

module.exports = nix;
