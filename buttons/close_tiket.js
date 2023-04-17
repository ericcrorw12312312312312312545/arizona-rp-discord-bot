const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Tickets = require('../schemas/Tickets');
const botconfig = require('../config')

// function now_date(){
//     let date = new Date(+new Date().valueOf() + 10800000);
//     return `${date.getDate().toString().padStart(2, '0')}.` +
//         `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
//         `${date.getFullYear()} в ` +
//         `${date.getHours().toString().padStart(2, '0')}:` +
//         `${date.getMinutes().toString().padStart(2, '0')}`;
// }

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие
    
    const close_parent = await bot.channels.cache.get("792391296655687690"); // Категория закрытых каналов
    if(close_parent.children.size >= 49){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("В данный момент вы не можете закрыть этот тикет!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    if(!member_interaction.roles.cache.some(r => botconfig.modrole.some(role => r.id == role))){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("Недостаточно прав!");
//        .setDescription("Прекрати страдать хуйней");
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

    if(channel_interaction.parentId == "792391296655687690"){
        let embednotify = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(16240198)
        .setDescription(`Данный тикет уже закрыт, ожидайте удаления через 24-е часа!`)
        return interaction.reply({ embeds: [embednotify], ephemeral: true })
    }

    await channel_interaction.setParent("792391296655687690").then(async(channel) => {
        await channel.permissionOverwrites.edit(ticket_db.creator_id, {
            "VIEW_CHANNEL": true,
            "SEND_MESSAGES": false,
            "READ_MESSAGE_HISTORY": true
        })
    const msg_log = await channel_interaction.send({ content: `<@${ticket_db.creator_id}>, модератор ${member_interaction} закончил работу по вашему обращению и установил ему статус \`«Закрыто»\`.\n\nОжидайте, в течение 24 часов Вы получите транскрипцию данного канала в личные сообщения. Канал будет удалён через 24 часа. `, ephemeral: true })
    // await channel_interaction.permissionOverwrites.delete(ticket_db.creator_id)

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('delete_tiket')
        .setEmoji('❌')
        .setLabel(`Удалить`)
        .setStyle('SECONDARY'),
    )

    await message_interaction.edit({ embeds: [message_interaction.embeds[0]], components: [row] })

    const now_date = new Date(Date.now())
    const zeroPad = (n, digits) => n.toString().padStart(digits, '0');

    ticket_db.close = true
    ticket_db.log.push({
        timestamp: msg_log.createdAt.getTime(),
        content: `[${zeroPad(now_date.getDay() + 3, 2)}.${zeroPad(now_date .getMonth() + 1, 2)}.${zeroPad(now_date.getFullYear(), 2)} ${zeroPad(now_date.getHours(), 2)}:${zeroPad(now_date.getMinutes(), 2)}:${zeroPad(now_date.getSeconds(), 2)}] ${interaction.user.tag} [ID: ${interaction.user.id}]: закрыл обращение.`
    })
    await ticket_db.save().catch(() => {})

    await interaction.deferUpdate();
})
}