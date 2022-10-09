const bcrypt = require("bcrypt");
const jwt = require("../util/jwt");
const redisClient = require("../util/redis");
const { User } = require("../models");

/**
 * Register Account
 * @param {string} userid - User id of the account
 * @param {string} password - Password of the account
 * @param {string} nickname - Nickname of the account
 * @return {{statusCode: int, ok: boolean, message: string}} Result of registration
 */
module.exports.register = async (userid, password, nickname) => {
    try {
        // check if the user id is already exists
        const idExist = await User.findOne({ where: { userid } });
        if (idExist) {
            return {
                statusCode: 400,
                ok: false,
                message: "user id is already exists",
            };
        } else {
            // create row in user account table
            const hash = await bcrypt.hash(password, 12);
            await Users.create({
                userid,
                password: hash,
                nickname,
            });
            return res.status(200).send({
                ok: true,
                message: "the account is successfully created",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            ok: false,
            message: "internal server error",
        });
    }
};

/**
 * Login Account
 * @param {string} userid - User id to login
 * @param {string} password - Password to login
 * @return {{statusCode: int, ok: boolean, message: string, data?: {accessToken: string, refreshToken: string}}} Result of login
 */
module.exports.login = async (userid, password) => {
    let success = null;
    try {
        const idExist = await User.findOne({
            where: {
                userid,
            },
        });
        success = await bcrypt.compare(password, idExist.password);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 401,
            ok: false,
            message: "login failed",
        };
    }

    if (success) {
        // access token과 refresh token 발급
        const accessToken = jwt.sign(userid);
        const refreshToken = jwt.refresh();

        // refresh token을 redis에 저장
        redisClient.set(userid, refreshToken);

        return {
            statusCode: 200,
            ok: true,
            message: "login success",
            data: {
                accessToken,
                refreshToken,
            },
        };
    } else {
        return {
            statusCode: 401,
            ok: false,
            message: "password is incorrect",
        };
    }
};
