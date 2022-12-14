const express = require("express");
const { createChannel, searchChannel, deleteChannel } = require("../lib/channel");
const { Authorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * POST /channel - Create new channel
 */
router.post("/", Authorized, async (req, res) => {
    try {
        const response = await createChannel(String(req.id));
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /channel - Get currently opened channel
 */
router.get("/", Authorized, async (req, res) => {
    try {
        const response = await searchChannel(String(req.id));
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * POST /channel - Delete currently opened channel
 */
router.delete("/", Authorized, async (req, res) => {
    try {
        const response = await deleteChannel(String(req.id));
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;
