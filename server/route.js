// 라우팅 정의

const express = require('express');
const Post = require('./models/post');
const R = require('ramda');


const router = express.Router();

// posts 조회 최대 개수
const MAXCNT = 10;


// 라우터의 콜백을 프라미스 패턴으로 바꾸고자 했던 노력의 흔적..
// https: //gist.github.com/min9nim/c5dbdafc3a28f71a0c92dfd06bfdaf9e

function maskPost(post){
    return Object.assign({}, post, {
        uuid: undefined,
        _id: undefined,
        private: undefined
    });
}


// 신규 post 등록
router.post("/posts/add", (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    var post = new Post();
    post.key = req.body.key;
    post.title = req.body.title;
    post.writer = req.body.writer;
    post.content = req.body.content;
    post.date = req.body.date;
    post.uuid = req.body.uuid;

    post.save().then(output => {
        res.send({
            status: 'success',
            message: req.body.key + ' is saved',
            output
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    });   
});

// idx 번째부터 cnt 개수만큼 post 를 조회
router.get("/posts/get/:idx/:cnt", (req, res) => {
    const idx = Number(req.params.idx);
    if(isNaN(idx)){
        console.log(":idx 가 숫자가 아닙니다");
        res.status(500).send(":idx 가 숫자가 아닙니다");
        return;
    }


    let cnt = Number(req.params.cnt);
    if(isNaN(cnt)){
        console.log(":cnt 가 숫자가 아닙니다");
        res.status(500).send(":cnt 가 숫자가 아닙니다");
        return;
    }

    // 조회 최대 건수 제한
    cnt = cnt > MAXCNT ? MAXCNT : cnt;

    Post.find()
        .sort({"date" : -1})
        .skip(idx)
        .limit(cnt)
        .then(R.map(maskPost))
        .then(posts => res.send({status: "success", posts : posts}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// key 에 해당하는 post 를 삭제
router.delete("/posts/delete/:key/:uuid", (req, res) => {
    Post.find({ key: req.params.key })
        .then(posts => posts[0].uuid)
        .then(uuid => {
            if(uuid === req.params.uuid){
                Post.remove({ key: req.params.key })
                    .then(output => {
                        console.log(output);
                        res.send({
                            status: "success",
                            message: req.params.key + " is deleted",
                            output
                        });
                    });
            }else{
                res.send({ status : "fail", message: "Not authorized" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// key 에 해당하는 post 를 조회
router.get("/posts/get/:key", (req, res) => {
    Post.find({ key: req.params.key })
        .then(R.map(maskPost))
        .then(posts => res.send({status: "success", posts : posts}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


// key에 해당하는 포스트의 작성자가 맞는지 확인
router.get("/auth/:key/:uuid", (req, res) => {
    Post.find({ key: req.params.key })
        .then(posts => {console.log("/auth/:key/:uuid => " + posts[0]); return posts;})
        .then(posts => {
            if(posts[0].uuid === req.params.uuid){
                res.send({
                    status : "success",
                    message: "Authorized successfully",
                    post: maskPost(posts[0])
                 });
            }else{
                res.send({ status : "fail", message: "Not authorized" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


// 기존 포스트 수정
router.post("/posts/edit", (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    Post.update({ key: req.body.key}, { $set: req.body })
        .then(output => {
            console.log(output);
            if(!output.n) throw Error("No rows updated. (No matched)");
            res.send({
                statue: "success",
                message: `post@${req.body.key} updated.`,
                output
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send(err);
        });
});

module.exports = router;