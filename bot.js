const { Intents, Client, MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { readdirSync } = require("fs");
const fs = require('fs')
const tags = require('./config').tags
const bot = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_WEBHOOKS
	],
	allowedMentions: {
		parse: [
			'users',
			'roles',
		],
		repliedUser: true
	},
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'USER',
		'GUILD_MEMBER'
	]
});

global.botconfig = require("./config"); // Привязка файла конфига
global.mongoose = require('mongoose');
global.mongooseDynamic = require ('mongoose-dynamic-schemas');
const wait = require('util').promisify(setTimeout);

mongoose.connect(botconfig.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('DATABASE | Успешно подключено!')
})

const Users = require('./schemas/Users')
const Temp = require('./schemas/Temp')
const Numeric = require('./schemas/Numeric');
const Tickets = require("./schemas/Tickets");
const Mutes = require('./schemas/Mutes');
const Bans = require('./schemas/Bans');
const Coins = require('./schemas/Coins');
const LogsTemp = require('./schemas/LogsTemp');
const Families = require("./schemas/Families");
const FamTemp = require("./schemas/FamTemp");
global.Tickets = require('./schemas/Tickets')

bot.commandsSlash = new Collection(); // Собираем команды в коллекцию
bot.commands = new Collection();
bot.aliases = new Collection();

["command", "events", "slash-commands"].forEach(handler => {
	require(`./Handler/${handler}`)(bot)
})

function getUserFromMention(mention) {
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return mention;
	} else if(!mention.startsWith('<@') && !mention.endsWith('>')) {
	return mention;
  }
}

bot.on('interactionCreate', async(interaction) => {
	// Взаимодействие с кнопками
	if(interaction.isButton()){
		const customId = interaction.customId;
		const customIdArgs = customId.split(".")
		if(customIdArgs.length == 1){
			try {
				const functionButton = require(`./buttons/${interaction.customId}`);
				if(functionButton){
					functionButton(bot, interaction);
				}
			} catch (e) {
				console.log(e)
			}
		} else {
			readdirSync("./buttons-customId/").forEach(async(dir) => {
				try {
					const functionButtonArg = require(`./buttons-customId/${dir}/${customIdArgs[0]}`);
					if(functionButtonArg){
						functionButtonArg(bot, interaction, customIdArgs[1]);
					}
				} catch (e) {
					console.log(e)
				}
			})
		}
    }
});

class giveRole {
	constructor() {
	  this.role = null;
	}

	setRole(role_id) {
		this.role = role_id
	}

	getRole(){
		return this.role
	}

  }

