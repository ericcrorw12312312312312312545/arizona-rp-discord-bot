const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')
const FamTemp = require('../../schemas/FamTemp')

module.exports = {
    name: "faminvite",
    description: "addmod",
    async run (bot, message, args) {
        const fam_leader = await Families.findOne({ leader_id: `${message.author.id}` })
        const fam_zam = await Families.findOne({ zams_id: `${message.author.id}` })
        if(!fam_leader & !fam_zam){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Вы не являетесь лидером/заместителем ни одной из семей!");
            return message.reply({ embeds: [err] });
        }

        let member = message.mentions.members.first()
        const id = member?.id ?? args[0]
        const fam_db = await Families.findOne({ leader_id: `${message.author.id}`}) || await Families.findOne({ zams_id: `${message.author.id}`})

        if(fam_db.members_id.includes(id)){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Данный пользователь уже состоит в указанной семье.");
          return message.reply({ embeds: [err] });
        }

        const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId(`famaccept`)
          .setLabel(`Вступить`)
          .setStyle('PRIMARY'),
        )
        const fam_temp_db = await FamTemp.findOne({ DiscordID: `${id}`})

        if(fam_temp_db){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Данный пользователь уже приглашен в семью, ожидайте принятия/отклонения другой заявки.");
          return message.reply({ embeds: [err] });
        }

        await message.delete()

        let embed = new MessageEmbed()
        .setTitle("Приглашение в семью")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Лидер/заместитель ${message.author} пригласил вас в семью <@&${fam_db.role_id}>.`);
        let created_msg = await message.channel.send({ content: `<@${id}>`, embeds: [embed], components: [row] });



        await FamTemp.create({
          DiscordID: id,
          created_at: Date.now(),
          role_id: fam_db.role_id,
          created_msg: created_msg.id,
          channel_id: message.channel.id,
        })

    }
}
