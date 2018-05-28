import { createStore } from 'redux';
import {reducer} from "./reducer";

export let tp = {};

tp.init = function(){
    let str = window.localStorage.getItem("state");
    this.state = ["undefined", "", null].includes(str) ? {mode : "list", posts : []} : JSON.parse(str);
};

tp.init();

tp.saveState = function(){
    this.state = this.store.getState();
    window.localStorage.setItem("state", JSON.stringify(this.state));
};

tp.loadState = function(){
    return this.state;
};

tp.dispatch = function(action){
  this.store.dispatch(action);
  this.saveState();
}

tp.store = createStore(reducer, tp.loadState());

window.tp = tp;
