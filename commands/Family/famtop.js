const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famtop",
    description: "addmod",
    async run (bot, message, args) {
        const fam_db = await Families.find().sort({"exp": -1})

        let desc = ""
        if(fam_db?.length > 0) {
           for(let i = 0; i < fam_db.length; i++) {
              desc += `<@&${fam_db[i].role_id}> | Лидер: <@${fam_db[i].leader_id}> | Участников: ${fam_db[i].members_id.length} | Опыта: ${fam_db[i].exp}\n`
           }
        }

        let embed = new MessageEmbed()
        .setTitle(`Топ семей`)
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(desc);
        await message.reply({ embeds: [embed] });

    }
}
