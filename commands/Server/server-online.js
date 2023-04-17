const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "server-online",
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

            const fetch = require("node-fetch");
            const fetchedData = await fetch("https://samp-servers.ru/web/json-7699.json").then((res) => res.json());
            const fetchedData2 = await fetch("https://samp-servers.ru/web/json-8715.json").then((res) => res.json());

            let status = fetchedData.status === '1' ? 'Онлайн' : 'Оффлайн'
            let status2 = fetchedData.status === '1' ? 'Онлайн' : 'Оффлайн'

            let embed = new MessageEmbed()
            .setTitle("📊Состояние серверов")
            .setColor(16505678)
            .setImage('https://sun9-86.userapi.com/cWBZres0gy0eUkhxtqKVm7JE9QoSBVMcRda4pQ/mLKXcJQEqhY.jpg')
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription(`**Жизнь в деревне № 1**\nКоличество игроков: ${fetchedData.players}/200\nIP: ${fetchedData.ip}:${fetchedData.port}\nСостояние: ${status}\n\n**Жизнь в деревне № 2**\nКоличество игроков: ${fetchedData2.players}/200\nIP: ${fetchedData2.ip}:${fetchedData2.port}\nСостояние: ${status}`);
            await message.channel.send({ embeds: [embed] });

        } catch (err) {
            console.log(err);
        }
    },
};
