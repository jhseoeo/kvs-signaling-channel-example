const { getCookie } = require("../cookie");

/**
 * Create WebRTC Signaling Channel and get info about the channel
 * @returns {Promise<Response>} - Info about Channel
 */
async function createSignalingChannel() {
    const channel = await fetch(process.env.REACT_APP_PROXY_HOST + "/channel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
    }).then((res) => res.json());

    return channel;
}

module.exports = createSignalingChannel;
