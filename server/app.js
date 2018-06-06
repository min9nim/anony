const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");


// 상수정의
const app = express();
const PORT = 8080;
const DATAFILE = __dirname + path.sep + "data.json"; // __dirname 는 app.js 가 위치한 경로


// 미들웨어 정의
app.use(morgan('combined'));
app.use(bodyParser.json());
const staticPath = process.platform.indexOf("win32") > -1
                   ? __dirname + '\\..\\public' 
                   : __dirname + '/../public' ;
app.use(express.static(staticPath));


// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

//mongoose.connect('mongodb://localhost/talkplace');
//mongoose.connect('mongodb://13.209.69.12/talkplace'); // 아니 이건 안되고 아래꺼는 되네 허허.. 
mongoose.connect('mongodb://ec2-13-209-69-12.ap-northeast-2.compute.amazonaws.com/talkplace');




// DEFINE MODEL
let Post = require('./models/post');


// 라우팅 정의
app.get("/hello", (req, res) => {
    res.send("hello world..");
})

app.post("/api/posts", (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    var post = new Post();
    post.key = req.body.key;
    post.title = req.body.title;
    post.writer = req.body.writer;
    post.content = req.body.content;
    post.date = req.body.date;

    post.save(function (err) {
        if (err) throw err;
        res.send({
            status: 'ok',
            message: 'save success'
        });

    });   
});


app.get("/api/posts", (req, res) => {
    Post.find(function (err, posts) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.send({posts : posts});
    })    
});


app.delete("/api/posts/:key", (req, res) => {
    Post.remove({ key: req.params.key }, function (err, output) {
        if (err) return res.status(500).json({ error: "database failure" });
        res.send({message : req.params.key + " is deleted"})
    })
});


app.listen(PORT, function(){
    console.log(`express is lintening on port ${PORT}`);
});

