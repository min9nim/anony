const mongoose = require("./dbConnect");
const R = require("ramda");


const Schema = mongoose.Schema;
const postSchema = new Schema({
    origin: String,
    key: {type: String, unique: true},
    title: String,
    writer: String,
    content: String,
    createdDate: Number,
    lastViewedDate: Number,
    date: Number,       // lastModifiedDate
    isPrivate: {type: Boolean, default: false},
    isMarkdown: {type: Boolean, default: false},
    hasComment: {type: Boolean, default: true},
    commentCnt : {type: Number, default: 0},
    viewCnt : {type: Number, default: 0},
    like: String,       // , 쉼표로 구분
    deleted: {type: Boolean, default: false},
    uuid: {type: String, required: true},
    context: String
});


module.exports = mongoose.model('Post', postSchema, "posts");
