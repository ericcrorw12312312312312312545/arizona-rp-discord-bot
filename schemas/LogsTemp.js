const schema = mongoose.Schema({
    DiscordID: String,
    content: String,
    nick: String,
    created_at: Number,
    mod_msg: String
});
module.exports = mongoose.model(`LogsTemp`, schema)
