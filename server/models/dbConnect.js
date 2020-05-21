const mongoose = require('mongoose')

module.exports = async function connectDB() {
  const db = mongoose.connection
  db.on('error', console.error)
  db.once('open', function() {
    console.log('Connected to mongod server')
  })
  const dburl = process.env.dburl
  console.log('dburl:', dburl)

  try {
    await mongoose.connect(dburl)
    console.log('DB 연결 성공')
    return
  } catch (e) {
    console.warn('디비 연결 실패..')
    console.error(error)
    throw e
  }
}
