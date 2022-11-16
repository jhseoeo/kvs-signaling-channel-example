const { getCookie } = require("../cookie");

/**
 * Delete WebRTC Signaling Channel
 */
async function uploadClip(file) {
    return new Promise(async (resolve, reject) => {
        const { url } = await fetch(process.env.REACT_APP_PROXY_HOST + "/clips", {
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
        const form = new FormData();
        form.append("uploadedFile", file, file.name);

        const request = new XMLHttpRequest();
        request.open("PUT", url);

        request.addEventListener("load", () => {
            // fetch(process.env.REACT_APP_PROXY_HOST + "/clips");
        });

        request.send(form);
    });
}

module.exports = uploadClip;
