// Code from https://velog.io/@kshired/Express%EC%97%90%EC%84%9C-JWT%EB%A1%9C-%EC%9D%B8%EC%A6%9D%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-Access-Token%EA%B3%BC-Refresh-Token

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const redisClient = require("./redis_auth");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

// access token 발급
function sign(id) {
    const payload = { id };

    return jwt.sign(payload, secret, {
        algorithm: "HS256", // 암호화 알고리즘
        expiresIn: "2h", // 유효기간
    });
}

// access token 검증
function verify(token) {
    let decoded = null;
    try {
        decoded = jwt.verify(token, secret);
        return {
            ok: true,
            id: decoded.id,
        };
    } catch (err) {
        return {
            ok: false,
            message: err.message,
        };
    }
}

// refresh token 발급
function refresh() {
    // refresh token은 payload 없이 발급
    return jwt.sign({}, secret, {
        algorithm: "HS256",
        expiresIn: "14d",
    });
}

// refresh token 검증
async function refreshVerify(token, id) {
    const getAsync = promisify(redisClient.get).bind(redisClient);

    try {
        const data = await getAsync(id);
        if (token === data) {
            try {
                jwt.verify(token, secret);
                return true;
            } catch (e) {
                return false;
            }
        }
    } catch (e) {
        return false;
    }
}

module.exports = {
    sign,
    verify,
    refresh,
    refreshVerify,
};
