const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Moderators = require('../../schemas/Moderators')

module.exports = {
    name: "moderators",
    description: "addmod",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.modrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.channel.send({ embeds: [err] });
        }
        const data = await Moderators.find({})

        let desc = ""
        if(data?.length > 0) {
           for(let i = 0; i < data.length; i++) {
              desc += `<@${data[i].DiscordID}> | ${data[i].punishment}/3\n`
           }
        }
        let embed = new MessageEmbed()
        .setTitle("Список модераторов")
        .setColor(16505678)
            .setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`**Никнейм | Количество выговоров**\n${desc}`);
        await message.reply({ embeds: [embed] });

    }
}
