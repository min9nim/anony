const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    key: String,
    writer: String,
    content: String,
    uuid: String,
    postKey: String,
    commentKey: String,
    date: Number
});

module.exports = mongoose.model('comment', commentSchema);
