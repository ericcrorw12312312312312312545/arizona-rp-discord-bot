const { Intents, Client, MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const LogsTemp = require("../schemas/LogsTemp");
const logs = require('../config').logs

function endsWithAny(suffixes, string) {
	return suffixes.some((suffix) => string.endsWith(suffix));
}

function time(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    s = (s - mins) / 60;
    let hrs = s % 24;
    s = (s - hrs) / 24;
    let days = s;
    let status = true;
    let output = "";

    if (days != 0) {
        if (days.toString().endsWith("1") && !days.toString().endsWith("11")) {
            output += `${days} день`;
        } else if (
            endsWithAny(["2", "3", "4"], days.toString()) &&
            !endsWithAny(["12", "13", "14"], days.toString())
        ) {
            output += `${days} дня`;
        } else {
            output += `${days} дней`;
        }
        status = false;
    }
    if (hrs != 0) {
        if (status) {
            if (hrs.toString().endsWith("1") && !hrs.toString().endsWith("11")) {
                output += `${hrs} час`;
            } else if (
                endsWithAny(["2", "3", "4"], hrs.toString()) &&
                !endsWithAny(["12", "13", "14"], hrs.toString())
            ) {
                output += `${hrs} часа`;
            } else {
                output += `${hrs} часов`;
            }
            status = false;
        }
    }
    if (mins != 0) {
        if (status) {
            if (mins.toString().endsWith("1") && !mins.toString().endsWith("11")) {
                output += `${mins} минуту`;
            } else if (
                endsWithAny(["2", "3", "4"], mins.toString()) &&
                !endsWithAny(["12", "13", "14"], mins.toString())
            ) {
                output += `${mins} минуты`;
            } else {
                output += `${mins} минут`;
            }
            status = false;
        }
    }
    if (secs != 0) {
        if (status) {
            if (secs.toString().endsWith("1") && !secs.toString().endsWith("11")) {
                output += `${secs} секунду`;
            } else if (
                endsWithAny(["2", "3", "4"], secs.toString()) &&
                !endsWithAny(["12", "13", "14"], secs.toString())
            ) {
                output += `${secs} секунды`;
            } else {
                output += `${secs} секунд`;
            }
            status = false;
        }
    }
    if (ms != 0) {
        if (status) {
            output += `${ms} ms`;
        }
    }
    return output;
}

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    if(!member_interaction.roles.cache.some(r => logs.some(role => r.id == role))){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("Недостаточно прав!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    const logs_db = await LogsTemp.findOne({ mod_msg: interaction.message.id })
    if(!logs_db){
        let err = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(16240198)
        .setDescription(`Произошла ошибка с базой данных, обратитесь к администратору!`)
        return interaction.reply({ embeds: [err], ephemeral: true })
    }
    let fetched = await interaction.guild.members.fetch(logs_db.DiscordID)
    let embed = new MessageEmbed()
      .setTitle("Заявка рассмотрена")
      .setColor(16505678)
      .setTimestamp()
      .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
      .setDescription(`**Отправитель:** <@${logs_db.DiscordID}>\n**Время отправления:** <t:${~~(logs_db.created_at/1000)}:F>\n**Статус отправителя:** ${fetched.roles.highest}\n**Сообщение от администратора:**\n\`\`\`cpp\n${logs_db.content}\`\`\`\n**Найден ник:**\n[${logs_db.nick} (1 сервер)](http://ulog.union-u.net/search.php?searchtext=${logs_db.nick}&server=16)\n[${logs_db.nick} (2 сервер)](http://ulog.union-u.net/search.php?searchtext=${logs_db.nick}&server=17)\n\n**Заяку рассмотрел:**${interaction.member}\n**Время рассмотрения**: \`${time(Date.now()-logs_db.created_at)}\``);
    await message_interaction.edit({ embeds: [embed], components: [] })

    await LogsTemp.deleteOne({ mod_msg: interaction.message.id })
// })
}
