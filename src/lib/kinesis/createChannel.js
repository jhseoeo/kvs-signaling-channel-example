const { getCookie } = require("../cookie");

/**
 * Create WebRTC Signaling Channel and get info about the channel
 * @param {string} channelName - Name of the signaling channel
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

    if (channel.ok) alert("채널 생성 성공!");
    else alert("채널 생성 실패!");
    return channel;
}

module.exports = createSignalingChannel;
