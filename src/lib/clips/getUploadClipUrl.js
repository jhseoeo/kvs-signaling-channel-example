const S3 = require("../../util/s3");

/**
 * @param {Number} userid
 * @param {Number} recordid
 * @returns
 */
async function getUploadClipUrl(userid, recordid) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const clipName = `${userid}/${recordid}/${year}-${month >= 10 ? month : "0" + month}-${
        date >= 10 ? date : "0" + date
    }-${hour >= 10 ? hour : "0" + hour}:${minute >= 10 ? minute : "0" + minute}:${
        second >= 10 ? second : "0" + second
    }`;

    try {
        return {
            statusCode: 200,
            ok: true,
            message: "upload url",
            video_url: await S3.getUploadFileUrl(clipName),
            thumbnail_url: await S3.getUploadThumbnailUrl(clipName),
            filename: clipName,
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }
}

module.exports = getUploadClipUrl;
