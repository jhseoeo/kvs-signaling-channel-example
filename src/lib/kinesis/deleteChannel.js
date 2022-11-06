const { getCookie } = require("../cookie");

/**
 * Delete WebRTC Signaling Channel
 * @param {string} channelName - Name of the signaling channel
 */
async function deleteSignalingChannel() {
    await fetch(process.env.REACT_APP_PROXY_HOST + "/channel", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json());

    alert("채널 삭제 성공!");
}

module.exports = deleteSignalingChannel;
