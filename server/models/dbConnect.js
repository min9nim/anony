const mongoose = require('mongoose');

// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});


<<<<<<< HEAD
console.log("== argv ==")
console.log(process.argv);

if(process.argv[2]){
    // 개발모드
=======

if(process.argv[2] === "8080"){
>>>>>>> a0e0d0ddcbdf586d11e1f9af8166a52ee91e5097
//mongoose.connect('mongodb://localhost/talkplace');
//mongoose.connect('mongodb://13.209.69.12/talkplace'); // 아니 이건 안되고 아래꺼는 되네 허허.. 
    mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/talkplace');
}else{
    mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/anony');
}


module.exports = mongoose;
