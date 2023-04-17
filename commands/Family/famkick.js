const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famkick",
    description: "addmod",
    async run (bot, message, args) {
        let member = message.mentions.members.first()
        const id = member?.id ?? args[0]
        const name = args.slice(1).join(" ");
        const fam_db = await Families.findOne({ name: `${name}`})
        if(fam_db.leader_id != message.author.id & !fam_db.zams_id.includes(message.author.id) ){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Вы не лидер/заместитель семьи!");
            return message.reply({ embeds: [err] });
        }

        if(!name){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Отсутствует название семьи!");
            return message.reply({ embeds: [err] });
        }

        if(!fam_db.members_id.includes(id)){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Пользователь не состоит в вашей семье.");
          return message.reply({ embeds: [err] });
        }

        if(fam_db.zams_id.includes(id)){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Пользователь является замом семьи.");
          return message.reply({ embeds: [err] });
        }

        if(fam_db.leader_id == id){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Пользователь является лидером семьи.");
          return message.reply({ embeds: [err] });
        }

        let embed = new MessageEmbed()
        .setTitle("Изменение семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Вы успешно кикнули <@${id}> из семьи <@&${fam_db.role_id}>.`);
        await message.reply({ embeds: [embed] });

        await fam_db.updateOne(
          {$pull: { members_id: id } },
        )

        await message.guild.members.cache.get(id).roles.remove(fam_db.role_id)

    }
}
