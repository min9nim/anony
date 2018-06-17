import shortid from "shortid";

// 디비 CRUD까지 필요한 action
export const ADD = "ADD";
export const DELETE = "DELETE";
export const UPDATE = "UPDATE";

// store 상태만 변경하면 되는 action
export const SCROLLEND = "SCROLLEND";
export const VIEW = "VIEW";


const action = {};
export default action;

action.addPost = function({key, title, writer, content, date}) {
  return {
    type: ADD,
    post: {
      key: key || shortid.generate(),
      title,
      writer,
      content,
      date
    }
  }
}

action.scrollEnd = function(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: SCROLLEND,
    posts
  }
}

action.deletePost = function(key) {
  return {type: DELETE, key}
}

action.updatePost = function({key, title, writer, content, date}) {
  return {
    type: UPDATE,
    post: {
      key,
      title,
      writer,
      content,
      date
    }
  }
}
