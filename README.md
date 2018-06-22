# Anony

### 설치
```
~ $ git clone https://github.com/min9nim/anony.git
~ $ cd anony
~/anony $ npm install
```
<br>

### 개발버젼 빌드
```
~/anony $ npm run dev-build
```
<br>

### 개발서버 시작

```
~/anony $ npm run dev-server
~/anony $ npm run dev-express
```

<br>

### 개발서버 접속
http://localhost:7777

<br>

### 운영버젼 빌드
```
~/anony $ npm run prod-build
```

<br>

### 운영서버 시작

```
~/anony $ npm start
```
터미널 종료 후에도 서비스를 계속 해야할 경우에는 forever 이용

1. forever 설치
    ```
    sudo npm i -g forever
    ```
2. 서비스 시작
    ```
    forever start server/app.js
    ```
3. 서비스 목록 확인
    ```
    forever list
    ```
4. 서비스 종료
    ```
    forever stop server/app.js
    ```