bot.on('messageCreate', async(message) => {
	if(message.channel.id != "959064921621028874") return;
	const msg_split = message.content.toLowerCase().split(" ")

	if(message.author.id == "948945868629880873") return;

	if(message.member.nickname == null) {
		return message.delete();
	}

	if(!message.content.toLowerCase().valueOf("роль")){
		return message.delete();
	}

	const name_split = message.member.nickname.split(" | ")

	if(!tags[name_split[0]]) {
		return message.delete();
	}

	let req_db = await Temp.findOne({ DiscordID: message.author.id })
	if(req_db){
		return message.delete()
	}

	if(msg_split[0] == "снять" && msg_split[1] == "роль" && msg_split.length == 2){
		const result_filter0 = await tags[name_split[0]].roles.filter(x => x.checkRole == "0")
		let role_m = new giveRole()

		if(result_filter0[0]){
			role_m.setRole(result_filter0[0].giveRole)

			await message.member.roles.cache.map(async(role) => {
				if(!message.member.roles.cache.get(result_filter0[0].giveRole)) return;
				role_m.setRole(result_filter0[0].giveRole)

				if(role_m.getRole() == null || !role_m.getRole()){
					return message.delete()
				}
			})
		} else {
			await message.member.roles.cache.map(async(role) => {
				const result = await tags[name_split[0]].roles.filter(x => x.checkRole == role.id)


				if(result[0] != null){
					if(message.member.roles.cache.get(result[0].giveRole)) return;
					role_m.setRole(result[0].giveRole)

					if(role_m.getRole() == null || !role_m.getRole()){
						return
						message.delete()
					}
				}
			})
		}

		await message.react("👀")

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setCustomId(`accept_request_del.${role_m.getRole()}`)
			.setLabel(`Одобрить`)
			.setStyle('SUCCESS'),
		)
		.addComponents(
			new MessageButton()
			.setCustomId(`cancel_request_del.${role_m.getRole()}`)
			.setLabel(`Отклонить`)
			.setStyle('DANGER'),
		)
		.addComponents(
			new MessageButton()
			.setCustomId(`delete_request_del.${role_m.getRole()}`)
			.setLabel(`Удалить`)
			.setStyle('DANGER'),
		)

		let embed_req = new MessageEmbed()
		.setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
		.setTitle("Запрос на снятие ролей")
		.setColor(botconfig.color)
		.setDescription(`Пользователь запросил снятие всех ролей.\nЕго никнейм на сервере: \`${message.member.nickname == null ? message.author.username : message.member.nickname}\``)
		.setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
		.setTimestamp()

		await bot.channels.cache.get("954635256869322752").send({ embeds: [embed_req], components: [row] }).then(async(msg) => {
			await Temp.create({
				DiscordID: message.author.id,
				created_at: Date.now(),
				created_msg: message.id,
				mod_msg: msg.id
			})

			await msg.pin();
		})
	}

	if(msg_split[0] == "роль" && msg_split.length == 1){
		const result_filter0 = await tags[name_split[0]].roles.filter(x => x.checkRole == "0")
		let role_m = new giveRole()

		if(result_filter0[0]){
			role_m.setRole(result_filter0[0].giveRole)

			await message.member.roles.cache.map(async(role) => {
				if(message.member.roles.cache.get(result_filter0[0].giveRole)) return;
				role_m.setRole(result_filter0[0].giveRole)

				if(role_m.getRole() == null || !role_m.getRole()){
					return message.delete()
				}
			})
		} else {
			await message.member.roles.cache.map(async(role) => {
				const result = await tags[name_split[0]].roles.filter(x => x.checkRole == role.id)


				if(result[0] != null){
					if(message.member.roles.cache.get(result[0].giveRole)) return;
					role_m.setRole(result[0].giveRole)

					if(role_m.getRole() == null || !role_m.getRole()){
						return message.delete()
					}
				}
			})
		}

		await message.react("👀")

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setCustomId(`accept_request.${role_m.getRole()}`)
			.setLabel(`Одобрить`)
			.setStyle('SUCCESS'),
		)
		.addComponents(
			new MessageButton()
			.setCustomId(`cancel_request.${role_m.getRole()}`)
			.setLabel(`Отклонить`)
			.setStyle('DANGER'),
		)
		.addComponents(
			new MessageButton()
			.setCustomId(`delete_request.${role_m.getRole()}`)
			.setLabel(`Удалить`)
			.setStyle('DANGER'),
		)

			let embed_req = new MessageEmbed()
			.setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
			.setTitle("Запрос роли")
			.setColor(botconfig.color)
			.setDescription(`Пользователь запросил роль <@&${role_m.getRole()}>.\nЕго никнейм на сервере: \`${message.member.nickname == null ? message.author.username : message.member.nickname}\``)
			.setFooter({ "text": message.guild.name, "iconURL": message.guild.iconURL() })
			.setTimestamp()

			await bot.channels.cache.get("954635256869322752").send({ embeds: [embed_req], components: [row] }).then(async(msg) => {
			await Temp.create({
				DiscordID: message.author.id,
				created_at: Date.now(),
				created_msg: message.id,
				mod_msg: msg.id
			})

			await msg.pin();
		})
	}
})

bot.on('messageCreate', async(message) => {
	var prefix = "!";
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = bot.commands.get(command) || bot.aliases.get(command);

	if (!cmd) return;

	cmd.run(bot, message, args);
})

bot.on('messageCreate', async(message) => {
	if(message.author.bot) return

	let user_db = await Users.findOne({ DiscordID: message.author.id })
	if(!user_db){
		await Users.create({
			DiscordID: message.author.id,
			PrivateName: `Приват ${message.author.tag}`
		})
	}
})

bot.on('messageCreate', async(message) => {
	if(message.channel.id != "986652000542416896") return
	setTimeout(async () => {
		await message?.delete().catch(() => null)
	},2000)
})

