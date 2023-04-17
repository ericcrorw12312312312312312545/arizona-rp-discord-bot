const schema = mongoose.Schema({
    tikets: { type: Number, default: 0 }
});
module.exports = mongoose.model(`Numeric`, schema)