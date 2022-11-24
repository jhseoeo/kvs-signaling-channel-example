const redisClient = require("../util/redis_channel");
const { Record } = require("../models");
const { promisify } = require("util");

const async_get = promisify(redisClient.get).bind(redisClient);

const MIN_VALID_RECORD_LENGTH = 10 * 60 * 1000;

async function startRecord(userid) {
    const record = await Record.create({
        userid,
        record_start: new Date(),
    });

    return record.dataValues.recordid;
}

async function stopRecord(recordid) {
    const record = await Record.findOne({ where: { recordid } });
    const now = new Date();
    const recordLength = now - record.dataValues.record_start;

    if (recordLength > MIN_VALID_RECORD_LENGTH) {
        record.record_stop = now;
        await record.save();
        return true;
    } else {
        await record.destroy();
        return false;
    }
}

async function getCurrentRecordId(userid) {
    const recordid = await async_get(userid);

    if (typeof recordid === "string" && /^\d+$/.test(recordid)) {
        return recordid;
    } else {
        return false;
    }
}

async function getRecords(userid) {
    if (typeof userid === "number") {
        try {
            const records = await Record.findAll({
                where: {
                    userid,
                },
            });
            return {
                statusCode: 200,
                ok: true,
                message: `Records lists`,
                recordlist: records.map((v) => v.dataValues),
            };
        } catch (e) {
            return {
                statusCode: 500,
                ok: false,
                message: `internal server error - ${e}`,
            };
        }
    } else {
        return {
            statusCode: 403,
            ok: false,
            message: `invalid userid - ${userid}`,
        };
    }
}

async function deleteRecord(userid, recordid) {
    if (typeof userid === "number") {
        try {
            const record = await Record.findOne({ where: { recordid } });
            if (!record) {
                return {
                    statusCode: 404,
                    ok: false,
                    message: `no record exists`,
                };
            } else if (record.userid !== userid) {
                return {
                    statusCode: 403,
                    ok: false,
                    message: `cannot delete other user's record`,
                };
            } else {
                // add s3 delete record folder

                await record.destroy();
                return {
                    statusCode: 200,
                    ok: true,
                    message: `successfully deleted`,
                };
            }
        } catch (e) {
            return {
                statusCode: 500,
                ok: false,
                message: `internal server error - ${e}`,
            };
        }
    } else {
        return {
            statusCode: 500,
            ok: false,
            message: `invalid userid - ${userid}`,
        };
    }
}

module.exports = {
    startRecord,
    stopRecord,
    getCurrentRecordId,
    getRecords,
    deleteRecord,
};
