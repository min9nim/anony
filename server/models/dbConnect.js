const mongoose = require('mongoose');

// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});


console.log("== argv ==")
console.log(process.argv);

if (process.env.NODE_ENV !== 'production') {
    console.log("개발모드 : " + process.env.NODE_ENV);
  }else{
    console.log("운영모드 : " + process.env.NODE_ENV);
  }

if(process.argv[2]){
    // 개발모드
//mongoose.connect('mongodb://localhost/talkplace');
//mongoose.connect('mongodb://13.209.69.12/talkplace'); // 아니 이건 안되고 아래꺼는 되네 허허.. 
    mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/talkplace');
}else{
    mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/anony');
}


module.exports = mongoose;
