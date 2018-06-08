const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan');
//const fs = require("fs");
const path = require("path");
const route = require('./route');

// 익스프레스 앱생성
const app = express();

// 상수정의
const PORT = 8080;
//const DATAFILE = __dirname + path.sep + "data.json"; // __dirname 는 app.js 가 위치한 경로


// 미들웨어 등록
app.use(morgan('combined'));
app.use(bodyParser.json());
const staticPath = process.platform.indexOf("win32") > -1
                   ? __dirname + '\\..\\public' 
                   : __dirname + '/../public' ;
app.use(express.static(staticPath));

// RESTful API 라우터 등록
app.use('/api', route);

// 서버리슨 시작
app.listen(PORT, function(){
    console.log(`express is lintening on port ${PORT}`);
});

