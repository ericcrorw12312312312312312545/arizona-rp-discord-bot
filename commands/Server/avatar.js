
const { MessageEmbed, Permissions } = require("discord.js");
const botconfig = require('../../config')

module.exports = {
    name: "avatar",
    run: async (bot, message, args) => {
        try {
            const user = message.mentions.users.first();
            const {author} = message;
            const url = await (user?user:author).avatarURL({dynamic: true, size: 512});

            if(!url) return message.reply({
  embeds: [{
    title: `❌ | Упс, ошибка`,
    description: `У данного пользвателя нету аватарки`
  }]
});
if(!user) {
  message.reply({
  embeds: [{
    description: `**Аватар пользователя ${message.author}**`,
    image: {url},
    color: 16505678
  }]
})

} else  message.reply({
    embeds: [{
        description: `**Аватар пользователя ${user}**`,
        image: {url},
        color: 16505678
    }]
});
} catch (err) {
    console.log(err);
}
},
};
