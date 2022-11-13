const S3 = require("../util/s3");
const { Clip } = require("../models");

/**
 *
 * @param {string} userid
 * @returns
 */
async function getClipsList(recordid) {
    const clips = await Clip.findAll({
        where: {
            recordid: recordid,
        },
        order: [["clipId", "DSEC"]],
    });

    const videoLinksPromise = clips.map((val) => {
        return S3.getDownloadFileUrl(val.s3path);
    });
    const videoLinks = await Promise.all(videoLinksPromise);
    const videoDatas = videoLinks.map((val, idx) => {
        return {
            recorded_at: clips[idx].recorded_at,
            link: val,
        };
    });

    return {
        statusCode: 200,
        ok: true,
        message: "video clips lists",
        videoDatas,
    };
}

async function getUploadClipUrl(userid, recordid) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const clipName = `${userid}/${recordid}/
        ${year}-
        ${month >= 10 ? month : "0" + month}-
        ${date >= 10 ? date : "0" + date}-
        ${hour}:${minute}:${second}`;

    return {
        statusCode: 200,
        ok: true,
        message: "upload url",
        url: await S3.getUploadFileUrl(clipName),
    };
}

async function finishUploadClip() {}

module.exports = {
    getClipsList,
    getUploadClipUrl,
    finishUploadClip,
};
