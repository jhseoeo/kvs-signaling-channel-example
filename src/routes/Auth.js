const express = require("express");
const { register, login } = require("../lib/auth");
const { notAuthorized } = require("../middlewares/authorized");
const router = express.Router();

/**
 * POST /auth/register - Register Account
 * @param {string} requestBody.id - User id of the account
 * @param {string} requestBody.password - Password of the account
 * @param {string} requestBody.nickname - Nickname of the account
 * @return {{statusCode: int, ok: boolean, message: string}} Result of registration
 */
router.post("/register", notAuthorized, async (req, res) => {
    const { userid, password, nickname } = req.body;
    const status = await register(userid, password, nickname);
    return res.status(status.statusCode).send(status);
});

/**
 * POST /auth/login - Login Account
 * @param {string} requestBody.userid - User id to login
 * @param {string} requestBody.password - Password to login
 * @return {{statusCode: int, ok: boolean, message: string, data?: {accessToken: string, refreshToken: string}}} Result of login
 */
router.post("/login", notAuthorized, async (req, res) => {
    const { userid, password } = req.body;
    const status = await login(userid, password);
    return res.status(status.statusCode).send(status);
});

module.exports = router;
