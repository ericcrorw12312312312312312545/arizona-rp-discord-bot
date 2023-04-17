const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famleave",
    description: "addmod",
    async run (bot, message, args) {
        const fam_leader = await Families.findOne({ leader_id: `${message.author.id}` })
        if(fam_leader){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Лидер не может покинуть семью, обратитесь к Модерации, чтобы решить проблеиу!");
            return message.reply({ embeds: [err] });
        }

        const fam_zam = await Families.findOne({ zams_id: `${message.author.id}` })
        if(fam_zam){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Заместитель не может покинуть семью, обратитесь к Модерации, чтобы решить проблеиу!");
            return message.reply({ embeds: [err] });
        }

        const fam_db = await Families.findOne({ members_id: `${message.author.id}`})

        if(!fam_db){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Вы не состоите в семье.");
          return message.reply({ embeds: [err] });
        }

        let embed = new MessageEmbed()
        .setTitle("Уход из семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Вы успешно покинули семью <@&${fam_db.role_id}>.`);
        await message.reply({ embeds: [embed] });

        await fam_db.updateOne(
          {$pull: { members_id: message.author.id } },
        )

        await message.guild.members.cache.get(message.author.id).roles.remove(fam_db.role_id)

    }
}
