const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    key: String,
    title: String,
    writer: String,
    content: String,
    date: Number,
    uuid: String
});

module.exports = mongoose.model('post', postSchema);
