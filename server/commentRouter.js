// 라우팅 정의
const express = require('express');
const Comment = require('./models/comment');
const Post = require('./models/post');

const R = require('ramda');

const router = express.Router();


function maskComment(comment){
    comment.uuid = undefined;
    comment._id = undefined;
    comment.__v = undefined;
    return comment;
}


// 부모글의 댓글카운트 세팅
function setPostCommentCnt(postKey){
    return Post.findOne({key:postKey}).then(post => {
        Comment.find({$and:[{postKey:post.key}]}).then(comments => {
            post.commentCnt = comments.length;
            post.save().then(output => {
                console.log(output);
                console.log(`set post(${post.key})'s commentCnt : ${post.commentCnt}`);
            });
        });
    });                        
}




// 신규 댓글 등록
router.post("/add", (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    // post 상태가 삭제된 상태라면 댓글 등록 불가
    Post.findOne({key:req.body.postKey}).then(post => {
        if(post.deleted){
            throw Error(`post(${req.body.postKey}) is deleted`);
        }
    })
    .then(()=>{
        var comment = new Comment();
        comment.key = req.body.key;
        comment.writer = req.body.writer;
        comment.content = req.body.content;
        comment.uuid = req.body.uuid;
        comment.postKey = req.body.postKey;
        comment.commentKey = req.body.commentKey;
        comment.date = req.body.date;
    
        comment.save().then(output => {
    
            // 부모post 댓글카운트 set
            setPostCommentCnt(req.body.postKey);
            
            res.send({
                status: 'success',
                message: `comment(${req.body.key}) is saved`,
                output
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });           
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });;
        
        

});

// idx 번째부터 cnt 개수만큼 comment 를 조회
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

    Comment.find()
        .sort({"date" : -1})
        .skip(idx)
        .limit(cnt)
        .then(comments => {
            //console.log(JSON.stringify(comments, null,2));
            let res = R.map(maskComment)(comments);
            //console.log(JSON.stringify(res, null,2));
            return res;

        })
        .then(comments => res.send({status: "Success", comments : comments}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// key 에 해당하는 comment 를 삭제
router.get("/delete/:key/:uuid", (req, res) => {
    console.log(`/comments/delete/:key/:uuid call`);
    Comment.findOne({ key: req.params.key })
        .then(comment => {
            console.log("# comments = " + JSON.stringify(comment, null, 2));
            if(comment.uuid === req.params.uuid){
                comment.deleted = true;
                comment.save().then(output => {
                    // 댓글 카운트 set
                    setPostCommentCnt(comment.postKey)

                    res.send({
                        status: "Success",
                        message: `comment(${req.params.key}) is deleted`,
                        output
                    });
                });
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


// key 에 해당하는 comment 를 삭제
router.get("/remove/:key/:uuid", (req, res) => {
    console.log(`/comments/remove/:key/:uuid call`);
    Comment.findOne({ key: req.params.key })
        .then(comment => {
            console.log("# comments = " + JSON.stringify(comment, null, 2));
            if(comment.uuid === req.params.uuid){
                Comment.remove({key: req.params.key}).then(output => {

                    // 댓글 카운트 set
                    setPostCommentCnt(comment.postKey)

                    res.send({
                        status: "Success",
                        message: `comment(${req.params.key}) is deleted`,
                        output
                    });
                })
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});



// key 에 해당하는 comment 를 조회
router.get("/get/:key", (req, res) => {
    Comment.find({ postKey: req.params.key })
        .then(comment => {console.log(comment); return comment;})
        .then(R.map(maskComment))
        .then(comments => res.send({status: "Success", comments : comments}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


// key에 해당하는 포스트의 작성자가 맞는지 확인
router.get("/auth/:key/:uuid", (req, res) => {
    Comment.find({ key: req.params.key })
        .then(comments => {
            console.log(comments);
            if(comments[0].uuid === req.params.uuid){
                res.send({
                    status : "Success",
                    message: "Authorized successfully",
                    comment: maskComment(comments[0])
                 });
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});


module.exports = router;