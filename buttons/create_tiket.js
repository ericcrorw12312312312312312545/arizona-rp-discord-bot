const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Tickets = require('../schemas/Tickets');
const Numeric = require('../schemas/Numeric')

module.exports = async (bot, interaction) => {
    // if(interaction.member.id == "308326231839997963"){
    //   console.log('СТАЖОК СОЗДАЛ ТИКЕТ!')
    //     return;
    // }
    // if(interaction.member.id == "724616779044749332"){
    //   console.log('ЛЁВА СОЗДАЛ ТИКЕТ!')
    //     return;
    // }
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    function now_date(){
        let date = new Date(+new Date().valueOf() + 10800000);
        return `${date.getDate().toString().padStart(2, '0')}.` +
            `${(date.getMonth()).toString().padStart(2, '0')}.` +
            `${date.getFullYear()} в ` +
            `${(date.getHours()).toString().padStart(2, '0')}:` +
            `${date.getMinutes().toString().padStart(2, '0')}`;
    }

    let num_ticket = await Numeric.findOne({ })

    const num_str = String(num_ticket.tikets)

    let num;
    if(num_str.length == 1){
        num = "000" + num_ticket.tikets
    }
    if(num_str.length == 2){
        num = "00" + num_ticket.tikets
    }
    if(num_str.length == 3){
        num = "0" + num_ticket.tikets
    }
    if(num_str.length == 4){
        num = num_ticket.tikets
    }

    const ticket_db = await Tickets.findOne({ creator_id: member_interaction.id, close: false })
    if(ticket_db) {
        let err = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(16240198)
        .setDescription(`У вас уже имеется активный тикет: **<#${ticket_db.channel_id}>**, дождитесь его рассмотрения прежде чем создавать новый!`)
        return interaction.reply({ embeds: [err], ephemeral: true })
    }

    const create_parent = await bot.channels.cache.get("792391257506840607"); // Категория создания тикетов
    if(create_parent.children.size >= 49){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("В данный момент вы не можете создать тикет!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    await guild_interaction.channels.create(`ticket-${num}`, {
        type: "GUILD_TEXT",
        parent: "792391257506840607",
    }).then(async(channel) => {
        await channel.permissionOverwrites.edit(member_interaction, {
            "VIEW_CHANNEL": true,
            "SEND_MESSAGES": true,
            "READ_MESSAGE_HISTORY": true
        })

        //TODO: Должна быть проверка на полность категории (49 каналов), если полный то не даём создавать

        await interaction.reply({ content: `${member_interaction}, ваше обращение создано. Номер обращения: ${num}.\n\nПерейти: <#${channel.id}>`, ephemeral: true })

        let embednotify = new MessageEmbed()
        .setAuthor({ name: `${member_interaction.user.tag}`, iconURL: member_interaction.user.avatarURL() })
        .setTitle('Обращение к команде поддержки')
        .setColor(16240198)
        .setFooter({ "text": member_interaction.guild.name, "iconURL": member_interaction.guild.iconURL() })
        .setTimestamp()
        .setDescription(`Пользователь ${member_interaction} \`[ID: ${member_interaction.id}]\``)

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('hold_tiket')
            .setEmoji('⏰')
            .setLabel(`На рассмотрение`)
            .setStyle('SECONDARY'),
        )
        .addComponents(
            new MessageButton()
            .setCustomId('close_tiket')
            .setEmoji('🔒')
            .setLabel(`Закрыть`)
            .setStyle('SECONDARY'),
        )

        await channel.send({ embeds: [embednotify], content: `<@&695387225642238014>`, components: [row] }).then(async(msg) => {
            await Tickets.create({
                created_at: Date.now(),
                // creator_int: member_interaction.name,
                creator_id: member_interaction.id,
                channel_id: channel.id,
                creator_msg: msg.id
            })

            num_ticket.tikets += 1
            await num_ticket.save().catch(err => console.log(err))

            console.log(`[CREATE-TICKET] Пользователь ${member_interaction}[ID: ${member_interaction.id}] создал тикет ${channel.name} [ID: ${channel.id}]`)
        })
    })
}
