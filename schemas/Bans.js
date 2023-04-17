const schema = mongoose.Schema({
    DiscordID: String,
    endDate: Number
});
module.exports = mongoose.model(`Bans`, schema)