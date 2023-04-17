const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Embeds = require('../../schemas/Embeds')

module.exports = {
    name: "send-embed",
    description: "set-title",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.eventrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return reply({ embeds: [err] });
        }
        let req_db = await Embeds.findOne({ _id: "626ac2059c557a2d70b2f8c9" })
        await message.delete()
        let embed = new MessageEmbed()
        .setAuthor({ "iconURL": message.author.avatarURL(), "name": `${message.member.displayName}` })
        // .setContent(req_db.content)
        .setTitle(req_db.title)
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setThumbnail(req_db.thumbnail)
        .setImage(req_db.image)
        .setDescription(req_db.description);
        await message.channel.send({ embeds: [embed] });
    }
}