bot.on('messageCreate', async(message) => {
	if (message.channel.id == `977235197412126720`) {
		if(message.author.id == "948945868629880873") return;
		let arrayArgs = message.content.split(" ")
		await message.delete()
		let embed = new MessageEmbed()
			.setTitle("Заявка на просмотр логов")
			.setColor(botconfig.color)
			.setTimestamp()
			.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
			.setDescription(`**Отправитель:** ${message.author}\n**Время отправления:** <t:${~~(Date.now()/1000)}:F>\n**Статус отправителя:** ${message.member.roles.highest}\n**Комментарий от администратора:**\n\`\`\`cpp\n${message.content}\`\`\`\n**Найден ник:**\n[${arrayArgs[0]} (1 сервер)](http://ulog.union-u.net/search.php?searchtext=${arrayArgs[0]}&server=16)\n[${arrayArgs[0]} (2 сервер)](http://ulog.union-u.net/search.php?searchtext=${arrayArgs[0]}&server=17)`);
		const logs_row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId(`accept_log`)
				.setLabel(`Одобрить`)
				.setStyle('SUCCESS'),
			)
			.addComponents(
				new MessageButton()
				.setCustomId(`cancel_log`)
				.setLabel(`Отклонить`)
				.setStyle('DANGER'),
			)
		let msg = await message.channel.send({ components: [logs_row], embeds: [embed], content: `<@&869287778750455859>` });
		await LogsTemp.create({
			DiscordID: message.author.id,
			created_at: Date.now(),
			content: message.content,
			nick: arrayArgs[0],
			mod_msg: msg.id
		})
	};
})

