import { createStore } from 'redux';
import shortid from "shortid";

console.log("tp.js call..");


let tp = {};
export default tp;


tp.init = function(){
    console.log("tp.init() called");
    let str = window.localStorage.getItem("state");
    this.state = ["undefined", "", null].includes(str) ? {mode : "list", posts : []} : JSON.parse(str);
};

tp.saveState = function(state){
    this.state = state;
    window.localStorage.setItem("state", JSON.stringify(state));
};

tp.loadState = function(){
    return this.state;
};

tp.init();

const initialState = tp.loadState();


export function addPost({key, title, writer, content}){
    return {
        type: "ADD",
        post : {
            key : shortid.generate(),
            title : title,
            writer: writer,
            content : content,
        }
    }
}


export function deletePost(key){
    return {
        type : "DELETE",
        key : key
    }
}

const reducer = function(state = initialState, action) {
    switch (action.type) {
        case "ADD" :
            return {
                mode : "list",
                posts : [...state.posts, action.post]
            }
        case "DELETE" :
            let idx = state.posts.findIndex(o => o.key === action.key);
            let tmp = [...state.posts];
            tmp.splice(idx,1);
            return {
                mode: "list",
                posts : tmp
            }
        default:
            return state
    }
}


export const store = createStore(reducer);