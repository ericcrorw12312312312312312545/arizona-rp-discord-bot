const schema = mongoose.Schema({
    DiscordID: String,
    created_at: Number,
    created_msg: String,
    channel_id: String,
    role_id: String
});
module.exports = mongoose.model(`FamTemp`, schema)
