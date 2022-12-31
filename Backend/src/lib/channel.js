const kinesis = require("../util/kinesis");

/**
 * create a channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, createdChannelData?: object}} result of creating channel
 */
async function createChannel(channelName) {
    try {
        return {
            statusCode: 200,
            ok: true,
            message: "a channel is successfully created",
            channelData: await kinesis.createChannel(channelName, "MASTER"),
        };
    } catch (e) {
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }
}

/**
 * check if a channel is created. if then, returns a channel info.
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string, channelData?: object}} result of existing channel
 */
async function searchChannel(channelName, clientId) {
    try {
        return {
            statusCode: 200,
            ok: true,
            message: "a connection is created",
            channelData: await kinesis.getChannelInfo(channelName, "VIEWER", clientId),
        };
    } catch (e) {
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }
}

/**
 * delete existing channel
 * @param {string} id - User ID
 * @return {{statusCode: int, ok: boolean, message: string}} result of deleting channel
 */
async function deleteChannel(channelName) {
    try {
        await kinesis.deleteChannel(channelName);
        return {
            statusCode: 200,
            ok: true,
            message: "a channel is successfully deleted",
        };
    } catch (e) {
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }
}

module.exports = {
    createChannel,
    searchChannel,
    deleteChannel,
};
