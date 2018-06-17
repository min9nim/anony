import shortid from "shortid";

const action = {};
export default action;


const at = action.type = {
  ADDPOST : "ADDPOST",
  ADDPOSTS : "ADDPOSTS",
  DELETEPOST : "DELETEPOST",
  UPDATEPOST : "UPDATEPOST",
  ADDCOMMENT : "ADDCOMMENT",
  ADDCOMMENTS : "ADDCOMMENTS",
  DELETECOMMENT : "DELETECOMMENT",
  UPDATECOMMENT : "UPDATECOMMENT",
  SCROLLEND : "SCROLLEND",
  SETPOSTHISTORY : "SETPOSTHISTORY"
}

action.addPost = function({key, title, writer, content, date, isPrivate, hasComment}) {
  return {
    type:  at.ADDPOST,
    post: {
      key: key || shortid.generate(),
      title,
      writer,
      content,
      date,
      isPrivate,
      hasComment
    }
  }
}

action.scrollEnd = function(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type:  at.SCROLLEND,
    posts
  }
}

action.addPosts = function(posts) {
  return {
    type:  at.ADDPOSTS,
    posts
  }
}

action.deletePost = function(key) {
  return {type:  at.DELETEPOST, key}
}

action.deleteComment = function(key) {
  return {type:  at.DELETECOMMENT, key}
}

action.updatePost = function(post) {
  return {
    type:  at.UPDATEPOST,
    post
  }
}


action.addComment = function(comment) {
  return {
    type:  at.ADDCOMMENT,
    comment
  }
}


action.addComments = function(comments) {
  return {
    type:  at.ADDCOMMENTS,
    comments
  }
}



action.setPostHistory = function(phist) {
  return {
    type:  at.SETPOSTHISTORY,
    phist
  }
}