const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    key: String,
    title: String,
    writer: String,
    content: String,
    date: Number
});

module.exports = mongoose.model('post', postSchema);