import {createStore} from 'redux';
import {reducer} from "./redux/reducer";
import { ADD, DELETE, VIEW, addMultiPost } from "./redux/action";

export let tp = {};

console.log("tp.js called..");

tp.init = function(){
    tp.state = {mode : "list", posts : []};
    tp.view = {};
    tp.api = {};
    //tp.loadState();
};

tp.init();
window.tp = tp;



tp.api.addPost = function(post){
  fetch("/api/posts", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify(post, null, 2),
  }).then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  }).then((data) => {
    console.log("addPost success : " + data);
  }).catch((e) => {
    console.log(e);
  });
}


tp.api.loadPosts = function () {
  fetch("/api/posts", {
    method: "GET",
  }).then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  }).then((res) => {
    console.log("loadPosts success : " + JSON.stringify(res, null, 2));
    // redux 스토어 생성
    tp.store = createStore(reducer, {mode: "list", posts: res.posts});

    // redux 로부터 상태 얻어오기
    tp.state = tp.store.getState();

    // App.js 상태를 서버에서 로드한 데이터로 초기화
    tp.view.App.setState({ mode: "list", posts: tp.state.posts });

    // App.js 컴포넌트가 스토어를 구독하도록 설정
    tp.store.subscribe(() => {
      tp.state = tp.store.getState();
      tp.view.App.setState(tp.state);
    });    
  }).catch((e) => {
    console.log(e);
  });
}


tp.api.getPosts = function (idx, cnt) {
  fetch("/api/posts/" + idx + "/" + cnt, {
    method: "GET",
  }).then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  }).then((res) => {
    console.log("getPosts success : " + JSON.stringify(res, null, 2));

    if(tp.store){
      tp.dispatch(addMultiPost(res.posts));
    }else{

      // store생성
      tp.store = createStore(reducer, {mode: "list", posts: res.posts});

      // redux 로부터 상태 얻어와서 초기화
      tp.state = tp.store.getState();

      // App.js 상태를 서버에서 로드한 데이터로 초기화
      tp.view.App.setState({ mode: "list", posts: tp.state.posts });
  
      // App.js 컴포넌트가 스토어를 구독하도록 설정
      tp.store.subscribe(() => {
        tp.state = tp.store.getState();
        tp.view.App.setState(tp.state);
      });      
    }

  }).catch((e) => {
    console.log(e);
  });
}



tp.api.deletePost = function (key) {
  fetch("/api/posts/" + key, {
    method: "DELETE",
  }).then(function (response) {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  }).then((res) => {
    console.log("deletePost success : " + JSON.stringify(res, null, 2));
  
  }).catch((e) => {
    console.log(e);
  });
}



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

//tp.api.loadPosts();
tp.api.getPosts(0,10);