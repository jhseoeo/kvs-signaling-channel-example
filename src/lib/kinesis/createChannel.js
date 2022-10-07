/**
 * Create WebRTC Signaling Channel and get info about the channel
 * @param {string} channelName - Name of the signaling channel
 * @returns {Promise<Response>} - Info about Channel
 */
async function createSignalingChannel(channelName) {
    const channel = await fetch(process.env.REACT_APP_PROXY_HOST + "/webrtcchannel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName, role: "MASTER" }),
    }).then((res) => res.json());

    alert("채널 생성 성공!");
    return channel;
}

module.exports = createSignalingChannel;
