// 라우팅 정의
const express = require('express');
const Post = require('./models/post');
const Comment = require('./models/comment');

const R = require('ramda');

const router = express.Router();

// posts 조회 최대 개수
const MAXCNT = 10;


// 라우터의 콜백을 프라미스 패턴으로 바꾸고자 했던 노력의 흔적..
// https: //gist.github.com/min9nim/c5dbdafc3a28f71a0c92dfd06bfdaf9e

function maskPost(post){
    post.uuid = undefined;      // uuid 는 이렇게 해도 해당 정보가 화면까지 내려가는 것 같다
    post._id = undefined;
    post.__v = undefined;
    post.private = undefined;
    // for(var i in post){
    //     console.log(i + ", ");
    // }
    return post;
    /* 아래와 같이 처리하면 난리납니다..
    https://github.com/min9nim/talkplace/wiki/%5BMongoDB%5D-%EB%8B%A4%ED%81%90%EB%A8%BC%ED%8A%B8%EC%9D%98-%EC%9D%BC%EB%B6%80-%EB%82%B4%EC%9A%A9%EB%A7%8C-%EC%A7%80%EC%9A%B0%EA%B3%A0%EC%9E%90-%ED%95%A0-%EB%95%8C
    
    return Object.assign({}, post, {
        uuid: undefined,
        _id: undefined,
        __v: undefined,
        private: undefined
    });
    */
}


// 신규 post 등록
router.post("/add", (req, res) => {
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
            message: `post(${req.body.key}) is saved`,
            output
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
    });   
});

// idx 번째부터 cnt 개수만큼 post 를 조회
router.get("/get/:idx/:cnt", (req, res) => {
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
        .then(posts => {
            //console.log(JSON.stringify(posts, null,2));
            let res = R.map(maskPost)(posts);
            //console.log(JSON.stringify(res, null,2));
            return res;

        })
        .then(posts => res.send({status: "success", posts : posts}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// key 에 해당하는 post 를 삭제
router.delete("/delete/:key/:uuid", (req, res) => {
    Post.find({ key: req.params.key })
        .then(posts => {
            console.log(`# valid-delete-url = /delete/${posts[0].key}/${posts[0].uuid}`);
            if(posts[0].uuid === req.params.uuid){
                Post.remove({ key: req.params.key })
                    .then(output => {
                        console.log(output);
                        res.send({
                            status: "success",
                            message: `post(${req.params.key}) is deleted`,
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
router.get("/get/:key", (req, res) => {
    Post.find({ key: req.params.key })
        .then(post => {console.log(post); return post;})
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
        .then(posts => {
            console.log(posts);
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
router.post("/edit", (req, res) => {
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