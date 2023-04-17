const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famcolor",
    description: "addmod",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.stmodrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.reply({ embeds: [err] });
        }

        const name = args.slice(1).join(" ");

        if(!name){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите название семьи!");
            return message.reply({ embeds: [err] });
        }

        const fam_db = await Families.findOne({ name: `${name}` })

        if(!fam_db){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Семьи с таким названием не существует!");
          return message.reply({ embeds: [err] });
        }

            if(fam_db.сolor == args[0]){
              const err = new MessageEmbed()
              .setTitle("Ошибка")
              .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
              .setColor(16505678)
              .setTimestamp()
              .setDescription("Укажите другой цвет.");
              return message.reply({ embeds: [err] });
            }

            let embed = new MessageEmbed()
              .setTitle("Изменение семьи")
              .setColor(16505678)
        		  .setTimestamp()
              .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
              .setDescription(`Модератор ${message.author} изменил цвет семьи "${fam_db.color}" на "${args[0]}".`);
            message.reply({ embeds: [embed] });

            await fam_db.update({
              color: args[0],
            })

            await message.guild.roles.edit(`${fam_db.role_id}`, { color: `${args[0]}` })

    }
}
