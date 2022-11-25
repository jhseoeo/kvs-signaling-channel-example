const { getCookie } = require("../cookie");

async function getClips(recordid) {
    return await fetch(process.env.REACT_APP_PROXY_HOST + "/clips/" + recordid, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json());
}

module.exports = getClips;
