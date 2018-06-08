// 라우팅 정의

const express = require('express');
const Post = require('./models/post');

const router = express.Router();

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
            message: 'save success'
        });

    });   
});

/*
// 전체 데이터를 한꺼번에 가져오는 api 는 필요 없잖아?
router.get("/posts", (req, res) => {
    Post.find()
        .then(posts => res.send({posts : posts}))
        .catch(err => res.status(500).send(err));
});
*/

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