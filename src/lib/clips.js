const S3 = require("../util/s3");
const { Clip, Record } = require("../models");

/**
 *
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

        const clips = await Clip.findAll({
            where: {
                userid,
                recordid,
            },
        });

        if (clips.length === 0)
            return {
                statusCode: 404,
                ok: false,
                message: "no clips found",
            };

        const videoLinksPromise = clips.map((val) => {
            return S3.getDownloadFileUrl(val.s3path);
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

/**
 *
 * @param {string} s3path
 * @returns
 */
async function confirmUploadClip(s3path) {
    const [userid, recordid, _2] = s3path.split("/", 3);

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

/**
 *
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
    }.webm`;

    try {
        return {
            statusCode: 200,
            ok: true,
            message: "upload url",
            url: await S3.getUploadFileUrl(clipName),
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
            return S3.getDownloadFileUrl(val.s3path);
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

        // add s3 delete clip
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

module.exports = {
    getClipsList,
    getUploadClipUrl,
    confirmUploadClip,
    setClipTag,
    searchClipByTag,
    deleteClip,
};
