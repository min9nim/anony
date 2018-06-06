import {createStore} from 'redux';
import {reducer} from "./reducer";
import { ADD, DELETE, VIEW } from "./action";

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


tp.saveState = function(){
    tp.state = tp.store.getState();
    const data = JSON.stringify(tp.state, null, 2);

    // 요부분에서 추가된 post 정보만 서버로 전달을 해야하는 것이고나!!

    fetch("/save", {
      method: "POST",
      headers : new Headers({
        "Content-Type": "application/json"
      }),      
      body: data,
    }).then(function(response) {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    }).then((data) => {
      console.log("fetch success : " + data);
    }).catch((e) => {
      console.log(e);
    });
};


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
    console.log("addPost success : " + JSON.stringify(res, null, 2));
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

tp.api.loadPosts();