//console.log("api.js start");

import nprogress from 'nprogress'

async function httpReq(path, opt = {}) {
  try {
    if (!opt.hideProgress) {
      nprogress.start()
    }
    delete opt.hideProgress
    const result = await fetch(path, {
      credentials: 'omit',
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      ...opt,
      body: typeof opt.body === 'string' ? opt.body : JSON.stringify(opt.body),
    })
    nprogress.done() // nprogress.status 가 null 이면 바로 종료됨
    if (!result.ok) {
      throw new Error(res.statusText)
    }
    const res = await result.json()
    if (res.status !== 'Success') {
      // 정상적인 경우가 아니라 간주하고 예외 발생시킴
      throw new Error(res.message)
    }
    return res
  } catch (e) {
    console.error(e)
    ctx.alert({
      message: e.message,
      style: 'danger',
      width: '200px',
    })
  }
}

export function addPost(post) {
  return httpReq('/api/posts/add', {
    method: 'POST',
    body: post,
  })
}

export function addComment(comment) {
  return httpReq('/api/comments/add', {
    method: 'POST',
    body: comment,
  })
}

export function getPosts({
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
      body: { uuid: ctx.user.uuid, search },
      signal,
      hideProgress,
    },
  )
}

export function getComments(postKey) {
  return httpReq('/api/comments/get/' + postKey)
}

export function getPost(key) {
  return httpReq('/api/posts/get/' + key, {
    method: 'POST',
    body: { uuid: ctx.user.uuid },
  })
}

export function deletePost({ key, uuid }) {
  return httpReq('/api/posts/delete/' + key + '/' + uuid)
}

export function removePost({ key, uuid }) {
  return httpReq('/api/posts/remove/' + key + '/' + uuid)
}

export function restorePost({ key, uuid }) {
  return httpReq('/api/posts/restore/' + key + '/' + uuid)
}

export function restoreComment({ key, uuid }) {
  return httpReq('/api/comments/restore/' + key + '/' + uuid)
}

export function viewPost(key) {
  return httpReq('/api/posts/view/' + key, {
    method: 'POST',
    body: { uuid: ctx.user.uuid },
  })
}

export function deleteComment({ key, uuid }) {
  return httpReq('/api/comments/delete/' + key + '/' + uuid)
}

export function removeComment({ key, uuid }) {
  return httpReq('/api/comments/remove/' + key + '/' + uuid)
}

export function authPost({ key, uuid }) {
  return httpReq('/api/posts/auth/' + key + '/' + uuid)
}

export function authComment({ key, uuid }) {
  return httpReq('/api/comments/auth/' + key + '/' + uuid)
}

export function updatePost(post) {
  return httpReq('/api/posts/edit/' + ctx.user.uuid, {
    method: 'POST',
    body: post,
  })
}

export function updateComment(comment) {
  return httpReq(
    '/api/comments/edit/' + ctx.user.uuid, // uuid 민감한 정보를 URL정보로 넘기는 것은 보안상 위험할 수 있음
    {
      method: 'POST',
      body: comment,
    },
  )
}

export function getPostHistory(key) {
  return httpReq('/api/posts/history/' + key)
}

export function likePost(key) {
  return httpReq('/api/posts/likePost/' + key, {
    method: 'POST',
    body: { uuid: ctx.user.uuid },
  })
}

export function cancelLike(key, uuid) {
  return httpReq('/api/posts/cancelLike/' + key, {
    method: 'POST',
    body: { uuid: ctx.user.uuid },
  })
}

export async function myChannels() {
  const res = await httpReq('/api/posts/myChannels/', {
    method: 'POST',
    body: { uuid: ctx.user.uuid },
  })
  if (res.output.length === 0) {
    res.output = [{ name: 'public', count: 0 }]
  }
  return res
}

export const api = {
  addPost,
  addComment,
  myChannels,
  getPost,
  getPosts,
  deletePost,
  removePost,
  restorePost,
  restoreComment,
  viewPost,
  getComments,
  deleteComment,
  removeComment,
  authPost,
  authComment,
  updatePost,
  updateComment,
  getPostHistory,
  likePost,
  cancelLike,
  myChannels,
}
