const jwt = require("../util/jwt");
const JWT = require("jsonwebtoken");

/**
 * A middleware that pass only authorized requests
 */
module.exports.Authorized = async (req, res, next) => {
    if (req.headers.authorization === undefined) {
        // case 0 : Authorzation 헤더 자체가 없는 경우
        return res.status(401).send({
            statusCode: 401,
            ok: false,
            message: "Unauthorized-no authorzation field in header",
        });
    }

    const decoded = JWT.decode(req.headers.authorization.split("Bearer ")[1]);
    if (decoded === null) {
        // case 1 : access token이 잘못되어, decode할 수 없는 경우
        return res.status(403).send({
            statusCode: 403,
            ok: false,
            message: "Bad request - unable to decode access token",
        });
    }
    const id = decoded.id;
    const accessToken = jwt.verify(req.headers.authorization.split("Bearer ")[1]);
    const refreshToken = await jwt.refreshVerify(req.headers.refresh.split("Bearer ")[1], id);

    if (!accessToken.ok) {
        if (!refreshToken) {
            // case 2 : access token과 refresh token이 모두 만료된 경우
            res.clearCookie("access");
            res.clearCookie("refresh");
            delete req.cookies.access;
            delete req.cookies.refresh;
            return res.status(401).send({
                statusCode: 401,
                ok: false,
                message: "Unauthorized-both access token and refresh token is expired",
            });
        } else {
            // case 3 : access token은 만료되었지만 refresh token이 유효한 경우
            const newAccessToken = jwt.sign(id);
            res.cookie("access", newAccessToken);
            req.cookies.access = newAccessToken;
            req.id = id;
            next();
        }
    } else {
        if (!refreshToken) {
            // case 4 : access token은 유효하지만 refresh token이 만료된 경우
            const newRefreshToken = jwt.refresh();
            res.cookie("refresh", newRefreshToken);
            req.cookies.refresh = newRefreshToken;
            req.id = id;
            next();
        } else {
            req.id = id;
            next();
        }
    }
};

/**
 * A middleware that pass only unauthorized requests
 */
module.exports.notAuthorized = async (req, res, next) => {
    const authorization = req.headers.authorization || req.cookies.access;
    const refresh = req.headers.refresh || req.cookies.refresh;

    if (authorization === undefined) {
        // case 0 : Authorzation 헤더 자체가 없는 경우
        return next();
    }

    const decoded = JWT.decode(authorization.split("Bearer ")[1]);
    if (decoded === null) {
        // case 1 : access token이 잘못되어, decode할 수 없는 경우
        return res.status(403).send({
            statusCode: 403,
            ok: false,
            message: "Bad request - unable to decode access token",
        });
    }
    const id = decoded.id;
    const accessToken = jwt.verify(authorization.split("Bearer ")[1]);
    const refreshToken = await jwt.refreshVerify(refresh.split("Bearer ")[1], id);

    if (!accessToken.ok && !refreshToken) {
        // case 2 : access token과 refresh token이 모두 만료된 경우
        res.clearCookie("access");
        res.clearCookie("refresh");
        return next();
    } else {
        // 그 외의 경우는 모두 로그인된 것으로 처리
        return res.status(403).send({
            statusCode: 403,
            ok: false,
            message: "Bad request - already logged in",
        });
    }
};
