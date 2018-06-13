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

action.addPost = addPost;
export function addPost({key, title, writer, content, date}) {
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

action.scrollEnd = scrollEnd;
export function scrollEnd(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: SCROLLEND,
    posts
  }
}

action.deletePost = deletePost;
export function deletePost(key) {
  return {type: DELETE, key}
}

action.updatePost = updatePost;
export function updatePost({key, title, writer, content, date}) {
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

/* 리액트라우터를 적용하면서 필요없어짐
export function viewMode(view) {
  return {type: VIEW, view};
}
*/