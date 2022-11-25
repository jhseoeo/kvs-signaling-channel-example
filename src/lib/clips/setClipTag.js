const { getCookie } = require("../cookie");

async function setClipTag(recordid, clipid, tag) {
    return await fetch(process.env.REACT_APP_PROXY_HOST + "/clips/tag", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: JSON.stringify({
            recordid,
            clipid,
            tag,
        }),
    }).then((res) => res.json());
}

module.exports = setClipTag;
