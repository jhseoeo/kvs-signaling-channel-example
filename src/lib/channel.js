const kinesis = require("../util/kinesis");
const { promisify } = require("util");
const redisClient = require("../util/redis_channel");
const { channel } = require("diagnostics_channel");

const async_get = promisify(redisClient.get).bind(redisClient);

/**
 * create a channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, createdChannelData?: object}} result of creating channel
 */
async function createChannel(id) {
    const channelData = await async_get(id);

    if (channelData !== "e") {
        try {
            const channelData = await kinesis.createChannel(id, "MASTER");
            redisClient.set(id, "e");
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
                message: "internal server error",
            };
        }
    } else {
        return {
            statusCode: 400,
            ok: false,
            message: "a channel is already exists",
        };
    }
}

/**
 * check if a channel is created. if then, returns a channel info.
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, channelData?: object}} result of existing channel
 */
async function searchChannel(id) {
    const channelData = await async_get(id);

    if (channelData !== "e") {
        return {
            statusCode: 200,
            ok: true,
            message: "a channel is not created",
        };
    } else {
        return {
            statusCode: 200,
            ok: true,
            message: "a connection is created",
            channelData: await kinesis.getChannelInfo(id, "VIEWER", "client"),
        };
    }
}

/**
 * delete existing channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string}} result of deleting channel
 */
async function deleteChannel(id) {
    const channelData = await async_get(id);
    console.log(channelData);

    if (channelData === "e") {
        redisClient.del(id);
        kinesis.deleteChannel(id);
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
