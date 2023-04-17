const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "fammembers",
    description: "addmod",
    async run (bot, message, args) {
        const name = args.slice(0).join(" ");
        const fam_db = await Families.findOne({ name: `${name}`})
        if(!fam_db){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Семья не найдена!");
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

        const description = [];
          for(let i = 0; i < fam_db.members_id.length; i++) {
              description.push(`<@${fam_db.members_id[i]}>`);
          }

        let embed = new MessageEmbed()
        .setTitle(`Список участников семьи "${fam_db.name}"`)
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(description.join("\n"));
        await message.reply({ embeds: [embed] });

    }
}
