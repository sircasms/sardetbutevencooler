money = require("../money.json");

module.exports.run = async (bot, message, args) => {
    
    if (!args[0]){
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }

    if (!money[user.id]) return message.reply("You don't have an account yet, retard. Start with s&balance or s&daily.");

    return message.channel.send(`**STATS FOR ${user}:**
        Current balance: $${money[user.id].money}
        Total Paid: ${money[user.id].paid}
        Total Received: ${money[user.id].rec}
        Total Won(Including Daily): ${money[user.id].won}
        Total Won(Excluding Daily): ${money[user.id].won - (250 * money[user.id].dly)} 
        Total Lost: ${money[user.id].lost}
        Dailys Claimed: ${money[user.id].dly}\n`);

}

module.exports.help = {
    name: "stat",
    aliases: ["stats"]
}