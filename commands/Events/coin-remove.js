const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Coins = require('../../schemas/Coins')

module.exports = {
    name: "coin-remove",
    description: "addmod",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.steventrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.channel.send({ embeds: [err] });
        }

        let member = message.mentions.members.first()
        const reason = args.slice(2).join(" ");

        if(!member){
            const err1 = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите, кому Вы хотите снять ивент коины.");
            return message.channel.send({ embeds: [err1] });
        }
        if(member.id === message.author.id){
            const err2 = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription("Невозможно снять коины себе.");
            return message.channel.send({ embeds: [err2] });
        }

        const embed = new MessageEmbed()
        .setTitle("Снятие коинов")
        .setColor(16505678)
        .setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`Пользователю ${member} было снято ${args[1]} коинов.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);

        const req_db = await Coins.findOne({ DiscordID: member.id })

        if(!req_db){
          const embed1 = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(16505678)
          .setTimestamp()
          .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
          .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
          .setDescription(`Пользователя нет коинов`);
          return message.reply({ embeds: [embed1] });
        } else {
          if(req_db.coins < Number(args[1])){
            const embed1 = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription(`У пользователя недостаточно коинов`);
            return message.reply({ embeds: [embed1] });
          }
          req_db.coins -= Number(args[1])

          req_db.save()

          await bot.channels.cache.get("973248457290694706").send({ embeds: [embed] });
          return message.reply({ embeds: [embed] });
        }
    }
}
