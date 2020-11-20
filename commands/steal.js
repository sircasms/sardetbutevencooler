const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");
const ms = require("parse-ms");
const cooldowns = require("../cooldowns.json");
const { monitorEventLoopDelay } = require("perf_hooks");

module.exports.run = async (bot, message, args) => {

    let embed = new Discord.MessageEmbed();
    embed.setTitle("Steal Attempt");

    let user = message.mentions.users.first() || bot.users.cache.get(args[0]);

    var stealcooldown = 14400000;
    
    if (!user) return message.reply("Can't find who you're stealing from, retard.");
    if (!args[1]) return message.reply("Tell me how much you want to steal from them, retard.");
    try {
        var bet = parseFloat(args[0]);
    } catch {
        return message.reply("Enter WHOLE numbers, retard");
    }
    if (isNaN(args[1])) return message.reply("You can only steal in NUMBERS, retard.");
    if (!money[message.author.id]) return message.reply("You don't have an account yet, retard.");
    if (parseInt(args[1]) < 0) return message.reply("You can't steal a negative amount of money, retard. Just pay them or something.");
    if (!money[user.id]) return message.reply("The person you're stealing from doesn't have any money, retard.");
    if (!money[user.id].money) return message.reply("The person you're stealing from doesn't have any money, retard.");
    if (parseInt(args[1]) > money[user.id].money) return message.reply(`They only have $${money[user.id].money}, retard.`);

    var stealamount = parseInt(args[1]);

    if (stealamount > 2 * (money[message.author.id].money)) return message.reply("You can't try to steal for more than double your money!");

    if (!cooldowns[message.author.id].steal){

        cooldowns[message.author.id].steal = Date.now();
        fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
            if (err) console.log(err);
        });
        
        var pick = Math.floor((Math.random() * 100) + 1);
        var stealchance = ((stealamount / (2 * money[message.author.id].money) * 100) + 30);

        if (100 - stealchance > 0) {
            var chance = 100 - stealchance;
        } else{
            var chance = 0;
        }

        if (pick >= stealchance){

            money[message.author.id].money += stealamount;
            money[message.author.id].won += stealamount;
            money[user.id].money -= stealamount;
            money[user.id].lost += stealamount;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });

            return message.channel.send(`${message.author} has stolen ${stealamount} from ${user}, with a ${chance}% chance of doing so.`);

        } else {

            money[message.author.id].money -= (stealamount/2);
            money[message.author.id].lost += (stealamount/2);
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });

            return message.channel.send(`${message.author} has attempted to steal $${stealamount} from ${user} with a ${chance}% chance of doing so, and failed. Penalty: $${stealamount/2}`);

        }

    } else {

        if (stealcooldown - (Date.now() - cooldowns[user.id].steal) > 0) {

            let time = ms(stealcooldown - (Date.now() - cooldowns[message.author.id].steal));

            embed.setColor("ff0000");
            embed.setDescription(`**You can only steal every 4 hours!**`);
            embed.addField(`Try again in: `, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
            return message.channel.send(embed);

        } else {

            cooldowns[message.author.id].steal = Date.now();
            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
            if (err) console.log(err);
            });
        
            var pick = Math.floor((Math.random() * 100) + 1);
            var stealchance = ((stealamount / (2 * money[message.author.id].money) * 100) + 30);

            if (100 - stealchance > 0) {
                var chance = 100 - stealchance;
            } else{
                var chance = 0;
            }

            if (pick >= stealchance){

                money[message.author.id].money += stealamount;
                money[message.author.id].won += stealamount;
                money[user.id].money -= stealamount;
                money[user.id].lost += stealamount;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                   if (err) console.log(err);
                });

                return message.channel.send(`${message.author} has stolen ${stealamount} from ${user}, with a ${chance}% chance of doing so.`);

            } else {

                money[message.author.id].money -= stealamount/2;
                money[message.author.id].lost += stealamount/2;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) console.log(err);
                });

                return message.channel.send(`${message.author} has attempted to steal $${stealamount} from ${user} with a ${chance}% chance of doing so, and failed. Penalty: $${stealamount/2}`);

            }

        }

    }
    

}

module.exports.help = {
    name: "steal",
    aliases: []
}