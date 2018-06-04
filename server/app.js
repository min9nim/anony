const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
const fs = require("fs");
const path = require("path");


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



// 라우팅 정의
app.get("/hello", (req, res) => {
    res.send("hello world..");
})

app.get("/load", (req, res) => {
    fs.readFile(DATAFILE, (err, data) => {
        if(err){
            // 최초 data.json 이 존재하지 않을 경우 예외처리
            console.log(err);
            res.send({
                status : "ok",
                data : {mode : "list", data : []}
            });                
        }else{
            res.send({
                status : "ok",
                data : JSON.parse(data)
            });    
        }
    })
});

app.post("/save", (req, res) => {
    // request의 content-type 이 application/json 이어야 req.body에 접근 가능함
    console.log("received data = " + JSON.stringify(req.body, null, 2));
    fs.writeFile(DATAFILE, JSON.stringify(req.body, null, 2), (err) => {
        if(err) throw err;
        res.send({
            status : 'ok',
            message : 'save success'
        });
    })
});

app.listen(PORT, function(){
    console.log(`express is lintening on port ${PORT}`);
});

