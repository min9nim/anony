// 라우팅 정의

const express = require('express');
const Post = require('./models/post');

const router = express.Router();


// 라우터의 콜백을 프라미스 패턴으로 바꾸고자 했던 노력의 흔적..
// https: //gist.github.com/min9nim/c5dbdafc3a28f71a0c92dfd06bfdaf9e


// 신규 post 등록
router.post("/posts", (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    var post = new Post();
    post.key = req.body.key;
    post.title = req.body.title;
    post.writer = req.body.writer;
    post.content = req.body.content;
    post.date = req.body.date;

    post.save(function (err) {
        if (err){
            console.log(err);
            res.status(500).send(err);
        }
        res.send({
            status: 'ok',
            message: req.body.key + ' is saved'
        });

    });   
});

// idx 번째부터 cnt 개수만큼 post 를 조회
router.get("/posts/:idx/:cnt", (req, res) => {
    Post.find()
        .sort({"date" : -1})
        .skip(Number(req.params.idx))
        .limit(Number(req.params.cnt))
        .then(posts => res.send({posts : posts}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// key 에 해당하는 post 를 삭제
router.delete("/posts/:key", (req, res) => {
    Post.remove({ key: req.params.key })
        .then(() => res.send({ message: req.params.key + " is deleted" }))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


module.exports = router;