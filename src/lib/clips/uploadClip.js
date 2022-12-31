const { getCookie } = require("../cookie");

async function uploadClip(videofile, thumbnail) {
    return new Promise(async (resolve, reject) => {
        // First, get signed url for upload file
        const { video_url, thumbnail_url, filename } = await fetch(process.env.REACT_APP_PROXY_HOST + "/clips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: getCookie("access"),
                refresh: getCookie("refresh"),
            },
            body: null,
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.ok) reject(res.message);
                else return res;
            })
            .catch((err) => {
                reject(err);
            });

        // Second, upload file to signeds url
        await fetch(video_url, {
            method: "PUT",
            headers: {
                "Content-Type": "video/webm",
            },
            body: videofile,
        })
            .then((res) => {
                if (res.status !== 200) reject(res.message);
                else return res;
            })
            .catch((err) => reject(err));

        await fetch(thumbnail_url, {
            method: "PUT",
            headers: {
                "Content-Type": "image/jpeg",
            },
            body: thumbnail,
        })
            .then((res) => {
                if (res.status !== 200) reject(res.message);
                else return res;
            })
            .catch((err) => reject(err));

        await fetch(process.env.REACT_APP_PROXY_HOST + "/clips/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: getCookie("access"),
                refresh: getCookie("refresh"),
            },
            body: JSON.stringify({ filename }),
        })
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => reject(err));
    });
}

module.exports = uploadClip;
