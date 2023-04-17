const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction } = require('discord.js')

module.exports = {
	type: "USER",
	permissions: [
		{
			id: "788202988640272405",
			type: 'ROLE',
			permission: false,
		},
		{
			id: "903362331482927104",
			type: 'ROLE',
			permission: true,
		}
	],
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('выдать предупреждение пользователю')
		.addStringOption(option => 
			option.setName('user')
			.setDescription('пользователь')
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
			embed.setDescription(`❌ Вы не указали пользователя для предупреждения`)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let reasonBan = interaction.options.getString('reason');

		let banreason = ``;
		if (!reasonBan) {
			reasonBan = 'Не указано';
			banreason = `${member_interaction.user.tag}: Не указано`;
		} else {
			banreason = `${member_interaction.user.tag}: ${reasonBan}`;
		}

		if(banUser.id == member_interaction.id){
			embed.setDescription(`❌ Вы не можете предупредить сами себя!`)
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

		let user_db = await Users.findOne({ DiscordID: member_interaction.id })
    	if(!user_db) await Users.create({ DiscordID: member_interaction.id }).then((r) => user_db = r)

		if(user_db.warns + 1 == 3) {
			//Действие после третьего варна
			// await guild_interaction.members.ban(banUser, { reason: banreason, days: 7 });

			return; 
		}

		const embedDM = new MessageEmbed()
		.setTitle(`🛑 Предупреждение аккаунта`)
		.setColor("#1170f4")
		.setDescription(`Вам было выданно предупреждение на ваш аккаунт\n> ${reasonBan}`)
		.setFooter(`Модератор: ${member_interaction.user.tag}`, member_interaction.user.avatarURL())
		await banUser.send({ embeds: [embedDM] }).catch(() => { })

		const embedchannel_mod = new MessageEmbed()
		.setTitle(`🛑 Предупреждение аккаунта`)
		.setDescription(`${banUser} \`[ID: ${banUser.id}]\` предупреждение аккаунта ${user_db.warns + 1} из 3.\n> ${reasonBan}`)
		.setFooter(`Модератор: ${member_interaction.user.tag}`, member_interaction.user.avatarURL())
		await bot.channels.cache.get("939113412741447700").send({ embeds: [embedchannel_mod] }).then(async(msg) => {
			await banUser.send({ embeds: [embedDM] }).catch(async(err) => {})
			embed.setDescription(`✅ Вы успешно выдали предупреждение ${banUser} \`[ID: ${banUser.id}]\`\n\n**Информацию о предупреждении можно посмотреть [ТУТ(КЛИКАБЕЛЬНО)](https://discord.com/channels/850466304574095401/927650658272809011/${msg.id}/)**`)
			await interaction.reply({ embeds: [embed], ephemeral: true });
		})
	},
};