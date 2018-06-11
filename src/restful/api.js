console.log("api.js start");

import nprogress from "nprogress";

function errHandler(res) {
    debugger;
    nprogress.done(); // nprogress.status 가 null 이면 바로 종료됨
    if (!res.ok) throw Error(res.statusText);
    return res.json();
}

function httpReq(path, opt) {
    opt.hideProgress || nprogress.start();
    return fetch(path, opt);
}

export const api = {};

api.addPost = function (post, hideProgress) {
    return httpReq(
        "/api/posts",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
            hideProgress
        }
    ).then(errHandler);
}



api.getPosts = function (idx, cnt, hideProgress) {
    return httpReq(
        "/api/posts/" + idx + "/" + cnt,
        {
            method: "GET",
            hideProgress
        }
    ).then(errHandler);
}

api.getPost = function (key, hideProgress) {
    return httpReq(
        "/api/posts/" + key,
        {
            method: "GET",
            hideProgress
        }
    ).then(errHandler);
}


api.deletePost = function ({key, uuid, hideProgress}) {
    return httpReq(
        "/api/posts/" + key + "/" + uuid,
        {
            method: "DELETE",
            hideProgress
        }
    ).then(errHandler);
}
