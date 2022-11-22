const { getCookie } = require("../cookie");

/**
 * Delete WebRTC Signaling Channel
 */
async function uploadClip(file) {
    return new Promise(async (resolve, reject) => {
        // First, get signed url for upload file
        const { url, filename } = await fetch(process.env.REACT_APP_PROXY_HOST + "/clips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: getCookie("access"),
                refresh: getCookie("refresh"),
            },
            body: null,
        })
            .then((res) => res.json())
            .catch((err) => {
                reject(err);
            });

        // Second, upload file to signeds url
        const form = new FormData();
        form.append("uploadedFile", file, file.name);

        const request = new XMLHttpRequest();
        request.open("PUT", url);

        request.addEventListener("load", () => {
            // Third, invoke confirm call
            if (request.status === 200) {
                fetch(process.env.REACT_APP_PROXY_HOST + "/clips/confirm", {
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
            } else {
            }
        });

        request.send(form);
    });
}

module.exports = uploadClip;
