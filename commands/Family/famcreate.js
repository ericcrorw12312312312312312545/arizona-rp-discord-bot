const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famcreate",
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
            .setDescription("Отсутствует название семьи!");
            return message.reply({ embeds: [err] });
        }

        const fam_db = await Families.findOne({ name: `${name}` })
        if(fam_db){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Семья с таким названием уже существует!");
          return message.reply({ embeds: [err] });
        }

        let role = await message.guild.roles.create({
            name: `${name}`,
            position: 18,
            reason: 'Создание семьи.',
        })

        await Families.create({
          name: name,
          role_id: role.id,
  				created_at: Date.now(),
          leader_id: message.author.id,
  			})

        await message.guild.members.cache.get(message.author.id).roles.add(role.id)

        let embed = new MessageEmbed()
        .setTitle("Создание семьи")
        .setColor(16505678)
    		.setTimestamp()
        .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        .setDescription(`Модератор ${message.author} создал семью <@&${role.id}>.`);
        await message.reply({ embeds: [embed] });

    }
}
