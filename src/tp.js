import {createStore} from 'redux';
import {reducer} from "./reducer";

export let tp = {};

console.log("tp.js called..");

tp.init = function(){
    tp.state = {mode : "list", posts : []};
    tp.view = {};
    tp.loadState();
};

tp.saveState = function(){
    tp.state = tp.store.getState();
    const data = JSON.stringify(tp.state, null, 2);

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


tp.loadState = function(){
    const str = window.localStorage.getItem("state");

    fetch("/load", {
      method: "GET",
    }).then(function(response) {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    }).then((res) => {
      // redux 스토어 생성
      tp.store = createStore(reducer, res.data);

      // redux 로부터 상태 얻어오기
      tp.state = tp.store.getState();

      // App.js 상태를 서버에서 로드한 데이터로 초기화
      tp.view.App.setState({mode : "list", posts : tp.state.posts});

      // App.js 컴포넌트가 스토어를 구독하도록 설정
      tp.store.subscribe(() => {
          tp.view.App.setState(tp.store.getState());
      });
        
    }).catch((e) => {
      console.log(e);
    });

};

tp.dispatch = function(action){
    tp.store.dispatch(action);
    if(action.type !== "VIEW"){
        tp.saveState();
    }
}

tp.init();
window.tp = tp;