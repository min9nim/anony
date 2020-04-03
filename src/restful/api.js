//console.log("api.js start");

import nprogress from 'nprogress'

async function httpReq(path, opt) {
  if (!opt.hideProgress) {
    nprogress.start()
  }
  delete opt.hideProgress
  const result = await fetch(path, {
    credentials: 'omit',
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    ...opt,
  })
  nprogress.done() // nprogress.status 가 null 이면 바로 종료됨
  if (!result.ok) {
    throw new Error(res.statusText)
  }
  return result.json()
}

export const api = {}

api.addPost = function(post) {
  return httpReq('/api/posts/add', {
    method: 'POST',
    body: JSON.stringify(post, null, 2),
  })
}

api.addComment = function(comment) {
  return httpReq('/api/comments/add', {
    method: 'POST',
    body: JSON.stringify(comment, null, 2),
  })
}

api.getPosts = function({
  idx = 0,
  cnt = 10,
  context = 'public',
  signal,
  search = '',
  hideProgress,
}) {
  return httpReq(
    //        "/api/posts/get/" + (context || "root") + "/" + idx + "/" + cnt,
    '/api/posts/get/' + context + '/' + idx + '/' + cnt,
    {
      method: 'POST',

      body: JSON.stringify({ uuid: tp.user.uuid, search }),
      signal,
      hideProgress,
    },
  )
}

api.getComments = function(postKey) {
  return httpReq('/api/comments/get/' + postKey, {})
}

api.getPost = function(key) {
  return httpReq('/api/posts/get/' + key, {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  })
}

api.deletePost = function({ key, uuid }) {
  return httpReq('/api/posts/delete/' + key + '/' + uuid, {})
}

api.removePost = function({ key, uuid }) {
  return httpReq('/api/posts/remove/' + key + '/' + uuid, {})
}

api.restorePost = function({ key, uuid }) {
  return httpReq('/api/posts/restore/' + key + '/' + uuid, {})
}

api.restoreComment = function({ key, uuid }) {
  return httpReq('/api/comments/restore/' + key + '/' + uuid, {})
}

api.viewPost = function(key) {
  return httpReq('/api/posts/view/' + key, {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  })
}

api.deleteComment = function({ key, uuid }) {
  return httpReq('/api/comments/delete/' + key + '/' + uuid, {})
}

api.removeComment = function({ key, uuid }) {
  return httpReq('/api/comments/remove/' + key + '/' + uuid, {})
}

api.authPost = function({ key, uuid }) {
  return httpReq('/api/posts/auth/' + key + '/' + uuid, {})
}

api.authComment = function({ key, uuid }) {
  return httpReq('/api/comments/auth/' + key + '/' + uuid, {})
}

api.updatePost = function(post) {
  return httpReq('/api/posts/edit/' + tp.user.uuid, {
    method: 'POST',

    body: JSON.stringify(post, null, 2),
  })
}

api.updateComment = function(comment) {
  return httpReq(
    '/api/comments/edit/' + tp.user.uuid, // uuid 민감한 정보를 URL정보로 넘기는 것은 보안상 위험할 수 있음
    {
      method: 'POST',

      body: JSON.stringify(comment, null, 2),
    },
  )
}

api.getPostHistory = function(key) {
  return httpReq('/api/posts/history/' + key, {})
}

api.likePost = function(key) {
  return httpReq('/api/posts/likePost/' + key, {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  })
}

api.cancelLike = function(key, uuid) {
  return httpReq('/api/posts/cancelLike/' + key, {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  })
}

api.cancelLike = function(key, uuid) {
  return httpReq('/api/posts/cancelLike/' + key, {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  })
}

api.myChannels = function() {
  return httpReq('/api/posts/myChannels/', {
    method: 'POST',

    body: JSON.stringify({ uuid: tp.user.uuid }),
  }).then(res => {
    if (res.output.length === 0) {
      res.output = [{ name: 'public', count: 0 }]
    }
    return res
  })
}
