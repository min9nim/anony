// 라우팅 정의
const express = require('express')
const Post = require('./models/post')
const shortid = require('shortid')
const Comment = require('./models/comment')
const R = require('ramda')
const $m = require('../com/util')

const router = express.Router()
module.exports = router

const post = {}
const get = {}

function setHasComment(post) {
  // hasComment 기능이 추가되기 전 데이터들에 대한 값 보정, 2018/06/16
  post.hasComment = post.hasComment === undefined ? true : post.hasComment
  return post
}

function sendErr(res) {
  return err => {
    console.log(err)
    res.status(200).send({
      status: 'Fail',
      message: err.toString(),
    })
  }
}

// 라우터의 콜백을 프라미스 패턴으로 바꾸고자 했던 노력의 흔적..
// https: //gist.github.com/min9nim/c5dbdafc3a28f71a0c92dfd06bfdaf9e

function maskPost(post, uuid) {
  const masked = JSON.parse(JSON.stringify(post)) // plain 객체 생성

  //console.log("## masked.like = " + masked.like);
  //console.log("## uuid = " + uuid);
  masked.like = masked.like || ''
  if (uuid) {
    masked.liked = R.pipe(R.split(','), R.contains(uuid))(masked.like)
  }
  //console.log("## masked.liked = " + masked.liked);

  masked.likeCnt = masked.like === '' ? 0 : masked.like.split(',').length

  masked.uuid = undefined
  masked._id = undefined
  masked.__v = undefined
  masked.like = undefined

  return masked
}

// 신규 post 등록
post['/add'] = (req, res) => {
  console.log('received data = ' + JSON.stringify(req.body, null, 2))
  var post = new Post()
  Object.assign(post, req.body, { createdDate: Date.now() })
  // 글최초 등록하면 바로 글보기 화면으로 가면서 카운트가 1 증가하는데
  // 최초 등록 후 글이 보여질 때는 view를 0으로 맞추기 위해
  // 아래와 같이 명시적으로 처음에 undefined 값을 할당한다.
  // get["/view/:key"] 함수와 연계하여 생각해 본다
  post.viewCnt = undefined

  post
    .save()
    .then(output => {
      res.send({
        status: 'Success',
        message: `post(${req.body.key}) is saved`,
        output: maskPost(output, req.body.uuid),
      })
    })
    .catch(sendErr(res))
}

// 글내용 수정
post['/edit/:uuid'] = (req, res) => {
  //console.log("received data = " + JSON.stringify(req.body, null, 2));

  Post.findOne({ key: req.body.key })
    .then(post => {
      if (post.uuid !== req.params.uuid || post.origin !== undefined) {
        res.send({ status: 'Fail', message: 'Not authorized' })
        return
      }

      if (post.title !== req.body.title || post.content !== req.body.content) {
        // 제목이나 내용이 변경된 경우에만 기존 내용 백업
        var prevPost = new Post()
        prevPost.origin = post.key
        ;(prevPost.key = shortid.generate()), (prevPost.title = post.title)
        prevPost.writer = post.writer
        prevPost.content = post.content
        prevPost.date = post.date
        prevPost.isPrivate = post.isPrivate
        prevPost.isMarkdown = post.isMarkdown
        prevPost.hasComment = post.hasComment
        prevPost.uuid = post.uuid
        prevPost.viewCnt = post.viewCnt
        prevPost.context = post.context
        // 근데 여기서 Object.assign 을 사용하면 오류 발생ㅠ
        // https://gist.github.com/min9nim/8f3c3895bf2e41e26921eb1002649306

        prevPost.save().then(output => {
          //console.log("# prevPost is saved");
          //console.log(output);
        })
      }

      // 신규내용으로 업데이트
      Object.assign(post, req.body)
      post
        .save()
        .then(output => {
          //console.log("# afterPost is saved");
          //console.log(output);
          res.send({
            status: 'Success',
            message: `post@${req.body.key} updated.`,
            output: maskPost(output),
          })
        })
        .catch(sendErr(res))
    })
    .catch(sendErr(res))
}

const getHitoryCnt = async post => {
  let posts = await Post.find({ origin: post.key })
  return posts.length
}

