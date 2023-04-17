const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famleader",
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

        let member = message.mentions.members.first()
        const id = member?.id ?? args[0]
        const name = args.slice(1).join(" ");
        if(!name){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Отсутствует название семьи!");
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

        if(fam_db.leader_id == id){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Данный пользователь и так лидер данной семьи.");
          return message.reply({ embeds: [err] });
        }

        await fam_db.update({
          leader_id: id,
  			})

        let embed = new MessageEmbed()
        .setTitle("Изменение семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Модератор ${message.author} передал лидерство семьи на <@${id}>.`);
        await message.reply({ embeds: [embed] });

    }
}
