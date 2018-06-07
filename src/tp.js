import {createStore} from 'redux';
import {reducer} from "./redux/reducer";
import {ADD, DELETE, VIEW, addMultiPost} from "./redux/action";
import {api} from "./restful/api";

export let tp = {
  state : { mode: "list", posts: [] },
  view : {},
  api : api
};

console.log("tp.js called..");

tp.dispatch = function(action){
    tp.store.dispatch(action);

    // 서버 상태를 변경해야 하는 경우만 아래 switch 문에 등록한다
    switch(action.type){
      case ADD : 
        tp.api.addPost(action.post);
        break;
      case DELETE :
        tp.api.deletePost(action.key);
        break;
      default :
        break;
    }
}

tp.bodyScroll = function () {
  if(tp.isScrollLast) return;
  //현재문서의 높이
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  //현재 스크롤탑의 값
  const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

  //현재 화면 높이 값
  const clientHeight = document.documentElement.clientHeight;

  if ((scrollTop + clientHeight) == scrollHeight) { //스크롤이 마지막일때
    tp.api.getPosts(tp.view.App.state.posts.length, 10).then(res => {
      if(res.posts.length === 0){
        console.log("Scroll has touched bottom")
        tp.isScrollLast = true;
        return;
      }
      tp.dispatch(addMultiPost(res.posts));
    })
  }
};


tp.init = function () {
  tp.api.getPosts(0, 10).then(res => {
    console.log("getPosts success : " + JSON.stringify(res, null, 2));

    // store생성
    tp.store = createStore(reducer, { mode: "list", posts: res.posts });

    // App.js 상태를 서버에서 로드한 데이터로 초기화
    tp.view.App.setState(tp.store.getState());

    // App.js 컴포넌트가 스토어를 구독하도록 설정
    tp.store.subscribe(() => {
      tp.view.App.setState(tp.store.getState());
    });
  })
};

tp.init();
window.tp = tp;
