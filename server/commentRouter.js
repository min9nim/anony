// 라우팅 정의
const express = require('express')
const Comment = require('./models/comment')
const Post = require('./models/post')

const R = require('ramda')

const router = express.Router()
module.exports = router

function maskComment(comment) {
  const masked = JSON.parse(JSON.stringify(comment)) // plain 객체 생성
  // plain 객체를 사용하지 않으면 아래와 같이 _id 값들을 지울 수가 없음

  masked.uuid = undefined
  masked._id = undefined // _id는 이렇게 지울 수가 없음, 지우면 새로운 값이 다시 세팅되게 됨
  masked.__v = undefined
  return masked
}

function sendErr(res) {
  return err => {
    console.log(err)
    res.status(500).send(err.toString())
  }
}

const post = {}
const get = {}

// 부모글의 댓글카운트 세팅
function setPostCommentCnt(postKey) {
  return Post.findOne({ key: postKey }).then(post => {
    Comment.find({ $and: [{ postKey: post.key }] }).then(comments => {
      post.commentCnt = comments.length
      post.save().then(output => {
        console.log(output)
        console.log(`set post(${post.key})'s commentCnt : ${post.commentCnt}`)
      })
    })
  })
}

// 신규 댓글 등록
post['/add'] = (req, res) => {
  console.log('received data = ' + JSON.stringify(req.body, null, 2))

  // post 상태가 삭제된 상태라면 댓글 등록 불가
  Post.findOne({ key: req.body.postKey })
    .then(post => {
      if (post.deleted) {
        throw Error(`post(${req.body.postKey}) is deleted`)
      }
    })
    .then(() => {
      var comment = new Comment()
      comment.key = req.body.key
      comment.writer = req.body.writer
      comment.content = req.body.content
      comment.uuid = req.body.uuid
      comment.postKey = req.body.postKey
      comment.commentKey = req.body.commentKey
      comment.date = req.body.date

      comment
        .save()
        .then(output => {
          // 부모post 댓글카운트 set
          setPostCommentCnt(req.body.postKey)

          res.send({
            status: 'success',
            message: `comment(${req.body.key}) is saved`,
            output,
          })
        })
        .catch(sendErr(res))
    })
    .catch(sendErr(res))
}

// idx 번째부터 cnt 개수만큼 comment 를 조회
get['/get/:idx/:cnt'] = (req, res) => {
  const idx = Number(req.params.idx)
  if (isNaN(idx)) {
    //console.log(":idx 가 숫자가 아닙니다");
    //res.status(500).send(":idx 가 숫자가 아닙니다");
    sendErr(res)(Error(':idx 가 숫자가 아닙니다'))
    return
  }

  let cnt = Number(req.params.cnt)
  if (isNaN(cnt)) {
    //console.log(":cnt 가 숫자가 아닙니다");
    //res.status(500).send(":cnt 가 숫자가 아닙니다");
    sendErr(res)(Error(':cnt 가 숫자가 아닙니다'))
    return
  }

  // 조회 최대 건수 제한
  cnt = cnt > MAXCNT ? MAXCNT : cnt

  Comment.find()
    .sort({ date: -1 })
    .skip(idx)
    .limit(cnt)
    .then(comments => {
      //console.log(JSON.stringify(comments, null,2));
      let res = R.map(maskComment)(comments)
      //console.log(JSON.stringify(res, null,2));
      return res
    })
    .then(comments => res.send({ status: 'Success', comments: comments }))
    .catch(sendErr(res))
}

// key 에 해당하는 comment 삭제표시
get['/delete/:key/:uuid'] = (req, res) => {
  console.log(`/comments/delete/:key/:uuid call`)
  Comment.findOne({ key: req.params.key })
    .then(comment => {
      console.log('# comments = ' + JSON.stringify(comment, null, 2))
      if (comment.uuid === req.params.uuid) {
        comment.deleted = true
        comment.save().then(output => {
          // 댓글 카운트 set
          setPostCommentCnt(comment.postKey)

          res.send({
            status: 'Success',
            message: `comment(${req.params.key}) is deleted`,
            output,
          })
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

// key 에 해당하는 comment 를 제거
get['/remove/:key/:uuid'] = (req, res) => {
  console.log(`/comments/remove/:key/:uuid call`)
  Comment.findOne({ key: req.params.key })
    .then(comment => {
      console.log('# comments = ' + JSON.stringify(comment, null, 2))
      if (comment.uuid === req.params.uuid) {
        Comment.remove({ key: req.params.key }).then(output => {
          // 댓글 카운트 set
          setPostCommentCnt(comment.postKey)

          res.send({
            status: 'Success',
            message: `comment(${req.params.key}) is deleted`,
            output,
          })
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

// key 에 해당하는 포스트의 comment 를 조회
get['/get/:key'] = (req, res) => {
  Comment.find({ postKey: req.params.key })
    .then(comment => {
      console.log(comment)
      return comment
    })
    .then(R.map(maskComment))
    .then(comments => res.send({ status: 'Success', comments: comments }))
    .catch(sendErr(res))
}

// key에 해당하는 코멘트의 작성자가 맞는지 확인
get['/auth/:key/:uuid'] = (req, res) => {
  Comment.findOne({ key: req.params.key })
    .then(comment => {
      console.log(comment)
      if (comment.uuid === req.params.uuid) {
        res.send({
          status: 'Success',
          message: 'Authorized successfully',
          comment: maskComment(comment),
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

// 댓글 내용 수정
post['/edit/:uuid'] = (req, res) => {
  //console.log("received data = " + JSON.stringify(req.body, null, 2));
  Comment.findOne({ key: req.body.key })
    .then(comment => {
      //console.log("#### 검색결과");
      //console.log(JSON.stringify(comment, null, 2));

      if (comment.uuid !== req.params.uuid) {
        res.send({ status: 'Fail', message: 'Not authorized' })
        return
      }

      // 신규내용으로 업데이트
      Object.assign(comment, req.body)

      //console.log("#### 수정 후.. ");
      //console.log(JSON.stringify(comment, null, 2));
      comment
        .save()
        .then(output => {
          res.send({
            status: 'Success',
            message: `comment@${req.body.key} updated.`,
            output: maskComment(output),
          })
        })
        .catch(sendErr(res))
    })
    .catch(sendErr(res))
}

// delete 된 댓글을 복원
get['/restore/:key/:uuid'] = (req, res) => {
  Comment.findOne({ key: req.params.key })
    .then(comment => {
      if (comment.uuid === req.params.uuid) {
        comment.deleted = false
        comment.save().then(output => {
          console.log(output)
          res.send({
            status: 'Success',
            message: `comment(${req.params.key}) is restored`,
            output: maskComment(output),
          })
        })
      } else {
        res.send({ status: 'Fail', message: 'Not authorized' })
      }
    })
    .catch(sendErr(res))
}

router.post('/add', post['/add'])
router.post('/edit/:uuid', post['/edit/:uuid'])
router.get('/auth/:key/:uuid', get['/auth/:key/:uuid'])
router.get('/get/:key', get['/get/:key'])
router.get('/remove/:key/:uuid', get['/remove/:key/:uuid'])
router.get('/delete/:key/:uuid', get['/delete/:key/:uuid'])
router.get('/get/:idx/:cnt', get['/get/:idx/:cnt'])
router.get('/restore/:key/:uuid', get['/restore/:key/:uuid'])
