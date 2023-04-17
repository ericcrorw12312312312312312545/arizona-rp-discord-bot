const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Tickets = require('../schemas/Tickets');
const botconfig = require('../config')
const fs = require('fs')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    if(!member_interaction.roles.cache.some(r => botconfig.stmodrole.some(role => r.id == role))){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("Недостаточно прав!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    let ticket_db = await Tickets.findOne({ channel_id: channel_interaction.id })
    if(!ticket_db){
        let err = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(16240198)
        .setDescription(`Произошла ошибка с базой данных, обратитесь к администратору!`)
        return interaction.reply({ embeds: [err], ephemeral: true })
    }

    if(channel_interaction.parentId != "792391296655687690"){
        let embednotify = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(16240198)
        .setDescription(`Данный тикет ещё закрыт, удаление невозможно!`)
        return interaction.reply({ embeds: [embednotify], ephemeral: true })
    }

    const messages = await channel_interaction.messages.fetch()
    const messages_values = messages.filter(x => x.id != messages.last().id).sort(async(a,b) => a.createdTimestamp-b.createdTimestamp).toJSON()
    const zeroPad = (n) => n.toString().padStart(2, '0');
    let log_msg = []

    for (var i in messages_values) {
        const ticket_db = await Tickets.findOne({ "log.timestamp": messages_values[i].createdTimestamp })
        if(ticket_db){
            log_msg.push(ticket_db?.log.filter((x) => x.timestamp == messages_values[i].createdTimestamp)[0].content)
        } else {
            log_msg.push(`[${zeroPad(messages_values[i].createdAt.getDay() + 3)}.${zeroPad(messages_values[i].createdAt .getMonth() + 1)}.${zeroPad(messages_values[i].createdAt.getFullYear())} ${zeroPad(messages_values[i].createdAt.getHours())}:${zeroPad(messages_values[i].createdAt.getMinutes())}:${zeroPad(messages_values[i].createdAt.getSeconds())}] ${messages_values[i].author.tag} [ID: ${messages_values[i].author.id}]: ${messages_values[i].content}`)
        }
    }

    log_msg.reverse()

    fs.appendFileSync(`./${channel_interaction.name}.txt`, log_msg.join("\r\n"))

    const creator_db = await Tickets.findOne({ channel_id: channel_interaction.id })
    if(creator_db){
        await bot.users.cache.get(creator_db.creator_id).send({ content: `Ваш тикет **${channel_interaction.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению. \nСпасибо за Ваше обращение!`, files: [`./${channel_interaction.name}.txt`] }).catch(() => null)
    }
    await bot.channels.cache.get("792392408167874611").send({ content: `\`[DELETE-TICKET]\` Тикет **${channel_interaction.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению`, files: [`./${channel_interaction.name}.txt`] })

    fs.unlinkSync(`./${channel_interaction.name}.txt`)

    await channel_interaction.delete(); // Удаление канала

    await Tickets.deleteOne({ channel_id: channel_interaction.id })

    await interaction.deferUpdate();
}
