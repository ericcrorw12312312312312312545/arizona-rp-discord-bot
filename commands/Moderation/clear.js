const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "clear",
    description: "kicks a member from the server",
    async run (bot, message, args) {
        await message.delete()
        if(!message.member.roles.cache.some(r => botconfig.modrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.channel.send({ embeds: [err] });
        }
        if(!args[0]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите количество сообщений, которые необходимо удалить");
            return message.channel.send({ embeds: [err] });
        }
        await message.channel.bulkDelete(args[0]);
        let embed = new MessageEmbed()
            .setTitle("Очистка сообщений")
            .setColor(16505678)
            .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
            .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
        	.setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription(`Удалено \`${args[0]}\` сообщений.`);
        await message.channel.send({ embeds: [embed] });
        
      let clearmessage = new MessageEmbed()
		.setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
		.setTitle("Очистка сообщений")
		.setColor(16505678)
		.setDescription(`В канале <#${message.channel.id}> удалено \`${args[0]}\` сообщений.`)
		.setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		await bot.channels.cache.get("695387351215505489").send({ embeds: [clearmessage] });
    }
}