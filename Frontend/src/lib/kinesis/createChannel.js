/**
 * Create WebRTC Signaling Channel and get info about the channel
 * @returns {Promise<Response>} - Info about Channel
 */
async function createSignalingChannel(channelName) {
    const channel = await fetch(process.env.REACT_APP_PROXY_HOST + "/channel/" + channelName, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());

    return channel;
}

module.exports = createSignalingChannel;
