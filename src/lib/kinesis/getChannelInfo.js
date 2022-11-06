const { getCookie } = require("../cookie");

/**
 * Get information about signaling channel
 * @param {string} channelName - The name of the channel
 * @param {string} role - The role of the peer => "master" or "viewer"
 * @param {string} clientId - The id of viewer. Master is fixed to null.
 * @returns {Promise<Response>} Info about channel
 */
async function getSignalingChannelInfo() {
    const channel = await fetch(process.env.REACT_APP_PROXY_HOST + "/channel", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json());

    return channel;
}

module.exports = getSignalingChannelInfo;
