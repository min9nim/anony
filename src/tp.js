console.log("tp.js start");

import action from "./redux/action";
import {api} from "./restful/api";
import shortid from "shortid";
import $m from "./util";
import nprogress from "nprogress";

const PAGEROWS = 10;

export let tp = {
  view : {},          // 전역에서 관리될 필요가 있는 리액트 뷰들
  action,             // store 상태업데이트시 전달될 action
  store: undefined,   // List 컴포넌트가 호출될 때 store 가 초기화된다.
  user: undefined,    // 로컬스토리지에 저장된 사용자 정보
  api,                // RESTful API
  nprogress,          // 서버통신시 진행표시
  temp : undefined,   // 컴포넌트간 정보 전달을 위한 임시 저장 공간
  $m                  // 기본 유틸함수
};




tp.setUser = function(obj){
  const initValue = {
    uuid: shortid.generate(),
    writer: ""
  }

  let user;
  if(typeof obj === "string"){
    user = Object.assign(tp.user, {uuid: obj});
  }else{
    user = obj ? Object.assign(tp.user, obj) : initValue ;
  }
  localStorage.setItem("user", JSON.stringify(user));

  return user;
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
      tp.store.dispatch(tp.action.scrollEnd(res.posts));
      if(res.posts.length < PAGEROWS){
        console.log("Scroll has touched bottom")
        tp.isScrollLast = true;
        return;
      }
    })
  }
};


tp.init = function(){
  tp.user = JSON.parse(localStorage.getItem("user")) || tp.setUser();
}

tp.init();
window.tp = tp;   // 개발 중 디버깅을 위해 전역공간으로 노출