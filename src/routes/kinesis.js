const express = require("express");
const { kinesis } = require("../util/kinesis");
const router = express.Router();

router.post("/", async (req, res) => {
    const { channelName, role } = req.body;
    console.log(channelName, role);
    const response = await kinesis.createChannel(channelName, role);
    return res.status(200).json(response);
});

router.get("/master/:channelName", async (req, res) => {
    const { channelName } = req.params;
    const response = await kinesis.getChannelInfo(channelName, "MASTER", null);
    return res.status(200).json(response);
});

router.get("/viewer/:channelName/:clientId", async (req, res) => {
    const { channelName, clientId } = req.params;
    const response = await kinesis.getChannelInfo(channelName, "VIEWER", clientId);
    return res.status(200).json(response);
});

router.delete("/:channelName", async (req, res) => {
    const { channelName } = req.params;
    await kinesis.deleteChannel(channelName);
    return res.status(200).json({ status: 200, message: "successfully deleted" });
});

module.exports = router;
