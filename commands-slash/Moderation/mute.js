const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction } = require('discord.js')

module.exports = {
	type: "USER",
	// permissions: [
	// 	{
	// 		id: "876882659727515679",
	// 		type: 'ROLE',
	// 		permission: false,
	// 	},
	// 	{
	// 		id: "977187873960894535",
	// 		type: 'ROLE',
	// 		permission: true,
	// 	}
	// ],
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('временно замутить пользователя')
		.addStringOption(option =>
			option.setName('user')
			.setDescription('пользователь')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
			.setDescription('время')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('причина')
			.setRequired(true)),
	async execute(interaction, bot, args) {
		let guild_interaction = bot.guilds.cache.get(interaction.guild.id); // Ищем гильдию в которой было совершено действие
    	let member_interaction = guild_interaction.members.cache.get(interaction.user.id); // Юзер который нажал на кнопку

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

		let banUser_string = interaction.options.getString('user');
		let banUser = guild_interaction.members.cache.get(getUserFromMention(banUser_string))

		let embed = new MessageEmbed()
		.setColor("#1170f4")

		if(!banUser){
			embed.setDescription(`❌ Вы не указали пользователя`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let time = interaction.options.getString('time');
		let reasonBan = interaction.options.getString('reason');

		let banreason = ``;
		if (!reasonBan) {
			reasonBan = 'Не указано';
			banreason = `${member_interaction.user.tag}: Не указано`;
		} else {
			banreason = `${member_interaction.user.tag}: ${reasonBan}`;
		}

		const time_ms = ms(time);

		if(banUser.isCommunicationDisabled()){
			embed.setDescription(`❌ У пользователя уже имеется мут!`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if(time_ms <= 10000){
			embed.setDescription(`❌ Срок блокировки менее 10-ти секунд не может быть указан!`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if(banUser.id == member_interaction.id){
			embed.setDescription(`❌ Вы не можете замутить сами себя!`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (banUser.roles.highest.position > guild_interaction.me.roles.highest.position){
			embed.setDescription(`❌ Роль бота находится ниже роли пользователя ${banUser}. Действие невозможно!`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (member_interaction.roles.highest.position <= banUser.roles.highest.position){
			embed.setDescription(`❌ Ваша самая высшая роль находится ниже, либо равна роли пользователя ${banUser}. Действие невозможно!`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let duration = ms(ms(time), { long: true })
		function date_untilban(){
			let date = new Date(Number(ms(time)) + new Date(+new Date().valueOf()).getTime());
			return `${date.getDate().toString().padStart(2, '0')}.` +
				`${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
				`${date.getFullYear()} ` +
				`${date.getHours().toString().padStart(2, '0')}:` +
				`${date.getMinutes().toString().padStart(2, '0')}:` +
				`${date.getSeconds().toString().padStart(2, '0')}`;
		}

		const embedDM = new MessageEmbed()
		.setColor("#1170f4")
		.setDescription(`Внимание! Вы получили временный мут сроком **${duration}**.\nВы будете разблокированы: **${date_untilban()}**\n> ${reasonBan}`)
		.setFooter(`Модератор: ${member_interaction.user.tag}`, member_interaction.user.avatarURL())
		await banUser.send({ embeds: [embedDM] }).catch(() => { })

		const embedchannel_mod = new MessageEmbed()
		.setTitle(`🔇 Временный мут`)
		.setDescription(`${banUser} \`[ID: ${banUser.id}]\` получил временный мут аккаунта сроком **${duration}**.\n> ${reasonBan}`)
		.setFooter(`Модератор: ${member_interaction.user.tag}`, member_interaction.user.avatarURL())
		await bot.channels.cache.get("927650658272809011").send({ embeds: [embedchannel_mod] }).then(async(msg) => {

			await banUser.send({ embeds: [embedDM] }).catch(async(err) => {})
			embed.setDescription(`✅ Вы успешно выдали временный мут пользователю ${banUser} \`[ID: ${banUser.id}]\`\n\n**Информацию можно посмотреть [ТУТ(КЛИКАБЕЛЬНО)](https://discord.com/channels/850466304574095401/927650658272809011/${msg.id}/)**`)
			await interaction.reply({ embeds: [embed], ephemeral: true });

			await banUser.disableCommunicationUntil(Date.now() + time_ms, banreason);
		})
	},
};
