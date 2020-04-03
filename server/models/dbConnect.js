const mongoose = require('mongoose')

// 디비설정
const db = mongoose.connection
db.on('error', console.error)
db.once('open', function() {
  ctx.logger.verbose('Connected to mongod server')
})

//ctx.logger.verbose("== argv ==")
//ctx.logger.verbose(process.argv);

const dburl = process.env.dburl
ctx.logger.verbose('dburl:', dburl)
mongoose
  .connect(dburl)
  .then(success => ctx.logger.verbose('DB 연결 성공'))
  .catch(error => {
    console.warn('디비 연결 실패..')
    ctx.logger.verbose('dburl:', dburl)
    ctx.logger.verbose(error)
  })

// if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
//     //ctx.logger.verbose("개발디비 접속");
//     const dbConfig = require("../../../dbConfig");
//     //mongoose.connect(dbConfig.dev);
//     ctx.logger.verbose("개발이지만 운영디비 접속");
//     mongoose.connect(dbConfig.prod);
//   }else{
//     ctx.logger.verbose("운영디비 접속");
//     const dbConfig = require("../../dbConfig");
//     mongoose.connect(dbConfig.prod);
// }

module.exports = mongoose
