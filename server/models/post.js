const mongoose = require('mongoose');


// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

//mongoose.connect('mongodb://localhost/talkplace');
//mongoose.connect('mongodb://13.209.69.12/talkplace'); // 아니 이건 안되고 아래꺼는 되네 허허.. 
mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/talkplace');


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