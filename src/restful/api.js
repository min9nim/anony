console.log("api.js start");

import nprogress from "nprogress";

function errHandler(res) {
    nprogress.done(); // nprogress.status 가 null 이면 바로 종료됨
    if (!res.ok) throw Error(res.statusText);
    return res.json();
}

function httpReq(path, opt) {
    opt.hideProgress || nprogress.start();
    delete opt.hideProgress;
    return fetch(path, Object.assign({}, {
        credentials : "omit"
    }, opt));
}

export const api = {};

api.addPost = function (post) {
    return httpReq(
        "/api/posts/add",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
        }
    ).then(errHandler);
}

api.addComment = function (comment) {
    return httpReq(
        "/api/comments/add",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(comment, null, 2),
        }
    ).then(errHandler);
}


api.getPosts = function ({idx, cnt, context, search, hideProgress}) {
    return httpReq(
        "/api/posts/get/" + (context || "root") + "/" + idx + "/" + cnt,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({uuid: tp.user.uuid, search}),
            hideProgress
        }
    ).then(errHandler);
}

api.getComments = function (postKey) {
    return httpReq(
        "/api/comments/get/" + postKey,
        {
            method: "GET",
        }
    ).then(errHandler);
}


api.getPost = function (key) {
    return httpReq(
        "/api/posts/get/" + key,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({uuid: tp.user.uuid}),
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

api.restoreComment = function ({key, uuid}) {
    return httpReq(
        "/api/comments/restore/" + key + "/" + uuid,
        {
            method: "GET"
        }
    ).then(errHandler);
}


api.viewPost = function (key) {
    return httpReq(
        "/api/posts/view/" + key,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({uuid: tp.user.uuid}),
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

api.authComment = function ({key, uuid}) {
    return httpReq(
        "/api/comments/auth/" + key + "/" + uuid,
        {
            method: "GET",
        }
    ).then(errHandler);
}


api.updatePost = function (post) {
    return httpReq(
        "/api/posts/edit/" + tp.user.uuid,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
        }
    ).then(errHandler);
}

api.updateComment = function (comment) {
    return httpReq(
        "/api/comments/edit/" + tp.user.uuid,           // uuid 민감한 정보를 URL정보로 넘기는 것은 보안상 위험할 수 있음
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(comment, null, 2),
        }
    ).then(errHandler);
}

api.getPostHistory = function (key) {
    return httpReq(
        "/api/posts/history/" + key,
        {
            method: "GET",
        }
    ).then(errHandler);
}

api.likePost = function(key){
    return httpReq(
        "/api/posts/likePost/" + key,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({uuid: tp.user.uuid}),            
        }
    ).then(errHandler);
}

api.cancelLike = function(key, uuid){
    return httpReq(
        "/api/posts/cancelLike/" + key,
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({uuid: tp.user.uuid}),
        }
    ).then(errHandler);
}
