console.log("api.js called..");


export const api = {};


api.addPost = function (post) {
    return fetch(
        "/api/posts",
        {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(post, null, 2),
        }
    ).then(function (res) {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
    });
}



api.getPosts = function (idx, cnt) {
    return fetch(
        "/api/posts/" + idx + "/" + cnt,
        {
            method: "GET"
        }
    ).then(function (res) {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
    });
}



api.deletePost = function (key) {
    return fetch(
        "/api/posts/" + key,
        {
            method: "DELETE",
        }
    ).then(function (res) {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
    });
}
