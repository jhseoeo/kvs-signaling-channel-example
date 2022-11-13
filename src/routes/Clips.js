const express = require("express");
const { getCurrentRecordId, getRecords } = require("../lib/records");
const { getClipsList, getUploadClipUrl } = require("../lib/clips");
const { Authorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * GET /clips
 */
router.get("/", Authorized, async (req, res) => {
    try {
        const response = await getRecords(req.id);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * POST /clips/:recordid
 */
router.post("/", Authorized, async (req, res) => {
    try {
        const recordId = await getCurrentRecordId(String(req.id));

        if (recordId) {
            const response = await getUploadClipUrl(req.id, recordId);
            return res.status(response.statusCode).json(response);
        } else {
            return res.status(400).send({});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /clips/:recordid
 */
router.get("/:recordid", Authorized, async (req, res) => {
    const { recordid } = req.params;
    try {
        getClipsList(recordid);
    } catch (e) {}
});

module.exports = router;
