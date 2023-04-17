const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config');
const Bans = require('../../schemas/Bans')


    module.exports = {
        name: "unban",
        description: "unbans a member from the server",
        
    
        async run (bot, message, args) {
            await message.delete()
            if(!message.member.roles.cache.some(r => botconfig.modrole.some(role => r.id == role))){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setTimestamp()
                .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
                .setDescription("Недостаточно прав!");
                return message.reply({ embeds: [err] });
            }
            if(!args[0]){
                const err = new MessageEmbed()
                .setTitle("Ошибка")
                .setColor(16505678)
                .setTimestamp()
                .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
                .setDescription("Укажите ID пользователя, которого Вы хотите разбанить.");
                return message.channel.send({ embeds: [err] });
            }
            
//let req_db = await Bans.findOne({ DiscordID: args[0] })        

            
            const reason = args.slice(1).join(" ");
          await message.guild.bans.fetch()  
await Bans.findOneAndDelete({ DiscordID: args[0] })
            await message.guild.members.unban(`${args[0]}`, `${reason}`) 
    
            let embed = new MessageEmbed()
            .setTitle("Разбан")
            .setColor(16505678)
            .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
            .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            .setDescription(`Пользователь <@!${args[0]}> был разбанен.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
            await message.channel.send({ embeds: [embed] });
            
            let unban1 = new MessageEmbed()
            .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
            .setTitle("Разбан")
            .setColor(16505678)
            .setDescription(`Пользователь ${args[0]} был разбанен.\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`)
            .setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
            .setTimestamp()
            .setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
            await bot.channels.cache.get("695387351215505489").send({ embeds: [unban1] });
        }
    }