const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')
var categoryid = "795309272241406012";
var channelid = "986656196402487326";

module.exports = async (bot, oldState, newState) => {
  if(newState.channel?.id == channelid){
    let user_db = await Users.findOne({ DiscordID: newState.member.id })

    if (user_db.PrivateIsLocked == `false`){
      newState.guild.channels.create(`${user_db.PrivateName}`,{
          type:'GUILD_VOICE',
          parent:categoryid,
          userLimit:user_db.PrivateSlots,
          permissionOverwrites:[
            {
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
          },
          {
            id:newState.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL","CONNECT"]
          },
        ]
      }).then(async(channel) => {
          newState.setChannel(channel)
      })
    }
    if (user_db.PrivateIsLocked == `true`){
      newState.guild.channels.create(`${user_db.PrivateName}`,{
          type:'GUILD_VOICE',
          parent:categoryid,
          userLimit:user_db.PrivateSlots,
          permissionOverwrites:[
            {
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
            },
            {
              id:newState.guild.roles.everyone.id,
              deny: ["VIEW_CHANNEL","CONNECT"]
            },
            {
              id:`695387222819471380`,
              deny: ["VIEW_CHANNEL","CONNECT"]
            },
            {
              id:`695387223218192475`,
              deny: ["VIEW_CHANNEL","CONNECT"]
            }
        ]
      }).then(async(channel) => {
          newState.setChannel(channel)
      })
    }
  }
  if(oldState.channel?.id != channelid && oldState.channel?.parent?.id == categoryid && !oldState.channel?.members.size) oldState.channel.delete();
}
