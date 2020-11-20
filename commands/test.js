module.exports.run = async (bot, message, args) => {

    const m = await message.channel.send("test");
    m.edit(`Nigger. Reply time: ${m.createdTimestamp - message.createdTimestamp} ms`);
    message.channel.send("end");

}

module.exports.help = {
    name: "test",
    aliases: ["t", "nigger"]
}