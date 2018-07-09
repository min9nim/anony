const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
const fs = require("fs");
const path = require("path");
const https = require("https");
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const fallback = require('express-history-api-fallback');
const seo = require('./seo');



const filepath = __dirname + path.sep; // __dirname 는 app.js 가 위치한 경로



// 익스프레스 앱생성
const app = express();



// 미들웨어 등록
app.use(morgan('combined'));    // 서버 access 로그
app.use(bodyParser.json());


// SEO 설정
app.get("/post/:key", seo.post);
app.get("/:context/post/:key", seo.post);
app.get("/postHistory/:key", seo.post);
app.get("/:context/postHistory/:key", seo.post);
app.get("/", seo.list);
app.get("/list/", seo.list);
app.get("/:context", seo.list);
app.get("/:context/list", seo.list);



const staticPath = process.platform.indexOf("win32") > -1
                   ? __dirname + '\\..\\public' 
                   : __dirname + '/../public' ;
app.use(express.static(staticPath));       // 정적리소스 서비스


// RESTful API 라우터 등록
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);


// history-api-fallback 등록,
// 이거는 순서가 중요, 위에 라우터 등록보다 위에 있으면 안됨
app.use(fallback('index.html', { root: staticPath }));



// https 옵션
const options = {  
    key: fs.readFileSync(filepath + 'key.pem'),
    cert: fs.readFileSync(filepath + 'cert.pem')
};

// 서비스 포트
const PORT = process.env.NODE_ENV === "development" ? 8080 : 80;
const SSLPORT = process.env.NODE_ENV === "development" ? 9443 : 443;


// HTTP 서비스 시작
app.listen(PORT, function(){
    console.log(`express is listening on port ${PORT}`);
});


// HTTPS 서비스 시작
https.createServer(options, app).listen(SSLPORT, function(){  
    console.log("Https server listening on port " + SSLPORT);
});
