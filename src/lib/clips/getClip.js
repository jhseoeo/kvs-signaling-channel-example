const S3 = require("../../util/s3");
const { Clip } = require("../../models");

async function getClip(userid, recordid, clipid) {
    try {
        const clip = await Clip.findOne({
            where: {
                userid,
                recordid,
                clipid,
            },
        });

        if (!clip)
            return {
                statusCode: 404,
                ok: false,
                message: "no clips found",
            };

        return {
            statusCode: 200,
            ok: true,
            message: "clip's video link",
            link: await S3.getDownloadFileUrl(clip.s3path),
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

module.exports = getClip;
