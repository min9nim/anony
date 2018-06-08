import shortid from "shortid";

// 디비 CRUD까지 필요한 action
export const ADD = "ADD";
export const DELETE = "DELETE";
export const VIEWKEY = "VIEWKEY";

// store 상태만 변경하면 되는 action
export const SCROLLEND = "SCROLLEND";
export const VIEW = "VIEW";


export function addPost({title, writer, content, date}) {
  return {
    type: ADD,
    post: {
      key: shortid.generate(),
      title,
      writer,
      content,
      date
    }
  }
}

export function scrollEnd(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: SCROLLEND,
    posts
  }
}

export function deletePost(key) {
  return {type: DELETE, key}
}

export function viewMode(view) {
  return {type: VIEW, view};
}
