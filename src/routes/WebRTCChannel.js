const express = require("express");
const kinesis = require("../lib/kinesis");
const { Authorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * POST /webrtcchannel/
 * @param {string} requestBody.channelName - Name of the channel
 * @param {string} requestBody.role - Which role to get channel info
 * @return
 */
router.post("/", Authorized, async (req, res) => {
    const { channelName, role } = req.body;
    try {
        const response = await kinesis.createChannel(channelName, role);
        return res.status(200).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /webrtcchannel/master/:channelName
 * @param {string} routeParameter.channelName
 * @return
 */
router.get("/master/:channelName", Authorized, async (req, res) => {
    const { channelName } = req.params;
    try {
        const response = await kinesis.getChannelInfo(channelName, "MASTER", null);
        return res.status(200).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /webrtcchannel/viewer/:channelName/:clientId
 * @param {string} routeParameter.channelName
 * @return
 */
router.get("/viewer/:channelName/:clientId", Authorized, async (req, res) => {
    const { channelName, clientId } = req.params;
    try {
        const response = await kinesis.getChannelInfo(channelName, "VIEWER", clientId);
        return res.status(200).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * DELETE /webrtcchannel/:channelName
 * @param {string} routeParameter.channelName
 * @return
 */
router.delete("/:channelName", Authorized, async (req, res) => {
    const { channelName } = req.params;
    try {
        await kinesis.deleteChannel(channelName);
        return res.status(200).send({ status: 200, message: "successfully deleted" });
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;
