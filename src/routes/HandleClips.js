const express = require("express");
const {} = require("../lib/clips");
const { Authorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * POST /clips/
 */
router.post("/", Authorized, async (req, res) => {
    try {
        const response = await createChannel(req.id);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});
