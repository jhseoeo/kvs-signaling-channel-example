const { Clip } = require("../../models");

async function setClipTag(userid, recordid, clipid, tag) {
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

        clip.tag = tag;
        await clip.save();

        return {
            statusCode: 200,
            ok: true,
            message: "successfully changed clip's tag",
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

module.exports = setClipTag;
