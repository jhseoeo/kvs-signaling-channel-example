/**
 * Delete WebRTC Signaling Channel
 * @returns {Promise<Response>} - Request status of deleting channel
 */
async function deleteSignalingChannel(channelName) {
    // var blob = new Blob([]);

    // navigator.sendBeacon();

    return await fetch(process.env.REACT_APP_PROXY_HOST + "/channel/" + channelName, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: null,
        keepalive: true,
    }).then((res) => res.json());
}

module.exports = deleteSignalingChannel;