bot.on('ready', async() => {
	bot.user.setStatus("idle"); // dnd idle online invisible
    bot.user.setActivity("https://bone-country.ru",{type:"WATCHING"});
		await bot.channels.cache.get("979385167649058907").send(`Я запустился.`)

	setInterval(async() => {
		setInterval(async() => {
			const guild = await bot.guilds.cache.get("527799726557364237")
			let invites = await FamTemp.find().sort({ "endDate": 1 })
				for (let index = 0; index < invites.length; ++index) {
					if(Date.now() - invites[index].created_at >= 1000){
						let channel = await guild.channels.cache.get(invites[index].channel_id)
						let message = await channel.messages.fetch(invites[index].created_msg)
						await message?.delete()
						await FamTemp.findOneAndDelete({ DiscordID: invites[index].DiscordID })
					}
				}
			}, 60000)
		const guild = await bot.guilds.cache.get("527799726557364237")
		const parent = bot.channels.cache.get("792391296655687690")
		const zeroPad = (n) => n.toString().padStart(2, '0');
		let log_msg = []

		await parent.children.map(async(channel) => {
			const messages = await channel.messages.fetch()
			const messages_values = messages.filter(x => x.id != messages.last().id).sort(async(a,b) => a.createdTimestamp-b.createdTimestamp).toJSON()
			const last_messages_at = await messages.first().createdAt

			if(Date.now() >= last_messages_at.getTime() + 86400000) {
				for (var i in messages_values) {
					const ticket_db = await Tickets.findOne({ "log.timestamp": messages_values[i].createdTimestamp })
					if(ticket_db){
						log_msg.push(ticket_db?.log.filter((x) => x.timestamp == messages_values[i].createdTimestamp)[0].content)
					} else {
						log_msg.push(`[${zeroPad(messages_values[i].createdAt.getDay() + 3 )}.${zeroPad(messages_values[i].createdAt .getMonth() + 1 )}.${zeroPad(messages_values[i].createdAt.getFullYear())} ${zeroPad(messages_values[i].createdAt.getHours())}:${zeroPad(messages_values[i].createdAt.getMinutes())}:${zeroPad(messages_values[i].createdAt.getSeconds())}] ${messages_values[i].author.tag} [ID: ${messages_values[i].author.id}]: ${messages_values[i].content}`)
					}
				}

				log_msg.reverse()

				fs.appendFileSync(`./${channel.name}.txt`, log_msg.join("\r\n"))

				const creator_db = await Tickets.findOne({ channel_id: channel.id })
				if(creator_db){
					await bot.users.cache.get(creator_db.creator_id).send({ content: `Ваш тикет **${channel.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению. \nСпасибо за Ваше обращение!`, files: [`./${channel.name}.txt`] }).catch(() => null);
				}
				await bot.channels.cache.get("792392408167874611").send({ content: `\`[DELETE-TICKET]\` Тикет **${channel.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению`, files: [`./${channel.name}.txt`] })

				fs.unlinkSync(`./${channel.name}.txt`)

				await channel.delete();

				await Tickets.deleteOne({ channel_id: channel.id })
			}
		})
	}, 6000)
        setInterval(async() => {
        		const guild = await bot.guilds.cache.get("527799726557364237")
						let mute = await Mutes.find().sort({ "endDate": 1 })

for (let index = 0; index < mute.length; ++index) {
if(Date.now() >= mute[index].endDate){

await guild.members.fetch(mute[index].DiscordID).catch(() => null);

let mute_user = await guild.members.cache.get(mute[index].DiscordID)

await Mutes.findOneAndDelete({ DiscordID: mute[index].DiscordID }).then(() => {console.log(`Удалил схему пользователя ${mute[index].DiscordID}`)})

mute_user.roles.remove('699758767083880549')

}
}
        }, 60000)
                setInterval(async() => {
        		const guild = await bot.guilds.cache.get("527799726557364237")
let ban = await Bans.find().sort({ "endDate": 1 })

for (let index = 0; index < ban.length; ++index) {
if(Date.now() >= ban[index].endDate){
await Bans.findOneAndDelete({ DiscordID: ban[index].DiscordID })
await guild.bans.fetch(ban[index].DiscordID)
            await guild.members.unban(ban[index].DiscordID)
}
}
}, 3600000)
				setInterval(async() => {
						const guild = await bot.guilds.cache.get("527799726557364237")
						const channel = await guild.channels.cache.get("973260040574226442")
						const message = await channel.messages.fetch("973268291697119242")
						const data = await Coins.find({})

						let desc = ""
						if(data?.length > 0) {
							 for(let i = 0; i < data.length; i++) {
									desc += `<@${data[i].DiscordID}> - ${data[i].coins}\n`
							 }
						}
						let embed = new MessageEmbed()
						.setTitle("Список коинов")
						.setColor(botconfig.color)
						.setTimestamp()
						.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
						.setDescription(`**Никнейм - Количество коинов**\n${desc}`);
						await message.edit({ embeds: [embed] });

				}, 3600000)
				setInterval(async() => {
						const guild = await bot.guilds.cache.get("527799726557364237")
						const channel = await guild.channels.cache.get("695387295846760621")
						const message = await channel.messages.fetch("973285189390323813")

						const fetch = require("node-fetch");
						const fetchedData = await fetch("https://samp-servers.ru/web/json-7699.json").then((res) => res.json());
						const fetchedData2 = await fetch("https://samp-servers.ru/web/json-8715.json").then((res) => res.json());

						let status = fetchedData.status === '1' ? 'Онлайн' : 'Оффлайн'
						let status2 = fetchedData.status === '1' ? 'Онлайн' : 'Оффлайн'

						let embed = new MessageEmbed()
						.setTitle("📊Состояние серверов")
						.setColor(botconfig.color)
						.setImage('https://sun9-86.userapi.com/cWBZres0gy0eUkhxtqKVm7JE9QoSBVMcRda4pQ/mLKXcJQEqhY.jpg')
												                                   .setTimestamp()
						.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
						.setDescription(`**Жизнь в деревне № 1**\nКоличество игроков: ${fetchedData.players}/200\nIP: ${fetchedData.ip}:${fetchedData.port}\nСостояние: ${status}\n\n**Жизнь в деревне № 2**\nКоличество игроков: ${fetchedData2.players}/200\nIP: ${fetchedData2.ip}:${fetchedData2.port}\nСостояние: ${status}`);
						await message.edit({ embeds: [embed] });

				}, 600000)
				setInterval(async() => {
						const guild = await bot.guilds.cache.get("527799726557364237")
						const channel = await guild.channels.cache.get("956443048261345321")

						const active = await guild.channels.cache.get("792391257506840607")
						const hold = await guild.channels.cache.get("956442640390451210")
						const close = await guild.channels.cache.get("792391296655687690")

						const message = await channel.messages.fetch("959058446290939925")

						const numerics_db = await Numeric.findOne({ "_id": "62506b18d6e36ab148873436" })

						const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('create_tiket')
                .setEmoji('📨')
                .setLabel(`Создать тикет`)
                .setStyle('SECONDARY'),
            )

						let embed = new MessageEmbed()
						.setTitle("Связаться с модерацией")
						.setColor(botconfig.color)
						.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
						.setDescription(`Нажмите на «Создать тикет», чтобы создать обращение.\n\n**Статистика тикетов**\nАктивно: ${active.children.size}\nНа рассмотрении Главного Модератора: ${hold.children.size}\nЗакрыто: ${close.children.size}\nЗа всё время: ${numerics_db.tikets}`);
						await message.edit({ embeds: [embed], components: [row] });

				}, 600000)
});

