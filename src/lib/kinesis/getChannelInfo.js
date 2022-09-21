async function getSignalingChannelInfo(channelName, role, clientId = null) {
    clientId = clientId || "";
    const channel = await fetch(
        process.env.REACT_APP_PROXY_HOST + "/kinesis/" + role + "/" + channelName + "/" + clientId,
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
