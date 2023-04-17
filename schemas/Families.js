const schema = mongoose.Schema({
    name: String,
    role_id: String,
    created_at: Number,
    leader_id: String,
    zams_id: Array,
    members_id: Array,
    color: { type: String, default: `#000000` },
    exp: { type: Number, default: 0 },
});
module.exports = mongoose.model(`Families`, schema)
