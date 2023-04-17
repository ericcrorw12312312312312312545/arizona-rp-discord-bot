const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Families = require('../../schemas/Families')

module.exports = async (bot, message) => {
  if (message.channel.id != `695387299088957530`) return
  await message.guild.members.fetch(message.author.id)
  let fam_db = await Families.findOne({ members_id: message.author.id })
  if(!fam_db) return
  fam_db.exp += 0.5
  fam_db.save()
}
