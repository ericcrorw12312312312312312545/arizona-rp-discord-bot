const schema = mongoose.Schema({
    content: String,
    title: String,
    description: String,
    image: String,
    thumbnail: String,
});
module.exports = mongoose.model(`Embeds`, schema)
