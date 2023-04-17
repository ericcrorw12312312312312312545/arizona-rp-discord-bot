const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Families = require('../../schemas/Families')

module.exports = {
    name: "famrename",
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

        if(!fam_db){
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setColor(16505678)
          .setTimestamp()
          .setDescription("Семьи с таким названием не существует!");
          return message.reply({ embeds: [err] });
        }

        let embed = new MessageEmbed()
          .setTitle("Изменение семьи")
          .setColor(16505678)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`Следующим сообщением введите новое название для семьи.`);
        message.reply({ embeds: [embed] });

        const filter = messages => messages.author.id == message.author.id && !messages.author.bot
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 15000 });

          collector.on('collect', async(m) => {
            if(fam_db.name == m.content){
              const err = new MessageEmbed()
              .setTitle("Ошибка")
              .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
              .setColor(16505678)
              .setTimestamp()
              .setDescription("Данный пользователь и так лидер данной семьи.");
              return message.reply({ embeds: [err] });
            }
            await message.channel.bulkDelete(2);
            let embed = new MessageEmbed()
              .setTitle("Изменение семьи")
              .setColor(16505678)
        		  .setTimestamp()
              .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
              .setDescription(`Модератор ${message.author} изменил название семьи "${fam_db.name}" на "${m.content}".`);
            message.reply({ embeds: [embed] });

            await fam_db.update({
              name: m.content,
            })

            await message.guild.roles.edit(`${fam_db.role_id}`, { name: `${m.content}` })

          })

    }
}
