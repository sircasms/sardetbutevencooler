const Discord = require("discord.js");
const money = require("../money.json");
const fs = require("fs");
const { monitorEventLoopDelay } = require("perf_hooks");

module.exports.run = async (bot, message, args) => {

    // BABY-PROOFING
    if (!money[message.author.id] || money[message.author.id].money <= 0) return message.reply("You don't have any money, broke ass bitch.\nTry collecting the daily with s&daily");
    if (money[message.author.id].money < parseInt(args[0])) return message.reply("You don't have that much money, broke ass bitch");
    if (!args[0]) return message.reply("Tell me how much you want to bet, retard.")
    try {
        var bet = parseFloat(args[0]);
    } catch {
        return message.reply("Enter WHOLE numbers, retard");
    }
    if (isNaN(bet)) return message.reply("You can only steal in NUMBERS, retard.")

    let chances = ["win", "lose"];
    var pick = chances[Math.floor(Math.random() * chances.length)];
    var bet = parseInt(args[0]);

    if (pick == "lose") {

        money[message.author.id].money -= bet;
        money[message.author.id].lost += bet;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        return message.reply(`You flipped a coin and lost ${bet}, retard! Your new balance is: $${money[message.author.id].money}. Total lost: ${money[message.author.id].lost}`);

    } else {

        money[message.author.id].money += bet;
        money[message.author.id].won += bet;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        return message.reply(`You flipped a coin and won ${bet}! Your new balance is: $${money[message.author.id].money}. Total winnings: ${money[message.author.id].won - (250 * money[message.author.id].dly)}`);

    }

}

module.exports.help = {
    name: "flip",
    aliases: []
}