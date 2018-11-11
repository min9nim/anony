### 서비스설명
#### What is Anony
Anony는 익명을 기반으로 로그인없이 자유롭게 내가 원하는 글을 온라인 상에 게시하고 다른 사람과 간편히 내용을 공유할 수 있는 서비스를 제공합니다.
<br>
> 본 서비스는 telegra.ph 와 블라인드에서 영감을 얻었습니다.


#### Feature
![](https://anony-react.appspot.com/image/write-form.png)

Title
- 글의 제목입니다

Writer 
- 글작성자를 입력합니다. 실명이든 닉네임이든 어떤 값이든 제한이 없습니다
- 필수 입력값은 아닙니다

Channel
- 글이 게시될 채널공간(라디오 주파수와 같은 개념으로 이해할 수 있습니다)
- 기본값은 public 입니다. public 채널은 모든 이에게 공개된 채널입니다.
- 새로운 값을 넣으면 글저장과 동시에 새로운 게시 공간(새로운 채널)이 생성되는 것입니다. Really awesome!
- 새로 생성되는 채널 공간은 나 혼자만의 자료 정리 노트로 혹은 특정 지인들과의 정보 공유 공간으로 활용될 수 있습니다. Lovely!
- 채널의 입력값은 20글자까지 허용됩니다
- 한글입력도 가능합니다

Uuid
- uuid는 Anony 가 이용자를 식별하는 아이디겸 비밀번호로 사용됩니다.
- 사이트 접속시 지동으로 랜덤한 uuid값이 부여되며 해당 값은 쿠키로 저장되기 때문에 사이트 재접속시에도 처음 발급받은 uuid 가 유지됩니다
- 쿠키로 관리되기 때문에 쉽게 유실될 수도 있음에 유의하세요. uuid 값을 따로 보관해 두면 브라우져의 쿠키가 초기화된 경우에도 내 글에 대한 수정/삭제 권한을 유지해 갈 수 있습니다
- 기억하기 쉽도록 의미있는 값을 uuid로 사용할 경우 다른 사람이 쉽게 찾아낼 수 있는 위험이 있으므로 uuid 입력란에 새로고침 버튼을 이용해 자동 생성된 특정 문자열을 사용할 것을 권장합니다.
- 어떠한 이유에서든 uuid 값이 유출될 경우에는 본인이 작성했던 글에 대한 수정/삭제 권한이 uuid를 획득한 이에게 공유될 수 있습니다
- 허용가능 문자: A-Z, a-z, 0-9, _-
- uuid 자동생성 버튼을 사용할 때 uuid 가 다른 이와 충돌될 확률은 xxx 입니다

Markdown
- 마크다운 사용 여부

Private
- 체크시 비공개 글이 되며 본인(uuid가 일치할 경우만)만 확인이 가능합니다

Comment
- 댓글 피드백을 허용할 지 여부

Content
- 글 내용을 입력합니다
- html 태그를 허용합니다
- 마크다운도 사용 가능합니다
- 이미지 업로드는 지원되지 않지만 img태그 혹은 마크다운을 이용해 외부링크 이미지를 삽입할 수는 있습니다


#### Note
1. Anony는 아이디/비밀번호를 통한 개인인증이 없지만 작성한 글에 대한 수정/삭제 권한을 제공하기 위해 글 작성시 자동으로 입력되는 uuid 식별자를 이용합니다. 입력된 uuid 는 아이디와 비밀번호의 역할을 하며 브라우져의 쿠키로 저장됩니다. 
1. 이것은 uuid 를 개인이 따로 보관하지 않으면 내 글에 대한 수정/삭제 권한을 유지할 수 없음을 의미합니다
1. Anony는 uuid 를 통해 글작성자를 식별할 수는 있지만 "내가 쓴 글" 과 같은 다른 개인화 서비스를 제공하지 않습니다
1. 이 것은 개인이 작성한 글의 channel 정보(또는 글주소)를 따로 보관(혹은 기억) 해두지 않으면 해당 글에 다시 접근할 수 없음을 의미합니다
1. 이 것은 사용자에게 적잖은 불편을 줄 수 있지만 혹시 모를 uuid 유출 상황에서 개인의 피해를 최소화할 수 있는 안전장치가 됩니다.
1. Anony는 관리자의 개인적인 토이프로젝트로 시작되었으며 갑작스런 천재지변 발생시에는 사전 고지 없이 서비스가 중단될 수 있습니다. (개인정보를 수집하지 않으므로 고지 불가)
1. 민감한 개인 정보를 담을 만큼 이 사이트의 보안을 신뢰하지는 마십시오.
    
    
<br>

#### Technical stack
- FrontEnd: ES6, React, redux, scss, webpack4, babel
- BackEnd: express, mongoose
- DB: MongoDB

<br>

### 폴더구조
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

### RESTful API
method | path | payload | desc
--- | --- | --- | ---
GET | /api/comments/get/:key | - | `key` 에 해당하는 글에 등록된 댓글조회
GET | /api/posts/history/:key | - | `key` 에 해당하는 글 수정이력 조회
GET | /api/posts/auth/:key/:uuid | - | `key` 에 해당하는 글 수정/삭제 권한 조회
GET | /api/comments/auth/:key/:uuid | - | `key` 에 해당하는 댓글 수정/삭제 권한 조회
GET | /api/posts/delete/:key/:uuid | - | `key` 에 해당하는 글 delete 처리
GET | /api/posts/remove/:key/:uuid | - | `key` 에 해당하는 글 remove 처리
GET | /api/posts/restore/:key/:uuid | - | `key` 에 해당하는 글 restore 처리
GET | /api/comments/restore/:key/:uuid | - | `key` 에 해당하는 댓글 restore 처리
GET | /api/comments/delete/:key/:uuid | - | `key` 에 해당하는 댓글 delete 처리
GET | /api/comments/remove/:key/:uuid | - | `key` 에 해당하는 댓글 remove 처리
POST | /api/posts/add | postObj | 글등록
POST | /api/comments/add | commentObj | 댓글등록
POST | /api/posts/get/:context/:idx/:cnt | word, uuid | `context` 채널 `word` 검색결과에서 `idx` 번째부터 `cnt` 개수의 post 목록을 조회
POST | /api/posts/get/:key | uuid | `key` 에 해당하는 글을 조회
POST | /api/posts/view/:key | uuid | `key` 해당하는 글 조회수 1증가
POST | /api/posts/edit/:uuid | postObj | post수정 처리
POST | /api/comments/edit/:uuid | commentObj | 댓글 수정 처리
POST | /api/posts/likePost/:key | uuid | `key` 해당하는 글 좋아요 처리
POST | /api/posts/cancelLike/:key | uuid | `key` 해당하는 글 좋아요 취소 처리

<br>

### 리액트 컴포넌트간 참조관계
<img src="https://anony-react.appspot.com/docs/dependency.svg" />

<br>

### 웹팩 번들파일 size 분석
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

<img src="https://anony-react.appspot.com/docs/size_thumb.png" />

[자세히 보기](https://anony-react.appspot.com/docs/size_prod.html)
