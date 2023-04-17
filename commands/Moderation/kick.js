const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "kick",
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
        let member = message.mentions.members.first()
        if(!member){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите, кого Вы хотите кикнуть. \"@user\"");
            return message.channel.send({ embeds: [err] });
        }
        if(member.id === message.author.id){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription("Невозможно кикнуть себя");
            return message.channel.send({ embeds: [err] });
        }
        const reason = args.slice(1).join(" ");
        await message.guild.members.cache.get(member.id).kick(reason);

        let embed = new MessageEmbed()
        .setTitle("Кик")
        .setColor(16505678)
        .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
        // .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
    		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`Пользователь ${member} был кикнут.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await message.channel.send({ embeds: [embed] });

        let kickmessage = new MessageEmbed()
    		.setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
    		.setTitle("Кик")
    		.setColor(16505678)
    		.setDescription(`Пользователь ${member} был кикнут.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`)
    		// .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
    		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		await bot.channels.cache.get("695387351215505489").send({ embeds: [kickmessage] });
    }
}
