const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "radio",
    run: async (bot, message, args) => {
        try {
            await message.delete()

            if(!message.member.roles.cache.some(r => botconfig.radiorole.some(role => r.id == role))){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setDescription("Недостаточно прав!");
                return message.channel.send({ embeds: [err] });
            }

            let member = message.mentions.members.first()
            if(!member){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setDescription("Недостаточно аргументов \"@user\"");
                return message.channel.send({ embeds: [err] });
            }

            if(member.roles.cache.has("780121151862341632")){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setDescription("У данного пользователя уже имеется такая роль");
                return message.channel.send({ embeds: [err] });
            }

            await member.roles.add("780121151862341632")

            let embed = new MessageEmbed()
            .setColor(16505678)
            .setDescription(`Директор радиостанции **${message.author}** \`[ID: ${message.author.id}]\` выдал роль **<@&780121151862341632>** пользователю ${member} \`[ID: ${member.id}]\`.`)

            await message.channel.send({ embeds: [embed] })

        } catch (err) {
            console.log(err);
        }
    },
};
