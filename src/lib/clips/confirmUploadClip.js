const { Clip } = require("../../models");

/**
 *
 * @param {string} s3path
 * @returns
 */
async function confirmUploadClip(s3path) {
    const [userid, recordid, _] = s3path.split("/", 3);

    try {
        await Clip.create({
            userid,
            recordid,
            s3path,
        });

        return {
            statusCode: 200,
            ok: true,
            message: "a clip is successfully registered",
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

module.exports = confirmUploadClip;
