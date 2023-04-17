const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famdelete",
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
        const name = args.slice(0).join(" ");
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

        await message.guild.roles.delete(fam_db.role_id)

        await Families.deleteOne({ name: `${name}` })


        let embed = new MessageEmbed()
        .setTitle("Удаление семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Модератор ${message.author} удалил семью "${fam_db.name}".`);
        await message.reply({ embeds: [embed] });

    }
}
