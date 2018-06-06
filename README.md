# talkplace

#### 설치
```
~ $ git clone https://github.com/min9nim/talkplace.git
~ $ cd talkplace
~/talkplace $ npm install
```

#### 개발모드 시작
```
~/talkplace $ npm run dev-server
~/talkplace $ npm run dev-express
```

#### 운영모드 시작
```
~/talkplace $ npm start
```



#### forever 를 이용한 서비스 실행
터미널 종료 후에도 계속 서비스를 해야할 경우 아래와 같이 forever 를 이용한다
1. forever 설치
```
sudo npm i -g forever
```
1. 서비스 시작
```
forever start server/app.js
```
1. 서비스 목록 확인
```
forever list
```
1. 서비스 종료
```
forever stop server/app.js
```

