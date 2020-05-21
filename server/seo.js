const Post = require('./models/post')
const connectDB = require('./models/dbConnect')
const fs = require('fs')
const Remarkable = require('remarkable')
const $m = require('../com/util')

const filepath =
  process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development'
    ? __dirname + '/../public/index.dev.html'
    : __dirname + '/../public/index.html'

const md = new Remarkable({
  html: true,
  linkify: true,
  xhtmlOut: true,
})

module.exports = seo = {}

// seo 최적화
seo.post = async function(req, res) {
  const logger = req.ctx.logger
  logger.info('### seo.post called')

  let post
  try {
    await connectDB()
    logger.debug('Post.findOne 호출 전')
    // key 에 해당하는 post 를 조회
    post = await Post.findOne({
      $and: [
        { isPrivate: { $in: [false, undefined] } },
        { key: req.params.key },
      ],
    })
    logger.debug('Post.findOne 호출 후')
  } catch (e) {
    logger.debug('seo.post 에서 오류 발생했네')
    console.error(e)
    res.send({ status: 'Fail', message: e.message })
    return
  }

  fs.readFile(filepath, 'utf-8', function(err, buf) {
    if (err) {
      logger.error(err)
      res.send({ status: 'Fail', message: err.message })
      return
    }
    try {
      if (post === null) {
        // private 글이거나 postKey 값이 유효하지 않은 경우

        const output = buf
          .toString()
          .replace(/{{title}}/g, '')
          .replace(/{{description}}/g, '')
          .replace('{{content}}', '')
        res.send(output)
        //throw Error("Invlid access");
      } else {
        const tagRemovedContent = $m.removeTag(post.content)
        const output = buf
          .toString()
          .replace(/{{title}}/g, post.title)
          .replace(/{{description}}/g, tagRemovedContent.substr(0, 100))
          .replace(
            '{{content}}',
            post.isMarkdown ? md.render(tagRemovedContent) : tagRemovedContent,
          )
        //console.log(output);
        res.send(output)
      }
    } catch (e) {
      // 아니 해당 post 가 없으면 위에 err로 떨어져야지 왜 일루 들어와서 서버가 죽고 난리지???;;
      logger.error(e.message)
      res.send({ status: 'Fail', message: e.message })
    }
  })
}

seo.list = async function(req, res, next) {
  const logger = req.ctx.logger
  logger.info('### seo.list called')
  if (
    req.params.context &&
    req.params.context.match(
      /(\.js|\.txt|\.html|\.png|\.jpg|\.gif|\.css|\.ico|\.svg)$/,
    )
  ) {
    // 루트에서 .txt 나 .js 파일등 static파일을 요청한 경우
    next()
    return
  }
  try {
    await connectDB()
    const posts = await Post.find({
      $and: [
        { isPrivate: { $in: [false, undefined] } },
        { origin: undefined },
        { context: req.params.context },
      ],
    })
      .sort({ date: -1 }) // 최종수정일 기준 내림차순
      .skip(0)
      .limit(10)

    fs.readFile(filepath, 'utf-8', function(err, buf) {
      if (err) {
        console.error(err)
        res.send({ status: 'Fail', message: err.message })
        return
      }
      try {
        const output = buf
          .toString()
          .replace(
            /{{title}}/g,
            req.params.context ? req.params.context + '-list' : 'anony-list',
          )
          .replace(
            /{{description}}/g,
            posts
              .map((p) => $m.removeTag(p.title))
              .join('\n')
              .substr(0, 100),
          )
          .replace(
            '{{content}}',
            posts
              .map(
                (p) => $m.removeTag(p.title) + '\n' + $m.removeTag(p.content),
              )
              .join('\n'),
          )
        //console.log(output);
        res.send(output)
      } catch (e) {
        console.log(e.message)
        res.send({ status: 'Fail', message: e.message })
      }
    })
  } catch (e) {
    console.error(e)
    res.send({ status: 'Fail', message: e.message })
  }
}

seo.write = function(req, res, next) {
  console.log('### seo.write called')
  if (
    req.params.context &&
    req.params.context.match(
      /(\.js|\.txt|\.html|\.png|\.jpg|\.gif|\.css|\.ico|\.svg)$/,
    )
  ) {
    // 루트에서 .txt 나 .js 파일등 static파일을 요청한 경우
    next()
    return
  }

  fs.readFile(filepath, 'utf-8', function(err, buf) {
    if (err) {
      console.log(err)
      res.send({ status: 'Fail', message: err.message })
      return
    }
    try {
      const output = buf
        .toString()
        .replace(
          /{{title}}/g,
          req.params.context ? req.params.context + '-write' : 'public-write',
        )
        .replace(/{{description}}/g, 'Anony write page')
        .replace('{{content}}', 'Anony write page')
      res.send(output)
    } catch (e) {
      console.error(e.message)
      res.send({ status: 'Fail', message: e.message })
    }
  })
}
