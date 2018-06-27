console.log("api.js start");

import nprogress from "nprogress";

function errHandler(res) {
    nprogress.done(); // nprogress.status 가 null 이면 바로 종료됨
    if (!res.ok) throw Error(res.statusText);
    return res.json();
}

function httpReq(path, opt) {
    opt.hideProgress || nprogress.start();
    return fetch(path, Object.assign({}, {
        credentials : "omit"
    }, opt));
}

export const api = {};

api.addPost = function (post, hideProgress) {
    return httpReq(
        "/api/posts/add",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
            hideProgress
        }
    ).then(errHandler);
}

api.addComment = function (comment, hideProgress) {
    return httpReq(
        "/api/comments/add",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(comment, null, 2),
            hideProgress
        }
    ).then(errHandler);
}


api.getPosts = function ({idx, cnt, context, hideProgress}) {
    return httpReq(
        "/api/posts/get/" + (context || "root") + "/" + idx + "/" + cnt,
        {
            method: "GET",
            hideProgress
        }
    ).then(errHandler);
}

api.getComments = function (postKey, hideProgress) {
    return httpReq(
        "/api/comments/get/" + postKey,
        {
            method: "GET",
            hideProgress
        }
    ).then(errHandler);
}


api.getPost = function (key) {
    return httpReq(
        "/api/posts/get/" + key,
        {
            method: "GET"
        }
    ).then(errHandler);
}


api.deletePost = function ({key, uuid}) {
    return httpReq(
        "/api/posts/delete/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}


api.removePost = function ({key, uuid}) {
    return httpReq(
        "/api/posts/remove/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}

api.restorePost = function ({key, uuid}) {
    return httpReq(
        "/api/posts/restore/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}

api.viewPost = function (key) {
    return httpReq(
        "/api/posts/view/" + key,
        {
            method: "GET",
        }
    ).then(errHandler);
}



api.deleteComment = function ({key, uuid}) {
    return httpReq(
        "/api/comments/delete/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}

api.removeComment = function ({key, uuid}) {
    return httpReq(
        "/api/comments/remove/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}


api.authPost = function ({key, uuid}) {
    return httpReq(
        "/api/posts/auth/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}


api.updatePost = function (post, hideProgress) {
    return httpReq(
        "/api/posts/edit/" + tp.user.uuid,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
            hideProgress
        }
    ).then(errHandler);
}

api.getPostHistory = function (key, hideProgress) {
    return httpReq(
        "/api/posts/history/" + key,
        {
            method: "GET",
            hideProgress
        }
    ).then(errHandler);
}

api.likePost = function(key, uuid){
    return httpReq(
        "/api/posts/likePost/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}

api.cancelLike = function(key, uuid){
    return httpReq(
        "/api/posts/cancelLike/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}
