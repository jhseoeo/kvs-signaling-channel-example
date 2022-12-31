const { getCookie } = require("../cookie");

/**
 * Get information about signaling channel
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
