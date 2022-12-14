const express = require("express");
const { getCurrentRecordId, getRecords, deleteRecord } = require("../lib/records");
const {
    getClipsList,
    getUploadClipUrl,
    confirmUploadClip,
    getClip,
    setClipTag,
    searchClipByTag,
    deleteClip,
} = require("../lib/clips");
const { Authorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * GET /clips - Get records list
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
 * POST /clips - Upload Clip
 */
router.post("/", Authorized, async (req, res) => {
    try {
        const recordid = await getCurrentRecordId(String(req.id));

        if (typeof recordid === "string" && /^\d+$/.test(recordid)) {
            const response = await getUploadClipUrl(req.id, recordid);
            return res.status(response.statusCode).json(response);
        } else {
            return res.status(400).send({
                statusCode: 400,
                ok: false,
                message: "Not recording now",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * POST /clips/confirm - Confirm upload for clip
 */
router.post("/confirm", Authorized, async (req, res) => {
    const { filename } = req.body;
    try {
        const response = await confirmUploadClip(filename);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * PATCH /clips/tag - Set clips id
 */
router.patch("/tag", Authorized, async (req, res) => {
    const { recordid, clipid, tag } = req.body;
    try {
        const response = await setClipTag(req.id, recordid, clipid, tag);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /clips/tag/:tag - Get clips list searched by tag
 */
router.get("/tag/:tag", Authorized, async (req, res) => {
    const { tag } = req.params;
    try {
        const response = await searchClipByTag(req.id, String(tag));
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /clips/:recordid - Get Clips list in record
 */
router.get("/:recordid", Authorized, async (req, res) => {
    const { recordid } = req.params;
    try {
        const response = await getClipsList(req.id, recordid);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * DELETE /clips/:recordid - Delete record and all relevant clips
 */
router.delete("/:recordid", Authorized, async (req, res) => {
    const { recordid } = req.params;
    try {
        const response = await deleteRecord(req.id, recordid);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * GET /clips/:recordid/:clipid - Get clip video file download link
 */
router.get("/:recordid/:clipid", Authorized, async (req, res) => {
    const { recordid, clipid } = req.params;
    try {
        const response = await getClip(req.id, recordid, clipid);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

/**
 * DELETE /clips/:recordid/:clipid - Delete a clip
 */
router.delete("/:recordid/:clipid", Authorized, async (req, res) => {
    const { recordid, clipid } = req.params;
    try {
        const response = await deleteClip(req.id, recordid, clipid);
        return res.status(response.statusCode).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
});

module.exports = router;
