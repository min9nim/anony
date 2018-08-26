#### 서비스설명
로그인/회원가입이 필요없는 100% 익명 SNS공간  
https://anony-212509.appspot.com

1. 누구나
로그인 없이 누구나 지금 바로 참여하실 수 있습니다

2. https://anony-212509.appspot.com/{새로운채널명}  
으로 접근시 새로운 대화 채널이 자동으로 생성됩니다

3. 인증방식
    - 서비스 접속시 접속 단말에 특정 토큰을 발급합니다
    - 해당 토큰값은 목록화면 위쪽에 표시됩니다.
    - 토큰 앞에 메뉴버튼을 클릭하면 토큰값을 임의로 변경할 수 있습니다
    - 토큰값을 따로 보관해 두면 내가 작성한 글에 대한 수정/삭제 권한을 유지해 갈 수 있습니다
    
    
<br>

#### 폴더구조
경로 | 설명
-- | --
/com | 서버&클라이언트 공통 모듈
/public | 실제 서비스에 사용되는 static 리소스
/public/css | 폰텔로 css 파일
/public/docs | 설계문서
/public/font | 폰텔로 웹폰트
/server | 노드서버 소스파일
/src | 클라이언트 소스파일
/src/pages | react-router로 분기되는 5가지 화면(List, Write, Edit, Post, PostHistory)
/src/components | 각 화면에서 사용되는 리액트컴포넌트
/src/css | 공통css
/src/ext | 외부js 라이브러리
/src/redux | 상태관리 모듈
/src/restful | RESTful 함수

<br>

#### 리액트 컴포넌트간 참조관계
<img src="https://anony-212509.appspot.com/docs/dependency.svg" />

<br>

#### 웹팩 번들파일 size 분석
```bash

                                                  Asset      Size  Chunks                    Chunk Names
                                          Post.chunk.js  51.4 KiB       6  [emitted]         Post
vendors~Edit~List~Post~PostHistory~Write~react.chunk.js   172 KiB       0  [emitted]         vendors~Edit~List~Post~PostHistory~Write~react
                           vendors~index~react.chunk.js   183 KiB       2  [emitted]         vendors~index~react
                                        index.bundle.js  26.2 KiB       3  [emitted]         index
                                        react.bundle.js  1.49 KiB       4  [emitted]         react
                                          List.chunk.js    48 KiB       5  [emitted]         List
                 vendors~List~Post~PostHistory.chunk.js   221 KiB       1  [emitted]         vendors~List~Post~PostHistory
                                          Edit.chunk.js  5.54 KiB       7  [emitted]         Edit
                                         Write.chunk.js  5.29 KiB       8  [emitted]         Write
                                   PostHistory.chunk.js  46.8 KiB       9  [emitted]         PostHistory
                                 vendors~index.chunk.js  72.3 KiB      10  [emitted]         vendors~index
                           vendors~highlightjs.chunk.js   539 KiB      11  [emitted]  [big]  vendors~highlightjs
                                  vendors~Post.chunk.js  87.4 KiB      12  [emitted]         vendors~Post
```

<img src="https://anony-212509.appspot.com/docs/size_thumb.png" />

[자세히 보기](https://anony-212509.appspot.com/docs/size_prod.html)

<br>

