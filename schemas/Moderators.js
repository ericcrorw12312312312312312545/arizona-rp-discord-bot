const schema = mongoose.Schema({
    DiscordID: String,
    punishment: { type: Number, default: 0 },
});
module.exports = mongoose.model(`Moderators`, schema)
