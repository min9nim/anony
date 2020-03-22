const mongoose = require('mongoose')

// 디비설정
const db = mongoose.connection
db.on('error', console.error)
db.once('open', function() {
  console.log('Connected to mongod server')
})

//console.log("== argv ==")
//console.log(process.argv);

const dburl = process.env.dburl
console.log('dburl:', dburl)
mongoose
  .connect(dburl)
  .then(success => console.log('DB 연결 성공'))
  .catch(error => {
    console.warn('디비 연결 실패..')
    console.log('dburl:', dburl)
    console.log(error)
  })

// if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
//     //console.log("개발디비 접속");
//     const dbConfig = require("../../../dbConfig");
//     //mongoose.connect(dbConfig.dev);
//     console.log("개발이지만 운영디비 접속");
//     mongoose.connect(dbConfig.prod);
//   }else{
//     console.log("운영디비 접속");
//     const dbConfig = require("../../dbConfig");
//     mongoose.connect(dbConfig.prod);
// }

module.exports = mongoose
