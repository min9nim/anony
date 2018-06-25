
const Post = require('./models/post');
const fs = require('fs');
//const path = require("path");

const filepath = __dirname + "/../public/index.html"; // __dirname 는 seo.js 가 위치한 경로


// seo 최적화
function seo(req, res, next){
    console.log("### seo middle ware called..");
    console.log("post key = " + req.params.key);
    
    // key 에 해당하는 post 를 조회
    Post.findOne({ key: req.params.key })
        .then(post => {
            const title = post.title;
            const content = post.content;

            fs.readFile(filepath, "utf-8", function(err, buf) {

                if(err){
                    // 최초 data.json 이 존재하지 않을 경우 예외처리
                    console.log(err);
                }else{
                    const output = buf.toString()
                                    .replace("{{title}}", post.title)
                                    .replace("{{description}}", post.content.substr(0,100));
                    console.log(output);
                    res.send(output);
                }
            });
          //  next();
        })
}

module.exports = seo;

