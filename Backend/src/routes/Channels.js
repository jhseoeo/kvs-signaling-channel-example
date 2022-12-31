const express = require("express");
const { createChannel, searchChannel, deleteChannel } = require("../lib/channel");
const router = express.Router();

/**
 * POST /channel - Create new channel
 */
router.post("/:channelname", Authorized, async (req, res) => {
    const { channelname } = req.params;
    try {
        const response = await createChannel();
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /channel - Get currently opened channel
 */
router.get("/:channelname/:clientid", Authorized, async (req, res) => {
    const { channelname, clientid } = req.params;
    try {
        const response = await searchChannel();
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * POST /channel - Delete currently opened channel
 */
router.delete("/:channelname", Authorized, async (req, res) => {
    const { channelname } = req.params;
    try {
        const response = await deleteChannel();
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;
