const S3 = require("../util/s3");
const { Clip } = require("../models");

const CLIP_EXPIRES = 14;

/**
 *
 * @param {string} userid
 * @returns
 */
async function getClipsList(userid) {
    const clips = await Clip.fildAll({
        where: {
            userId: userid,
            recorded_at: {
                lt: new Date(Date.now() - 86400000 * CLIP_EXPIRES),
            },
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
        message: "a channel is successfully created",
        videoDatas,
    };
}

async function uploadClip(userid) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const clipName = `${userid}/
        ${year}-
        ${month >= 10 ? month : "0" + month}-
        ${date >= 10 ? date : "0" + date}-
        ${hour}:${minute}:${second}`;

    await Clip.create({
        userid,
        s3path: clipName,
        recorded_at: now,
    });

    return S3.getUploadFileUrl(clipName);
}

module.exports = {
    getClipsList,
    uploadClip,
};
