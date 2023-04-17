const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')
const giveroles = require('../../config').giveroles

module.exports = {
    name: "unrole",
    run: async (bot, message, args) => {
        try {
            if(!message.member.roles.cache.some(r => botconfig.giverole.some(role => r.id == role))){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
                .setTimestamp()
                .setColor(16505678)
                .setDescription("Недостаточно прав!");
                return message.reply({ embeds: [err] });
            }

            let member = message.mentions.members.first()
            if(!member){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
                .setTimestamp()
                .setColor(16505678)
                .setDescription("Недостаточно аргументов \"@user\"");
                return message.reply({ embeds: [err] });
            }

           if(!member.roles.cache.some(r => botconfig.giveroles.some(role => r.id == role))){
               const err = new MessageEmbed()
               .setTitle("Ошибка")
               .setColor(16505678)
               .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
               .setTimestamp()
               .setDescription("У пользователя нет фракционных ролей.");
               return message.reply({ embeds: [err] });
           }



            let embed = new MessageEmbed()
            .setColor(16505678)
            .setDescription(`Вы сняли организационные роли пользователю ${member} \`[ID: ${member.id}]\`.`)
            .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
            .setTimestamp()

            await message.reply({ embeds: [embed] })

            await giveroles.map((hzzz) => {
                if(member.roles.cache.get(hzzz)) {
                    member.roles.remove(hzzz)
                }
            })
        } catch
        (err) {
            console.log(err);
        }
    },
};
