const S3 = require("../../util/s3");
const { Clip } = require("../../models");

async function deleteClip(userid, recordid, clipid) {
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
                message: "no clip found",
            };

        S3.deleteFile(clip.s3path);
        await clip.destroy();

        return {
            statusCode: 200,
            ok: true,
            message: "successfully deleted clip",
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

module.exports = deleteClip;
