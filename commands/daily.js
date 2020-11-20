const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");
const ms = require("parse-ms");
const cooldowns = require("../cooldowns.json");
const { monitorEventLoopDelay } = require("perf_hooks");

module.exports.run = async (bot, message, args) => {

    let timeout = 43200000;
    let reward = 250;
    var user = message.author;

    let embed = new Discord.MessageEmbed();
    embed.setTitle("Daily Reward");

    if (!money[user.id]){

        money[user.id] = {
            name: bot.users.cache.get(user.id).tag,
            money: reward,
            paid: 0,
            rec: 0,
            lost: 0,
            won: reward,
            dly: 1
        }

        fs.writeFile("./money.json", JSON.stringify(money), err => {
            if (err) {
                console.log(err);
            }
        })

        if (!cooldowns[user.id]) {
            cooldowns[user.id] = {
                name: bot.users.cache.get(user.id).tag,
                daily: Date.now()
            }
            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), err => {
                if (err) console.log(err);
            });

        } else {
            cooldowns[user.id].daily = Date.now();
            fs.writeFile("./daily.json", JSON.stringify(cooldowns), err => {
                if (err) console.log(err);
            })
        }

        embed.setDescription(`You've collected your daily reward of ${reward}, your balance is now ${money[user.id].money}. Dailys Claimed: ${money[user.id].dly}`);
        embed.setColor("00ff00");
        return message.channel.send(embed);

    } else {

        if (!cooldowns[user.id]) {
            cooldowns[user.id] = {
                name: bot.users.cache.get(user.id).tag,
                daily: Date.now()
            }

            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), err => {
                if (err) console.log(err);
            });

            money[user.id].money += reward;
            money[user.id].dly += 1;
            money[user.id].won += reward;
            fs.writeFile("./money.json", JSON.stringify(money), err => {
                if (err) {
                    console.log(err);
                }
            })

            embed.setDescription(`You've collected your daily reward of ${reward}, your balance is now ${money[user.id].money}. Dailys claimed: ${money[user.id].dly}`);
            embed.setColor("00ff00");
            return message.channel.send(embed);

        } else {

            if (timeout - (Date.now() - cooldowns[user.id].daily) > 0) {

                let time = ms(timeout - (Date.now() - cooldowns[user.id].daily));

                embed.setColor("ff0000");
                embed.setDescription(`**You've already collected your daily reward!**`);
                embed.addField(`Collect again in: `, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.channel.send(embed);

            } else {

                money[user.id].money += reward;
                money[user.id].won += reward;
                if (!money[user.id].dly) {
                    money[user.id].dly = 1;
                } else {
                    money[user.id].dly += 1;
                }
                fs.writeFile("./money.json", JSON.stringify(money), err => {
                    if (err) {
                        console.log(err);
                    }
                })
            
                cooldowns[user.id].daily = Date.now();
                fs.writeFile("./daily.json", JSON.stringify(cooldowns), err => {
                    if (err) console.log(err);
                })
            

                embed.setDescription(`You've collected your daily reward of ${reward}, your balance is now ${money[user.id].money}. Dailys Claimed: ${money[user.id].dly}`);
                embed.setColor("00ff00");
                return message.channel.send(embed);
            }

        }
    }

}

module.exports.help = {
    name: "daily",
    aliases: ["d"]
}