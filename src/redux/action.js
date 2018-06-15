import shortid from "shortid";


export const ADDPOST = "ADDPOST";
export const ADDPOSTS = "ADDPOSTS";

export const DELETEPOST = "DELETEPOST";
export const UPDATEPOST = "UPDATEPOST";

export const ADDCOMMENT = "ADDCOMMENT";
export const ADDCOMMENTS = "ADDCOMMENTS";

export const DELETECOMMENT = "DELETECOMMENT";
export const UPDATECOMMENT = "UPDATECOMMENT";

export const SCROLLEND = "SCROLLEND";

const action = {};
export default action;

action.addPost = function({key, title, writer, content, date}) {
  return {
    type: ADDPOST,
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

action.addPosts = function(posts) {
  return {
    type: ADDPOSTS,
    posts
  }
}

action.deletePost = function(key) {
  return {type: DELETEPOST, key}
}

action.deleteComment = function(key) {
  return {type: DELETECOMMENT, key}
}

action.updatePost = function({key, title, writer, content, date}) {
  return {
    type: UPDATEPOST,
    post: {
      key,
      title,
      writer,
      content,
      date
    }
  }
}


action.addComment = function({key, writer, content, date, uuid, postKey}) {
  return {
    type: ADDCOMMENT,
    comment: {
      key,
      writer,
      content,
      date,
      uuid,
      postKey
    }
  }
}


action.addComments = function(comments) {
  return {
    type: ADDCOMMENTS,
    comments: comments
  }
}