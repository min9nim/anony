import shortid from 'shortid'

const action = {}
export default action

const at = (action.type = {
  ADDPOST: 'ADDPOST',
  ADDPOSTS: 'ADDPOSTS',
  INITPOSTS: 'INITPOSTS',
  SETPOSTS: 'SETPOSTS',
  DELETEPOST: 'DELETEPOST',
  UPDATEPOST: 'UPDATEPOST',
  REMOVEPOST: 'REMOVEPOST',
  RESTOREPOST: 'RESTOREPOST',
  VIEWPOST: 'VIEWPOST', // 조회수 +1

  ADDCOMMENT: 'ADDCOMMENT',
  ADDCOMMENTS: 'ADDCOMMENTS',
  DELETECOMMENT: 'DELETECOMMENT',
  UPDATECOMMENT: 'UPDATECOMMENT',
  REMOVECOMMENT: 'REMOVECOMMENT',
  RESTORECOMMENT: 'RESTORECOMMENT',

  SETSEARCH: 'SETSEARCH',
  SETUUID: 'SETUUID',

  SCROLLEND: 'SCROLLEND',

  MYCHANNELS: 'MYCHANNELS',
})

action.addPost = (post) => {
  post.key = post.key || shortid.generate()
  return {
    type: at.ADDPOST,
    post,
  }
}

action.initPosts = () => {
  return {
    type: at.INITPOSTS,
  }
}

action.setPosts = (posts) => {
  return {
    type: at.SETPOSTS,
    posts,
  }
}

action.scrollEnd = (posts) => {
  //posts = posts.map(o => {o.key = shortid.generate(); return o;});
  return {
    type: at.SCROLLEND,
    posts,
  }
}

action.addPosts = (posts) => {
  return {
    type: at.ADDPOSTS,
    posts,
  }
}

action.deletePost = (key) => {
  return { type: at.DELETEPOST, key }
}

action.removePost = (fn) => {
  return { type: at.REMOVEPOST, predi: fn }
}

action.viewPost = (key) => {
  return { type: at.VIEWPOST, key }
}

action.restorePost = (key) => {
  return { type: at.RESTOREPOST, key }
}

action.updatePost = (post) => {
  return {
    type: at.UPDATEPOST,
    post,
  }
}

action.updateComment = (comment) => {
  return {
    type: at.UPDATECOMMENT,
    comment,
  }
}

action.deleteComment = (key) => {
  return { type: at.DELETECOMMENT, key }
}

action.removeComment = (key) => {
  return { type: at.REMOVECOMMENT, key }
}

action.addComment = (comment) => {
  return {
    type: at.ADDCOMMENT,
    comment,
  }
}

action.addComments = (comments) => {
  return {
    type: at.ADDCOMMENTS,
    comments,
  }
}

action.restoreComment = (key) => {
  return { type: at.RESTORECOMMENT, key }
}

action.setSearch = (word) => {
  return {
    type: at.SETSEARCH,
    search: word,
  }
}

action.setUuid = (uuid) => {
  return {
    type: at.SETUUID,
    uuid,
  }
}

action.myChannels = (channels) => {
  return {
    type: at.MYCHANNELS,
    channels,
  }
}
