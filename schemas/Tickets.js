const schema = mongoose.Schema({
	close: { type: Boolean, default: false },
    created_at: Number,
    // creator_int: String,
    creator_id: String,
    channel_id: String,
    creator_msg: String,
    log: Array,
});
module.exports = mongoose.model(`Tickets`, schema)