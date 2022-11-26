const { getCookie } = require("../cookie");

async function deleteRecord(recordid) {
    return await fetch(process.env.REACT_APP_PROXY_HOST + "/clips/" + recordid, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: getCookie("access"),
            refresh: getCookie("refresh"),
        },
        body: null,
    }).then((res) => res.json());
}

module.exports = deleteRecord;
