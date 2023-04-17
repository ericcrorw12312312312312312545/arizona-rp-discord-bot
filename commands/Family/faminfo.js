const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "faminfo",
    description: "addmod",
    async run (bot, message, args) {
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
          .setDescription("Семья с таким названием не существует!");
          return message.reply({ embeds: [err] });
        }

        let amount = message.guild.roles.cache.get(fam_db.role_id).members.size

        let embed = new MessageEmbed()
        .setTitle(`Информация о семье "${fam_db.name}"`)
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Лидер: <@${fam_db.leader_id}>\nЗаместители: ${fam_db.zams_id.map(y => `<@${y}>`).join(', ')}\nРоль: <@&${fam_db.role_id}>\nЦвет: \`${fam_db.color}\`\nУчастников: \`${amount}\`\nОпыт: \`${fam_db.exp}\`\n\nДата создания: <t:${~~(fam_db.created_at/1000)}:F>`);
        await message.reply({ embeds: [embed] });

    }
}
