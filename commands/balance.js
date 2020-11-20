const fs = require("fs");
const money = require("../money.json");

module.exports.run = async (bot, message, args) => {

    if (!args[0]){
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }

    if (!money[user.id]){
        money[user.id] = {
            name: bot.users.cache.get(user.id).tag,
            money: 0,
            paid: 0,
            rec: 0,
            lost: 0,
            won: 0,
            dly: 0
        }

        fs.writeFile("./money.json", JSON.stringify(money), err => {
            if (err) {
                console.log(err);
            }
        })
    }

    return message.channel.send(`${bot.users.cache.get(user.id)} has $${money[user.id].money}`);
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}