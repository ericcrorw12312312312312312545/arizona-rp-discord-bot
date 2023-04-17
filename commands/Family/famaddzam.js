const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famaddzam",
    description: "addmod",
    async run (bot, message, args) {
        const fam_leader = await Families.findOne({ leader_id: `${message.author.id}` })
        if(!message.member.roles.cache.some(r => botconfig.stmodrole.some(role => r.id == role)) & !fam_leader){
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

        if(fam_db.zams_id.includes(id) || fam_db.leader_id == id){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Данный пользователь и так заместитель/лидер данной семьи.");
          return message.reply({ embeds: [err] });
        }

        if(!message.guild.members.cache.get(id).roles.cache.has(fam_db.role_id)){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Данный пользователь не состоит в указанной семье.");
          return message.reply({ embeds: [err] });
        }

        if(fam_db.zams_id.length >= 3){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Достигнут лимит заместителей семьи. Лимит - 3.");
          return message.reply({ embeds: [err] });
        }

        await fam_db.updateOne(
          {$push: { zams_id: id }},
        )

        let embed = new MessageEmbed()
        .setTitle("Изменение семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Модератор ${message.author} назначил <@${id}> заместителем семьи <@&${fam_db.role_id}>.`);
        await message.reply({ embeds: [embed] });

    }
}
