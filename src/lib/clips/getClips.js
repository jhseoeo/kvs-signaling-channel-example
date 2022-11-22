const { getCookie } = require("../cookie");

/**
 * Delete WebRTC Signaling Channel
 */
async function getClips() {
    return await fetch(process.env.REACT_APP_PROXY_HOST + "/clips/49", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json());
}

module.exports = getClips;
