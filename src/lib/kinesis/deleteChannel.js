async function deleteSignalingChannel(channelName) {
    await fetch(process.env.REACT_APP_PROXY_HOST + "/kinesis/" + channelName, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: null,
    }).then((res) => res.json());

    alert("채널 삭제 성공!");
}

module.exports = deleteSignalingChannel;
