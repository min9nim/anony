import shortid from "shortid";

export const ADD = "ADD";
export const ADDMULTI = "ADDMULTI";
export const DELETE = "DELETE";
export const VIEW = "VIEW";

export function addPost({key, title, writer, content, date}) {
  return {
    type: ADD,
    post: {
      key: shortid.generate(),
      title: title,
      writer: writer,
      content: content,
      date: date
    }
  }
}

export function addMultiPost(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: ADDMULTI,
    posts
  }
}

export function deletePost(key) {
  return {type: DELETE, key: key}
}

export function viewMode(mode) {
  return {type: VIEW, mode: mode};
}
