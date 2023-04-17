const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = async (bot, member) => {
  const guild = bot.guilds.cache.get(botconfig.guild_id)
  const sitebtn = new MessageButton()
      .setLabel('Наш сайт')
      .setURL('https://bone-country.ru')
      .setStyle('LINK')
  const forumbtn = new MessageButton()
      .setLabel('Наш форум')
      .setURL('https://forum.bone-country.ru')
      .setStyle('LINK')
  const youtubebtn = new MessageButton()
      .setLabel('YouTube канал')
      .setURL('https://www.youtube.com/c/VillageRolePlayOfficialChannel')
      .setStyle('LINK')
  const vkbtn = new MessageButton()
      .setLabel('Сообщество ВКонтакте')
      .setURL('https://vk.com/bonecounty12')
      .setStyle('LINK')

      const linkrow1 = new MessageActionRow()
      .addComponents(sitebtn)
      .addComponents(forumbtn)
      .addComponents(youtubebtn)
      .addComponents(vkbtn)


  member.send({embeds: [
          new MessageEmbed()
          .setTitle('Добро пожаловать!')
          .setDescription('Добро пожаловать на сервер SAMP: Жизнь в Деревне🐦.\n\nВся основная информация по серверу есть в канале <#695387295846760621>.\nНе забудьте прочитать правила нашего сервера в канале <#695387295192449095>\nТак же, Вы можете выбрать роль своего сервера в канале <#956152357593440307>, нажав на соответствующую кнопку.\n\nЕсли у Вас остались вопросы - не стесняйтесь, задавайте их в <#956443048261345321>.\nПриятного времяпрепровождения!')
          .setColor('#FFBB06')
          .setFooter({text: `SAMP: Жизнь в Деревне🐦`, iconURL: `https://images-ext-2.discordapp.net/external/Q8LvMoLA_zqgzb4n2N_V38vkvJcB-G5qgVs04D9WS5s/%3Fsize%3D1024/https/cdn.discordapp.com/icons/527799726557364237/65fd35e326f6a59383b3d64050afc7c4.webp`})
      ], components: [linkrow1]}).catch(() => null)
}
