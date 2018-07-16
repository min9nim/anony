const mongoose = require('mongoose');
const dbConfig = require("../../dbConfig");

// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});


console.log("== argv ==")
console.log(process.argv);

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
    console.log("개발디비 접속");
    mongoose.connect(dbConfig.dev);
  }else{
    console.log("운영디비 접속");
    mongoose.connect(dbConfig.prod);
}

//mongoose.connect('mongodb://localhost/talkplace');
//mongoose.connect('mongodb://13.209.69.12/talkplace'); // 아니 이건 안되고 아래꺼는 되네 허허.. 
//mongodb://keating:xxxx@ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/dev


module.exports = mongoose;