/* Embed функция в боте */
bot.embed = function({ content }) {
	if(content == undefined) return console.error(`ERROR | Неверное использование функции, проверьте аргументы!`)

	let embed = new MessageEmbed()
	.setColor("#1170f4")
	.setDescription(`**${content}**`)
	return embed;
}

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "695387270454444084";
    const channelid = "926263634072567808";
		const musicid = guild.channels.cache.get("695387364012326933");
		const zakazprivatid = guild.channels.cache.get("972021306059026432");
		const zakazid = guild.channels.cache.get("695387302310183003");

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"MOVE_MEMBERS": true,
				"CONNECT": true,
				"SPEAK": true,
			});
			musicid.permissionOverwrites.edit(newState.member.id, {
				"MOVE_MEMBERS": true,
				"CONNECT": true,
				"SPEAK": false,
			});
			zakazid.permissionOverwrites.edit(newState.member.id, {
				"SEND_MESSAGES": false,
				"VIEW_CHANNEL": false,
			});
			zakazprivatid.permissionOverwrites.edit(newState.member.id, {
				"SEND_MESSAGES": true,
				"VIEW_CHANNEL": true,
			})
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
			musicid.permissionOverwrites.delete(oldState.member.id)
			zakazid.permissionOverwrites.delete(oldState.member.id)
			zakazprivatid.permissionOverwrites.delete(oldState.member.id)
		};
})

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "716592328881471528";
    const channelid = "716592931506749465";
		const phone = guild.channels.cache.get("902871072184102962");

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"CONNECT": true,
				"SPEAK": true,
				"VIEW_CHANNEL": true,
			});
			phone.permissionOverwrites.edit(newState.member.id, {
				"SEND_MESSAGES": true,
				"VIEW_CHANNEL": true,
			});
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
			phone.permissionOverwrites.delete(oldState.member.id)
		};
})

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "716592328881471528";
    const channelid = "866323233863368714";
		const phone = guild.channels.cache.get("902871072184102962");

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"CONNECT": true,
				"SPEAK": true,
				"VIEW_CHANNEL": true,
			});
			phone.permissionOverwrites.edit(newState.member.id, {
				"SEND_MESSAGES": true,
				"VIEW_CHANNEL": true,
			});
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
			phone.permissionOverwrites.delete(oldState.member.id)
		};
})

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "716592328881471528";
    const channelid = "695387376834314300";

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"CONNECT": true,
				"SPEAK": true,
				"VIEW_CHANNEL": true,
			});
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
		};
})

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "716592328881471528";
    const channelid = "695387382924443730";

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"CONNECT": true,
				"SPEAK": true,
				"VIEW_CHANNEL": true,
			});
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
		};
})

bot.on("voiceStateUpdate",(oldState,newState)=>{
	  const guild = bot.guilds.cache.get("527799726557364237")
    const categoryid = "716592328881471528";
    const channelid = "695387388435890346";

		if(newState.channel?.id == channelid){
			newState.channel?.permissionOverwrites.edit(newState.member.id, {
				"CONNECT": true,
				"SPEAK": true,
				"VIEW_CHANNEL": true,
			});
    }
    if(oldState.channel?.id == channelid){
			oldState.channel.permissionOverwrites.delete(oldState.member.id)
		};
})

/* Логи */
/* Сообщения */
bot.on("messageDelete", function (message) {
			// if(message.author.bot) return
			message.guild.channels.cache.get('695387347033784440').send({embeds: [
				new MessageEmbed()
				.setDescription(`Сообщение удалено в канале <#${message.channel.id}>\n\n**Удалённое сообщение**\`\`\`fix\n${message.content}\`\`\`\n**Автор**\`\`\`fix\n${message.member.id}\`\`\``)
				.setAuthor({name: `${message.member.user.tag}`, iconURL: message.member.displayAvatarURL({dynamic: true})})
				.setTimestamp(message.createdAt)
				.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
				.setColor(16240198)
			]})
});

bot.on("messageUpdate", function (oldMessage, newMessage) {
    if(newMessage.author.bot) return
		newMessage.guild.channels.cache.get('695387347033784440').send({embeds: [
				new MessageEmbed()
				.setDescription(`[Сообщение](${newMessage.url}) изменено в канале <#${newMessage.channel.id}>\n\n**Старое сообщение**\`\`\`fix\n${oldMessage.content}\`\`\`\n**Новое сообщение**\`\`\`fix\n${newMessage.content}\`\`\`\n**Автор**\`\`\`fix\n${newMessage.member.id}\`\`\``)
				.setAuthor({name: `${newMessage.member.user.tag}`, iconURL: newMessage.member.displayAvatarURL({dynamic: true})})
				.setTimestamp(oldMessage.updateAt)
				.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
				.setColor(16240198)
			]})
});
/* Обновления каналов */

