const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Mutes = require('../../schemas/Mutes')

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

module.exports = {
    name: "mute",
    description: "unmutes a member on the server",
    async run (bot, message, args) {
        if(!message.member.roles.cache.some(r => botconfig.modrole.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.reply({ embeds: [err] });
        }

        let member = message.mentions.members.first()
        const id = member?.id ?? args[0]

        if(!id){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(16505678)
            .setTimestamp()
            .setDescription("Укажите, кого Вы хотите замутить. \"@user\"");
            return message.reply({ embeds: [err] });
        }
        if(id === message.author.id){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(16505678)
            .setTimestamp()
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setDescription("Невозможно замутить себя");
            return message.reply({ embeds: [err] });
        }

				// if(member.roles.cache.has(botconfig.muterole)){
        //     const err3 = new MessageEmbed()
        //     .setTitle("Ошибка")
        //     .setColor(16505678)
        //     .setTimestamp()
        //     .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
        //     .setDescription("Данный пользователь уже в муте.");
        //     return message.reply({ embeds: [err3] });
        // }

        await message.delete()

        const argsToTime = args[1].split("")
          let tim = []
          let value = []
          argsToTime.forEach(function(item, i, arr) {
            if(!isNaN(item)) parseInt(tim.push(item))
          else value.push(item)
        });

        const parsedTime = {
            s: 1000,
            m: 60000,
            h: 60000*60,
            d: 60000*60*24
        }
        if(tim.length == 0) return message.reply("Нима тайма")

        value = value.join("")

        // if(!["s", "m", "h", "d"].some(el => args[0].includes(el))) value = "m"

        tim = tim.join("") * parsedTime[value]

        const reason = args.slice(2).join(" ");



        await Mutes.create({
        	DiscordID: id,
        	endDate: Date.now() + tim
        })
        await message.guild.members.cache.get(id).roles.add(`699758767083880549`)

        let embed = new MessageEmbed()
          .setTitle("Мут")
          .setColor(16505678)
          .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
          .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
      		.setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`Пользователя <@${id}> замутили.\nДлительность: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await message.channel.send({ embeds: [embed] });


		    await bot.channels.cache.get(`695387351215505489`).send({ embeds: [embed] });
    }

}
