const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "server-roles",
    run: async (bot, message, args) => {
        try {
            await message.delete()
            
            if(message.member.id != "757483986997084241"){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setDescription("Недостаточно прав!");
                return message.channel.send({ embeds: [err] });
            }
	    
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('first')
                .setLabel(`Сервер 01`)
                .setStyle('SECONDARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('second')
                .setLabel(`Сервер 02`)
                .setStyle('SECONDARY'),
            )
        
            await message.channel.send({ embeds: [{
                title: 'Выбор сервера',
                type: 'rich',
                description: 'Добро пожаловать на discord-сервер проекта SAMP: Жизнь в Деревне!\n' +
                'Здесь ты можешь выбрать роль сервера, на котором ты играешь! Это позволит тебе общаться и обмениваться информацией с игроками твоего сервера онлайн!\n' +
                'Чтобы получить роль Игрового сервера #1 или Игрового сервера #2, необходимо нажать на номер сервера под этим сообщением.\n' +
                'ВАЖНО! Не забудь ознакомиться с правилами нашего discord-сервера, чтобы не нарушать и не получать наказания!\n' +
                'Приятного общения, дорогой друг!😀',
                url: null,
                timestamp: null,
                color: 16240198,
                fields: [],
                thumbnail: null,
                image: null,
                author: null,
                footer: {
                text: message.guild.name,
                icon_url: message.guild.iconURL()
                }
            }], components: [row] })



        } catch (err) {
            console.log(err);
        }
    },
};
