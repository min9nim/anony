
const Post = require('./models/post');
const fs = require('fs');
const filepath = __dirname + "/../public/index.html"; // __dirname 는 seo.js 가 위치한 경로

module.exports = seo = {};

// seo 최적화
seo.post = function(req, res){
    // key 에 해당하는 post 를 조회
    Post.findOne({ key: req.params.key })
        .then(post => {
            fs.readFile(filepath, "utf-8", function(err, buf) {
                if(err){
                    console.log(err);
                    res.send({ status : "Fail", message: err.message });
                }else{
                    try{
                        const output = buf.toString()
                            .replace("{{title}}", post.title)
                            .replace("{{description}}", post.content.substr(0,100))
                            .replace("{{content}}", post.content);
                        console.log(output);
                        res.send(output);
                    }catch(e){
                        // 아니 해당 post 가 없으면 위에 err로 떨어져야지 왜 일루 들어와서 서버가 죽고 난리지???;;
                        console.log("오류 발생 : " + e.message);
                        res.send(e.message);
                    }
                }
            });
        })
}

seo.list = function(req, res, next){
    if(["bundle.js", "robots.txt"].includes(req.params.context)){
        next();
        return;
    }
    Post.find({$and : [{isPrivate:{$in: [ false, undefined ]}}, {origin: undefined}, {context: req.params.context}]})
        .sort({"date" : -1})    // 최종수정일 기준 내림차순
        .skip(0)
        .limit(10)
        .then(posts => {
            fs.readFile(filepath, "utf-8", function(err, buf) {
                if(err){
                    console.log(err);
                    res.send({ status : "Fail", message: err.message });
                }else{
                    const output = buf.toString()
                        .replace("{{title}}", req.params.context ? req.params.context + "-list" : "anony-list")
                        .replace("{{description}}", posts.map(p=>p.title).join("\n").substr(0,100))
                        .replace("{{content}}", posts.map(p=>p.title + "\n" + p.content).join("\n"));
                    console.log(output);
                    res.send(output);
                }
            });
        })
}



