const express = require("express");
const { createChannel, searchChannel, deleteChannel } = require("../lib/channel");
const router = express.Router();

/**
 * POST /channel - Create new channel
 */
router.post("/:channelname", async (req, res) => {
    const { channelname } = req.params;
    try {
        const response = await createChannel(channelname);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /channel - Get currently opened channel
 */
router.get("/master/:channelname/:clientid", async (req, res) => {
    const { channelname } = req.params;
    try {
        const response = await searchChannel("MASTER", channelname);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /channel - Get currently opened channel
 */
router.get("/viewer/:channelname/:clientid", async (req, res) => {
    const { channelname, clientid } = req.params;
    try {
        const response = await searchChannel("VIEWER", channelname, clientid);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * DELETE /channel - Delete currently opened channel
 */
router.delete("/:channelname", async (req, res) => {
    const { channelname } = req.params;
    try {
        const response = await deleteChannel(channelname);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;