bot.on("channelCreate", function (channel) {
    channel.guild.channels.cache.get('695387346140659822').send({embeds: [
		new MessageEmbed()
		.setDescription(`Канал \`${channel.name}\`(${channel}) был создан\n\n**Тип:**\`\`\`fix\n${channel.type}\`\`\`\n**Айди:**\`\`\`fix\n${channel.id}\`\`\`\n**Автор**\`\`\`fix\n${channel.client.user.id}\`\`\``)
		// .setAuthor({name: `${channel.client.user.username}`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setTimestamp(channel.createdAt)
		.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setColor(16240198)
	]})
});

bot.on("channelDelete", function (channel) {
    channel.guild.channels.cache.get('695387346140659822').send({embeds: [
		new MessageEmbed()
		.setDescription(`Канал \`${channel.name}\` был удалён\n\n**Тип:**\`\`\`fix\n${channel.type}\`\`\`\n**Айди:**\`\`\`fix\n${channel.id}\`\`\`\n**Автор**\`\`\`fix\n${channel.client.user.id}\`\`\``)
		// .setAuthor({name: `${channel.client.user.username}`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setTimestamp(channel.createdAt)
		.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setColor(16240198)
	]})
});

/* Изменение пользователя */

bot.on("guildMemberAdd", function (member) {
    member.guild.channels.cache.get('810503394305376276').send({embeds: [
		new MessageEmbed()
		.setDescription(`Пользователь ${member} присоединился к серверу.\n\n**Пользователь**\`\`\`fix\n${member.user.id}\`\`\``)
		.setAuthor({name: `${member.user.tag}`, iconURL: member.displayAvatarURL({dynamic: true})})
		.setTimestamp(member.joinAt)
		.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setColor(16240198)
	]})
});

bot.on("guildMemberRemove", function (member) {
    member.guild.channels.cache.get('810503394305376276').send({embeds: [
		new MessageEmbed()
		.setDescription(`Пользователь ${member} покинул сервер.\n\n**Пользователь**\`\`\`fix\n${member.user.id}\`\`\``)
		.setAuthor({name: `${member.user.tag}`, iconURL: member.displayAvatarURL({dynamic: true})})
		.setTimestamp(member.joinAt)
		.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
		.setColor(16240198)
	]})
});

bot.on("guildMemberUpdate", function (oldMember, newMember) {
	const oldRoles = oldMember.roles.cache.map(r => r).join(' ').replace("@everyone", "")
	const newRoles = newMember.roles.cache.map(r => r).join(' ').replace("@everyone", "")

	if(oldMember.roles.cache.size != newMember.roles.cache.size) {
		newMember.guild.channels.cache.get('695387349840035871').send({embeds: [
			new MessageEmbed()
			.setDescription(`Роли пользователя ${newMember} были обновлёны.\n\n**Старые роли:**\n${oldRoles}\n**Новые роли:**\n${newRoles}\n\n**Пользователь**\`\`\`fix\n${newMember.user.id}\`\`\``)
			.setAuthor({name: `${newMember.user.tag}`, iconURL: newMember.displayAvatarURL({dynamic: true})})
			.setTimestamp(newMember.updateAt)
			.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
			.setColor(16240198)
		]})
	}
	if(oldMember.displayName != newMember.displayName) {
		newMember.guild.channels.cache.get('695387349840035871').send({embeds: [
			new MessageEmbed()
			.setDescription(`Никнейм пользователя <@${newMember.user.id}> был обновлён.\n\n**Старый никнейм:**\n${oldMember.displayName}\n**Новый никнейм:**\n${newMember.displayName}\n\n**Пользователь**\`\`\`fix\n${newMember.user.id}\`\`\``)
			.setAuthor({name: `${newMember.user.tag}`, iconURL: newMember.displayAvatarURL({dynamic: true})})
			.setTimestamp(newMember.updateAt)
			.setFooter({text:`SAMP: Жизнь в Деревне🐦`, iconURL: 'https://images-ext-1.discordapp.net/external/MCoBJT-9LUuQP1JRCr6R5NoMbhoqlA_iNBLhthJXePw/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.png'})
			.setColor(16240198)
		]})
	}
});

bot.login(botconfig.token);
