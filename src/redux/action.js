import shortid from "shortid";

const action = {};
export default action;


const at = action.type = {
  ADDPOST : "ADDPOST",
  ADDPOSTS : "ADDPOSTS",
  INITPOSTS : "INITPOSTS",
  SETPOSTS : "SETPOSTS",
  DELETEPOST : "DELETEPOST",
  UPDATEPOST : "UPDATEPOST",
  REMOVEPOST : "REMOVEPOST",
  RESTOREPOST : "RESTOREPOST",
  VIEWPOST : "VIEWPOST",      // 조회수 +1


  ADDCOMMENT : "ADDCOMMENT",
  ADDCOMMENTS : "ADDCOMMENTS",
  DELETECOMMENT : "DELETECOMMENT",
  UPDATECOMMENT : "UPDATECOMMENT",
  REMOVECOMMENT : "REMOVECOMMENT",

  SETSEARCH : "SETSEARCH",
  SETUUID : "SETUUID",

  SCROLLEND : "SCROLLEND",
}

action.addPost = function(post) {
  post.key = post.key || shortid.generate();
  return {
    type: at.ADDPOST,
    post
  }
}

action.initPosts = function(){
  return {
    type: at.INITPOSTS,
  }
}

action.setPosts = function(posts){
  return {
    type: at.SETPOSTS,
    posts
  }
}


action.scrollEnd = function(posts) {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: at.SCROLLEND,
    posts
  }
}

action.addPosts = function(posts) {
  return {
    type: at.ADDPOSTS,
    posts
  }
}

action.deletePost = function(key) {
  return {type: at.DELETEPOST, key}
}

action.removePost = function(fn) {
  return {type: at.REMOVEPOST, predi: fn}
}

action.viewPost = function(key) {
  return {type: at.VIEWPOST, key}
}

action.restorePost = function(key) {
  return {type: at.RESTOREPOST, key}
}

action.updatePost = function(post) {
  return {
    type: at.UPDATEPOST,
    post
  }
}

action.updateComment = function(comment) {
  return {
    type: at.UPDATECOMMENT,
    comment
  }
}

action.deleteComment = function(key) {
  return {type: at.DELETECOMMENT, key}
}

action.removeComment = function(key) {
  return {type: at.REMOVECOMMENT, key}
}

action.addComment = function(comment) {
  return {
    type: at.ADDCOMMENT,
    comment
  }
}

action.addComments = function(comments) {
  return {
    type: at.ADDCOMMENTS,
    comments
  }
}

action.setSearch = function(word) {
  return {
    type: at.SETSEARCH,
    search: word
  }
}

action.setUuid = function(uuid) {
  return {
    type: at.SETUUID,
    uuid
  }
}

