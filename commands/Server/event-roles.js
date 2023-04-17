const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "event-roles",
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
	    
            const eventbtn = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('event')
            .setLabel("Получить роль")
            const removebtn = new MessageButton()
            .setStyle('DANGER')
            .setLabel("Снять роль")
            .setCustomId('remove')

            const rolesrow1 = new MessageActionRow()
            .addComponents(eventbtn)
            .addComponents(removebtn)
        
            await message.channel.send({ embeds: [{
                title: 'Принятие участия в мероприятиях',
                type: 'rich',
                description: 'Для получения роли <@&898322976930426980>, нажмите на кнопку ниже 😀',
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
            }], components: [rolesrow1] })
        } catch (err) {
            console.log(err);
        }
    },
};
