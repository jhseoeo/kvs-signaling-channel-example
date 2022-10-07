/**
 * Get information about signaling channel
 * @param {string} channelName - The name of the channel
 * @param {string} role - The role of the peer => "master" or "viewer"
 * @param {string} clientId - The id of viewer. Master is fixed to null.
 * @returns {Promise<Response>} Info about channel
 */
async function getSignalingChannelInfo(channelName, role, clientId = null) {
    clientId = clientId || "";
    const channel = await fetch(
        process.env.REACT_APP_PROXY_HOST + "/webrtcchannel/" + role + "/" + channelName + "/" + clientId,
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
