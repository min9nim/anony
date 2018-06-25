const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
//const fs = require("fs");
//const path = require("path");
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const fallback = require('express-history-api-fallback');
const seo = require('./seo');



// 익스프레스 앱생성
const app = express();

// 서비스 포트
const PORT = process.argv[2] || 80;

//const DATAFILE = __dirname + path.sep + "data.json"; // __dirname 는 app.js 가 위치한 경로


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
//app.get("/:context", seo.list);
//app.get("/:context/list", seo.list);



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





// 서버리슨 시작
app.listen(PORT, function(){
    console.log(`express is lintening on port ${PORT}`);
});

