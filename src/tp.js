console.log("tp.js start");

import {ADD, DELETE, scrollEnd} from "./redux/action";
import {api} from "./restful/api";
import $m from "./util";
import nprogress from "nprogress";

const PAGEROWS = 10;

export let tp = {
  view : {},
  api,
  nprogress,
  $m
};


// application 의 상태변경이 필요할 때 호출
tp.dispatch = function(action){
/* store 상태관리와 서버상태관리를 한방에 하기 위해 더 좋은 구조는 무엇일따
지금은 스토어 상태와 서버상태가 완전히 동일하지는 않기 때문에 자꾸 고민이 되는 상황인 건데....ㅠㅠ
*/
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
  if(!["/", "/list"].includes(location.pathname)) return;

  //현재문서의 높이
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  //현재 스크롤탑의 값
  const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  //현재 화면 높이 값
  const clientHeight = document.documentElement.clientHeight;

  if ((scrollTop + clientHeight) == scrollHeight) { //스크롤이 마지막일때
    nprogress.start();
    $m("#nprogress .spinner").css("top", "95%");
    tp.api.getPosts(tp.view.App.state.data.posts.length, PAGEROWS, true).then(res => {
      tp.store.dispatch(scrollEnd(res.posts));
      if(res.posts.length < PAGEROWS){
        console.log("Scroll has touched bottom")
        tp.isScrollLast = true;
        return;
      }
    })
  }
};


tp.init = function () {

};

tp.init();
window.tp = tp;
