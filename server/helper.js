const moment = require('moment')
const createLogger = require('if-logger').default

function format(level, tags, message) {
  const tagstr = tags
    .map((tag) => (typeof tag === 'function' ? tag() : tag))
    .join(' ')
  return `${tagstr} ${message}`
}

function createContext(req, res, next) {
  const logger = createLogger({
    format,
    tags: [currentTime, req.method, req.originalUrl],
  })
  logger.verbose.time('time:')
  res.on('finish', () => {
    logger.options.tags.push(res.statusCode)
    const contentLength = res.getHeader('Content-Length')
    if (contentLength) {
      logger.options.tags.push(contentLength)
    }
    logger.verbose.timeEnd('time:')
  })
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
