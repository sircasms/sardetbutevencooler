const money = require("../money.json");
const fs = require("fs");
const { parse } = require("path");
const { monitorEventLoopDelay } = require("perf_hooks");

module.exports.run = async (bot, message, args) => {

    let user = message.mentions.users.first() || bot.users.cache.get(args[0]);

    // BABY-PROOFER
    if (!user) return message.reply("Can't find who you're paying, retard.");
    if (!args[1]) return message.reply("Tell me how much you want to pay them, retard.");
    if (isNaN(args[1])) return message.reply("You can only give people NUMBERS, retard.")
    try {
        var bet = parseFloat(args[0]);
    } catch {
        return message.reply("Enter WHOLE numbers, retard");
    }
    if (!money[message.author.id]) return message.reply("You don't have any money to send them lmao. BROKE NIGGA ALERT");
    if (parseInt(args[1]) > money[message.author.id].money) return message.reply("You don't have enough money lmao. BROKE NIGGA ALERT");
    if (parseInt(args[1]) < 0) return message.reply("You can't give someone a negative amount of money, retard.");

    if (!money[user.id]) {

        money[user.id] = {
            name: bot.users.cache.get(user.id),
            money: parseInt(args[1]),
            paid: 0,
            rec: 0,
            lost: 0,
            won: 0,
            dly: 0
        }

        money[message.author.id].money -= parseInt(args[1]); 

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

    } else {

        money[message.author.id].money -= parseInt(args[1]);
        money[message.author.id].paid += parseInt(args[1]);
        money[user.id].money += parseInt(args[1]);
        money[user.id].rec += parseInt(args[1]);

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        })

    }

    return message.channel.send(`${message.author} payed $${parseInt(args[1])} to ${bot.users.cache.get(user.id)}. Total paid: ${money[message.author.id].paid}`)

}

module.exports.help = {
    name: "pay",
    aliases: []
}