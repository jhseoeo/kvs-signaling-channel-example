const kinesis = require("../util/kinesis");
const { promisify } = require("util");
const redisClient = require("../util/redis_channel");
const { startRecord, stopRecord } = require("./records");

const async_get = promisify(redisClient.get).bind(redisClient);

/**
 * create a channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, createdChannelData?: object}} result of creating channel
 */
async function createChannel(id) {
    const recordid = await async_get(id);
    if (typeof recordid === "string" && /^\d+$/.test(recordid)) {
        return {
            statusCode: 400,
            ok: false,
            message: "a channel is already exists",
        };
    } else {
        try {
            const channelData = await kinesis.createChannel(id, "MASTER");
            const recordid = await startRecord(id);
            redisClient.set(id, recordid);
            return {
                statusCode: 200,
                ok: true,
                message: "a channel is successfully created",
                channelData,
            };
        } catch (e) {
            return {
                statusCode: 500,
                ok: false,
                message: `internal server error - ${e}`,
            };
        }
    }
}

/**
 * check if a channel is created. if then, returns a channel info.
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, channelData?: object}} result of existing channel
 */
async function searchChannel(id) {
    const recordid = await async_get(id);

    if (typeof recordid === "string" && /^\d+$/.test(recordid)) {
        return {
            statusCode: 200,
            ok: true,
            message: "a connection is created",
            channelData: await kinesis.getChannelInfo(id, "VIEWER", "client"),
        };
    } else {
        return {
            statusCode: 200,
            ok: true,
            message: "a channel is not created",
        };
    }
}

/**
 * delete existing channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string}} result of deleting channel
 */
async function deleteChannel(id) {
    const recordid = await async_get(id);

    if (typeof recordid === "string" && /^\d+$/.test(recordid)) {
        redisClient.del(id);
        kinesis.deleteChannel(id);
        stopRecord(recordid);
        return {
            statusCode: 200,
            ok: true,
            message: "a channel is successfully deleted",
        };
    } else {
        return {
            statusCode: 400,
            ok: false,
            message: "a channel is not exists",
        };
    }
}

module.exports = {
    createChannel,
    searchChannel,
    deleteChannel,
};