// 조회수 1증가
post['/view/:key'] = (req, res) => {
  /**
   * 18.11.03
   * 민감한 context 정보는 제거 처리
   */
  Post.findOne({ key: req.params.key }, { context: 0 })
    .then(post => {
      if (post === null) {
        throw Error('Invalid access')
      } else if (post.isPrivate && post.uuid !== req.body.uuid) {
        throw Error('Not authorized')
      } else if (post.origin) {
        res.send({
          status: 'Fail',
          message: `edited Post@${req.params.key} cannot increased viewCnt`,
        })
      } else {
        post.viewCnt = post.viewCnt === undefined ? 1 : post.viewCnt + 1
        post.lastViewedDate = Date.now()
        post.save().then(async output => {
          output = JSON.parse(JSON.stringify(output))
          output.historyCnt = await getHitoryCnt(output)
          res.send({
            status: 'Success',
            message: `post@${req.params.key} viewCnt + 1.`,
            output: maskPost(output, req.body.uuid),
          })
        })
      }
    })
    .catch(sendErr(res))
}

// idx 번째부터 cnt 개수만큼 post 를 조회
post['/get/:context/:idx/:cnt'] = async (req, res) => {
  const idx = Number(req.params.idx)
  const MAXCNT = 50 // posts 조회 최대 개수

  if (isNaN(idx)) {
    //console.log(":idx 가 숫자가 아닙니다");
    res.status(500).send(':idx 가 숫자가 아닙니다')
    return
  }

  let cnt = Number(req.params.cnt)
  if (isNaN(cnt)) {
    console.log(':cnt 가 숫자가 아닙니다')
    res.status(500).send(':cnt 가 숫자가 아닙니다')
    return
  }

  // 조회 최대 건수 제한
  cnt = cnt > MAXCNT ? MAXCNT : cnt

  // console.log("@@@111 " + Date.now())
  // let allPosts = await Post.find({context: req.params.context});
  // console.log("@@@222 " +Date.now())

  Post.find({
    $and: [
      {
        $or: [
          { isPrivate: { $in: [false, undefined] } },
          {
            $and: [{ isPrivate: true }, { uuid: req.body.uuid }],
          },
        ],
      },
      { origin: undefined },
      { context: req.params.context },
      {
        $or: [
          {
            title: req.body.search
              ? new RegExp(req.body.search, 'i')
              : new RegExp('.*'),
          },
          {
            content: req.body.search
              ? new RegExp(req.body.search, 'i')
              : new RegExp('.*'),
          },
        ],
      },
    ],
  })
    // .then(posts => {
    //     console.log("@@@ 11 " + Date.now())
    //     const allPosts = posts.map(p => {
    //         return {key: p.key, origin: p.origin}
    //     });
    //     console.log("@@@ 22 " + Date.now())
    //     posts = posts.filter(p => p.origin === undefined)
    //     console.log("@@@ 33 " + Date.now())
    //     posts.sort((a,b) => b.date - a.date);
    //     console.log("@@@ 44 " + Date.now())
    //     return posts.slice(idx, idx+cnt)
    //             .map(post => {
    //                 console.log("@@@ 55 " + Date.now())
    //                 let historyCnt = allPosts.filter(p => p.origin === post.key).length;
    //                 post.historyCnt = historyCnt;
    //                 post.aaa = 111;
    //                 return post;
    //             })
    // })
    .sort({ date: -1 }) // 최종수정일 기준 내림차순
    .skip(idx)
    .limit(cnt)
    .then(R.map(setHasComment))
    .then(R.map(R.partialRight(maskPost, [req.body.uuid])))
    .then(posts => res.send({ status: 'Success', posts: posts }))
    .catch(sendErr(res))
}

