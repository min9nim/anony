import {createStore} from 'redux';
import {reducer} from "./reducer";

export let tp = {};

tp.init = function(){
    tp.loadState();
    tp.store = createStore(reducer, tp.state);
};

tp.saveState = function(){
    tp.state = tp.store.getState();

    window.localStorage.setItem("state", JSON.stringify(tp.state));

};

tp.loadState = function(){
    const str = window.localStorage.getItem("state");
    tp.state = ["undefined", "", null].includes(str) ?
                { mode: "list", posts: [] } :
                JSON.parse(str) ;
};

tp.dispatch = function(action){
    tp.store.dispatch(action);
    tp.saveState();
}

tp.init();
window.tp = tp;
console.log("### aaaaaa");