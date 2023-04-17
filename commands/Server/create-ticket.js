const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "create-ticket",
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
                .setCustomId('create_tiket')
                .setEmoji('📨')
                .setLabel(`Создать тикет`)
                .setStyle('SECONDARY'),
            )

            await message.channel.send({ embeds: [{
                title: 'Связаться с модерацией',
                type: 'rich',
                description: 'Нажмите на «Создать тикет», чтобы создать обращение.',
                url: null,
                timestamp: '<t:${Date.now()/1000}:R>',
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
