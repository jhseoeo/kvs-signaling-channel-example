const S3 = require("../../util/s3");
const { Clip, Record } = require("../../models");

/**
 * @param {string} recordid
 * @returns
 */
async function getClipsList(userid, recordid) {
    try {
        const record = await Record.findOne({
            where: {
                userid,
                recordid,
            },
        });

        if (!record)
            return {
                statusCode: 404,
                ok: false,
                message: "no record found",
            };

        const clips = await Clip.findAll({
            where: {
                userid,
                recordid,
            },
        });

        const videoLinksPromise = clips.map((val) => {
            return S3.getDownloadThumbnailUrl(val.s3path);
        });
        const videoLinks = await Promise.all(videoLinksPromise);
        const videoDatas = videoLinks.map((val, idx) => {
            return {
                clipid: clips[idx].clipid,
                recorded_at: clips[idx].createdAt,
                tag: clips[idx].tag,
                link: val,
            };
        });

        return {
            statusCode: 200,
            ok: true,
            message: "video clips lists",
            record_start: record.record_start,
            record_stop: record.record_stop,
            videoDatas,
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

module.exports = getClipsList;
