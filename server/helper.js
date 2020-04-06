const moment = require('moment')
const createLogger = require('if-logger').default

function createContext(req, res, next) {
  const logger = createLogger({
    tags: [currentTime, req.method, req.originalUrl],
  })
  logger.verbose('context initialized')
  req.ctx = { logger }
  next()
}

function currentTime() {
  return moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')
}

module.exports = {
  createContext,
  currentTime,
}
