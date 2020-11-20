const money = require("../money.json");

module.exports.run = async (bot, message, args) => {

    let user = message.mentions.users.first() || bot.users.cache.get(args[0]);

    const m = await message.channel.send("BROKE NIGGA ALERT");
    m.edit(`Now, I ain't sayin' she a gold digger \n(when I'm in need) But she ain't messin' with no broke niggas.`);

    if (user) {
        message.channel.send(`BROKE NIGGA ALERT: ${bot.users.cache.get(user.id)} IS A BROKE NIGGA`)
        return message.channel.send(`THEY ONLY HAVE $${money[user.id].money} HAHAHAHA`)
    } 
    message.channel.send("BROKE NIGGA ALERT");

}

module.exports.help = {
    name: "broke",
    aliases: []
}