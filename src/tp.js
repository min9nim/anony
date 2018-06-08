import {createStore} from 'redux';
import {reducer} from "./redux/reducer";
import {ADD, DELETE, scrollEnd} from "./redux/action";
import {api} from "./restful/api";

const PAGEROWS = 10;

export let tp = {
  view : {},
  api : api
};

console.log("tp.js called..");


// application 의 상태변경이 필요할 때 호출
tp.dispatch = function(action){

    // 리덕스 store 상태 업데이트
    tp.store.dispatch(action);

    // 디비에 변경내용을 반영해야 하는 경우만 아래 switch문에 등록한다
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
    tp.api.getPosts(tp.view.App.state.data.posts.length, PAGEROWS).then(res => {
      tp.dispatch(scrollEnd(res.posts));
      if(res.posts.length < PAGEROWS){
        console.log("Scroll has touched bottom")
        tp.isScrollLast = true;
        return;
      }
    })
  }
};


tp.init = function () {
  tp.api.getPosts(0, PAGEROWS).then(res => {
    //console.log("getPosts success : " + JSON.stringify(res, null, 2));

    // store생성
    let copy = JSON.parse(JSON.stringify(tp.view.App.state));
    copy.data.posts = res.posts

    //tp.store = createStore(reducer, { mode: "list", posts: res.posts });
    tp.store = createStore(reducer, copy);

    if(tp.view.App){
      // App.js 상태를 서버에서 로드한 데이터로 초기화
      tp.view.App.setState(tp.store.getState());

      // App.js 컴포넌트가 스토어를 구독하도록 설정
      tp.store.subscribe(() => {
        tp.view.App.setState(tp.store.getState());
      });
    }else{
      throw Error("tp.view.App 가 아직 정의되지 않았습니다");
    }
  })
};

tp.init();
window.tp = tp;
