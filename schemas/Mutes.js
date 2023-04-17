const schema = mongoose.Schema({
    DiscordID: String,
    endDate: Number,
    papugg: { type: String, default: false },
    vitya: { type: String, default: false },
    hozyin: { type: String, default: false }
});
module.exports = mongoose.model(`Mutes`, schema)
