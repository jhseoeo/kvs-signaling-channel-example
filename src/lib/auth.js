const bcrypt = require("bcrypt");
const jwt = require("../util/jwt");
const redisClient = require("../util/redis_auth");
const { User } = require("../models");

/**
 * Register Account
 * @param {string} userid - User id of the account
 * @param {string} password - Password of the account
 * @param {string} nickname - Nickname of the account
 * @return {{statusCode: int, ok: boolean, message: string}} Result of registration
 */
async function register(userid, password, nickname) {
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
            await User.create({
                userid,
                password: hash,
                nickname,
            });
            return {
                statusCode: 200,
                ok: true,
                message: "account is successfully created",
            };
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }
}

/**
 * Login Account
 * @param {string} userid - User id to login
 * @param {string} password - Password to login
 * @return {{statusCode: int, ok: boolean, message: string, data?: {accessToken: string, refreshToken: string}}} Result of login
 */
async function login(userid, password) {
    let success = null;
    let idExist;
    try {
        idExist = await User.findOne({
            where: {
                userid,
            },
        });

        if (idExist) success = await bcrypt.compare(password, idExist.password);
        else
            return {
                statusCode: 401,
                ok: false,
                message: "id is not exists",
            };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            ok: false,
            message: e,
        };
    }

    if (success) {
        // access token과 refresh token 발급
        const { id } = idExist;
        const accessToken = jwt.sign(id);
        const refreshToken = jwt.refresh();

        // refresh token을 redis에 저장
        redisClient.set(id, refreshToken);

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
}

module.exports = {
    register,
    login,
};
