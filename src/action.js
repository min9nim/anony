import shortid from "shortid";

export const ADD = "ADD";
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

export function deletePost(key) {
  return {type: DELETE, key: key}
}

export function viewMode(mode) {
  return {type: VIEW, mode: mode};
}