// key 에 해당하는 post 를 delete
get['/delete/:key/:uuid'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      console.log(`# valid-delete-url = /delete/${post.key}/${post.uuid}`)
      if (post.uuid === req.params.uuid) {
        post.deleted = true
        post.save().then(output => {
          //console.log(output);
          res.send({
            status: 'Success',
            message: `post(${req.params.key}) is deleted`,
            output: maskPost(output),
          })
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

// delete 된 글을 복원
get['/restore/:key/:uuid'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      if (post.uuid === req.params.uuid) {
        post.deleted = false
        post.save().then(output => {
          //console.log(output);
          res.send({
            status: 'Success',
            message: `post(${req.params.key}) is restored`,
            output: maskPost(output),
          })
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

// key 에 해당하는 post 를 remove
get['/remove/:key/:uuid'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      console.log(`# valid-remove-url = /remove/${post.key}/${post.uuid}`)
      if (post.uuid === req.params.uuid) {
        if (post.commentCnt) {
          res.send({
            status: 'Fail',
            message: `post(${req.params.key}) has comments`,
          })
        } else {
          Comment.remove({ postKey: req.params.key })
            .then(output => {
              //console.log(output);
              return Post.remove({
                $or: [{ key: req.params.key }, { origin: req.params.key }],
              })
            })
            .then(output => {
              //console.log(output);
              res.send({
                status: 'Success',
                message: `post(${req.params.key}) is removed`,
                output,
              })
            })
        }
      } else {
        res.send({
          status: 'Fail',
          message: 'Not authorized',
        })
      }
    })
    .catch(sendErr(res))
}

// key 에 해당하는 post 를 조회
post['/get/:key'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(p => {
      if (p === null) {
        throw Error('Invalid access')
      } else if (p.isPrivate && p.uuid !== req.body.uuid) {
        throw Error('Not authorized')
      } else {
        return p
      }
    })
    .then(R.partialRight(maskPost, req.body.uuid))
    .then(setHasComment)
    .then(post => res.send({ status: 'Success', post }))
    .catch(sendErr(res))
}

// key에 해당하는 포스트의 작성자가 맞는지 확인
get['/auth/:key/:uuid'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      //console.log(post);
      if (post.uuid === req.params.uuid) {
        res.send({
          status: 'Success',
          message: 'Authorized ok',
          post: maskPost(post, req.params.uuid),
        })
      } else {
        //console.log("Not authorized");
        //console.log(post);
        res.send({
          status: 'Fail',
          message: 'Not authorized',
        })
      }
    })
    .catch(sendErr(res))
}

// key 에 해당하는 post 수정내역을 조회
get['/history/:key'] = (req, res) => {
  Post.find({ origin: req.params.key })
    .then(R.map(maskPost))
    .then(R.map(setHasComment))
    .then(posts => res.send({ status: 'Success', posts }))
    .catch(sendErr(res))
}

// key에 해당하는 post의 viewCnt++
post['/likePost/:key'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      //console.log(post);
      if (post.like) {
        /* vanillaJS
                let arr = post.like.split(",");
                arr.push(req.params.uuid);
                post.like = arr.join(",");
                */
        post.like = R.pipe(
          R.split(','),
          R.append(req.body.uuid),
          R.join(','),
        )(post.like)
      } else {
        post.like = req.body.uuid
      }

      post.save().then(output => {
        console.log(output)
        res.send({
          status: 'Success',
          output: maskPost(output, req.body.uuid),
        })
      })
    })
    .catch(sendErr(res))
}

// key에 해당하는 post의 viewCnt--
post['/cancelLike/:key'] = (req, res) => {
  Post.findOne({ key: req.params.key })
    .then(post => {
      /* vanillaJS
            let arr = post.like.split(",");
            let idx = arr.findIndex(uuid => uuid === req.body.uuid);
            arr.splice(idx,1);
            post.like = arr.join(",");
            */

      /*
            post.like = R.pipe(
                R.split(","),
                R.filter(uuid => uuid !== req.body.uuid),
                R.join(",")
            )(post.like);
            */

      post.like = $m._go(
        post.like,
        R.split(','),
        R.filter(uuid => uuid !== req.body.uuid),
        R.join(','),
      )

      post.save().then(output => {
        console.log(output)
        res.send({
          status: 'Success',
          output: maskPost(output, req.body.uuid),
        })
      })
    })
    .catch(sendErr(res))
}

post['/myChannels'] = (req, res) => {
  Post.find({ uuid: req.body.uuid, origin: undefined })
    .then(
      $m._map(p => {
        return { key: p.key, context: p.context }
      }),
    )
    //.then(R.uniq)
    .then(arr => {
      let obj = {}
      arr.forEach(c => {
        if (obj[c.context] === undefined) {
          //console.log("c.context = " + c.context + " : " + c.key)
          obj[c.context] = 1
        } else {
          obj[c.context]++
        }
      })
      console.log(JSON.stringify(obj))
      return obj
    })
    .then(obj => {
      let res = []
      for (let key in obj) {
        //res.push(key + "(" + obj[key] + ")");
        res.push({ name: key, count: obj[key] })
      }
      return res
    })
    .then(channels => {
      console.log(JSON.stringify(channels))
      res.send({
        status: 'Success',
        output: channels,
      })
    })
    .catch(sendErr(res))
}

router.post('/add', post['/add'])
router.post('/edit/:uuid', post['/edit/:uuid'])
router.post('/view/:key', post['/view/:key'])
router.post('/likePost/:key', post['/likePost/:key'])
router.post('/cancelLike/:key', post['/cancelLike/:key'])
router.post('/get/:context/:idx/:cnt', post['/get/:context/:idx/:cnt'])
router.post('/get/:key', post['/get/:key'])
router.post('/myChannels', post['/myChannels'])

router.get('/delete/:key/:uuid', get['/delete/:key/:uuid'])
router.get('/restore/:key/:uuid', get['/restore/:key/:uuid'])
router.get('/remove/:key/:uuid', get['/remove/:key/:uuid'])
router.get('/auth/:key/:uuid', get['/auth/:key/:uuid'])
router.get('/history/:key', get['/history/:key'])
