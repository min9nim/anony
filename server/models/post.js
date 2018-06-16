const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    origin: String,
    key: String,
    title: String,
    writer: String,
    content: String,
    date: Number,
    isPrivate: Boolean,
    hasComment: Boolean,
    commentCnt : Number,
    deleted: Boolean,
    uuid: String
});

module.exports = mongoose.model('post', postSchema);
