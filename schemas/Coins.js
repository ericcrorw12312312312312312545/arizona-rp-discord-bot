const schema = mongoose.Schema({
    DiscordID: String,
    coins: Number,
});
module.exports = mongoose.model(`Coins`, schema)
