const { Intents, Client, MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const FamTemp = require("../schemas/FamTemp");
const Families = require("../schemas/Families");

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    const fam_temp_db = await FamTemp.findOne({ created_msg: interaction.message.id })

    if(interaction.user.id != fam_temp_db?.DiscordID){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(16505678)
        .setDescription("Это не ваше приглашение!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    let embed = new MessageEmbed()
      .setTitle("Приглашение в семью")
      .setColor(16505678)
      .setTimestamp()
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription(`Приглашение успешно принято. Вы вступили в семью <@&${fam_temp_db.role_id}>.`);
    await interaction.reply({ embeds: [embed], ephemeral: true })

    await interaction.guild.members.cache.get(fam_temp_db.DiscordID).roles.add(fam_temp_db.role_id)

    await message_interaction.delete()
    const fam_db = await Families.findOne({ role_id: `${fam_temp_db.role_id}` })

    await FamTemp.deleteOne({ created_msg: interaction.message.id })

    await fam_db.updateOne(
      {$push: { members_id: interaction.user.id }},
    )

}
