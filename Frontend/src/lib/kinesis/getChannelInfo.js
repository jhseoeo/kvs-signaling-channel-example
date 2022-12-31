/**
 * Get information about signaling channel
 * @returns {Promise<Response>} Info about channel
 */
async function getSignalingChannelInfo(role, channelName, clientId) {
    const channel = await fetch(
        process.env.REACT_APP_PROXY_HOST + "/channel/" + role + "/" + channelName + "/" + clientId,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: null,
        }
    ).then((res) => res.json());

    return channel;
}

module.exports = getSignalingChannelInfo;
