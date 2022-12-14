const { getCookie } = require("../cookie");

async function getRecordsList() {
    return await fetch(process.env.REACT_APP_PROXY_HOST + "/clips", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json())
    .catch(err => {
        console.log(err)
    });
}

module.exports = getRecordsList;
