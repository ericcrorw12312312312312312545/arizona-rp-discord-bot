const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Moderators = require('../../schemas/Moderators')

module.exports = {
    name: "unpunish",
    description: "addmod",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.stmodrole.some(role => r.id == role))){
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
            const err1 = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите, какому модератору вы хотите снять выговор.");
            return message.channel.send({ embeds: [err1] });
        }
        if(member.id === message.author.id){
            const err2 = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription("Невозможно снять выговор себе.");
            return message.channel.send({ embeds: [err2] });
        }

            let req_db = await Moderators.findOne({ DiscordID: member.id })

                    if(req_db.punishment === 0){
            const err2 = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription("Невозможно снять выговор. У пользователя 0 выговоров.");
            return message.channel.send({ embeds: [err2] });
        }

            req_db.punishment -= 1

            req_db.save()

 //        await Bones.create({
//  				DiscordID: member.id,
//  			})

        const reason = args.slice(1).join(" ");

        let embed = new MessageEmbed()
        .setTitle("Снятие выговора")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`Модератору ${member} сняли выговор.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await message.reply({ embeds: [embed] });

        let embed1 = new MessageEmbed()
        .setTitle("Снятие выговора")
        .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
        .setColor(16505678)
        .setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`Модератору ${member} был снят выговор.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await bot.channels.cache.get("968222583252213801").send({ embeds: [embed1] });

    }
}
