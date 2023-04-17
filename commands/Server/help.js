const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "help",
    description: "help",
    async run (bot, message, args) {

        let embed = new MessageEmbed()
        .setTitle("Список команд бота")
        .setColor(16505678)
        // .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
        // .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
    		.setTimestamp()
        .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
        .setDescription(`**Модерация:**\n!mute - выдача мута пользователю\n!unmute - снятие мута пользователю\n!kick - кикнуть пользователя с сервера\n!ban - забанить пользователя на сервере\n!unban - разбанить пользователя на сервере\n\n**Управление приватами:**\n!voice-kick - выгнать пользователя из вашего кастомного привата\n!voice-rename - изменить название вашего кастомного привата\n!voice-limit - изменить лимит пользователей вашего кастомного привата\n\n**Прочее:**\n!avatar - посмотреть аватар пользователя`);
        await message.reply({ embeds: [embed] });
    }
}
