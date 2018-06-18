import shortid from "shortid";

const action = {};
export default action;


const at = action.type = {
  ADDPOST : "ADDPOST",
  ADDPOSTS : "ADDPOSTS",
  INITPOSTS : "INITPOSTS",
  DELETEPOST : "DELETEPOST",
  UPDATEPOST : "UPDATEPOST",
  REMOVEPOST : "REMOVEPOST",

  ADDCOMMENT : "ADDCOMMENT",
  ADDCOMMENTS : "ADDCOMMENTS",
  DELETECOMMENT : "DELETECOMMENT",
  UPDATECOMMENT : "UPDATECOMMENT",
  
  SETPOSTHISTORY : "SETPOSTHISTORY",
  
  SCROLLEND : "SCROLLEND",
}

action.addPost = function(post) {
  post.key = post.key || shortid.generate();
  return {
    type:  at.ADDPOST,
    post
  }
}

action.initPosts = function(){
  return {
    type:  at.INITPOSTS,
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

action.removePost = function(key) {
  return {type:  at.REMOVEPOST, key}
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