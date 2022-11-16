const { getCookie } = require("../cookie");

/**
 * Delete WebRTC Signaling Channel
 * @returns {Promise<Response>} - Request status of deleting channel
 */
async function deleteSignalingChannel() {
    // var blob = new Blob([]);

    // navigator.sendBeacon();

    return await fetch(process.env.REACT_APP_PROXY_HOST + "/channel", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
        keepalive: true,
    }).then((res) => res.json());
}

module.exports = deleteSignalingChannel;
