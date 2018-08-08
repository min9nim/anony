const mongoose = require('mongoose');


//const dbConfig = process.env.PORT ? require("../../dbConfig") : require("../../../dbConfig");
const dbConfig = require("./dbConfig");

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

module.exports = mongoose;
