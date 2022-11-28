const S3 = require("../../util/s3");
const { Clip } = require("../../models");

async function searchClipByTag(userid, tag) {
    try {
        const clips = await Clip.findAll({
            where: {
                userid,
                tag,
            },
        });

        if (!clips)
            return {
                statusCode: 404,
                ok: false,
                message: "no record found",
            };

        const videoLinksPromise = clips.map((val) => {
            return S3.getDownloadThumbnailUrl(val.s3path);
        });
        const videoLinks = await Promise.all(videoLinksPromise);
        const videoDatas = videoLinks.map((val, idx) => {
            return {
                clipid: clips[idx].clipid,
                recordid: clips[idx].recordid,
                recorded_at: clips[idx].createdAt,
                tag: clips[idx].tag,
                link: val,
            };
        });

        return {
            statusCode: 200,
            ok: true,
            message: "video clips lists",
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

module.exports = searchClipByTag;
