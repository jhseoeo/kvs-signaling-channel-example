const AWS = require("aws-sdk");
require("dotenv").config();

const S3BUCKET = process.env.S3_BUCKET;
const S3OPTION = {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
};

const S3 = new AWS.S3(S3OPTION);

async function getSignedUrl(fileKey, action) {
    const params = {
        Bucket: S3BUCKET,
        Key: fileKey,
        Expires: 3600,
    };

    return await S3.getSignedUrlPromise(action, params);
}

/**
 * get signed url for upload video file
 * @param {string} fileKey a key of the video file
 * @returns {Promise<string>} signed url for upload video file
 */
async function getUploadFileUrl(fileKey) {
    return await getSignedUrl(fileKey + ".webm", "putObject");
}

/**
 * get signed url for download video file
 * @param {string} fileKey a key of the video file
 * @returns {Promise<string>} signed url for upload download file
 */
async function getDownloadFileUrl(fileKey) {
    return await getSignedUrl(fileKey + ".webm", "getObject");
}

async function getUploadThumbnailUrl(fileKey) {
    return await getSignedUrl(fileKey + ".jpg", "putObject");
}

/**
 * get signed url for download thunbmail
 * @param {string} fileKey a key of the thunbmail
 * @returns {Promise<string>} signed url for download thunbmail
 */
async function getDownloadThumbnailUrl(fileKey) {
    return await getSignedUrl(fileKey + ".jpg", "getObject");
}

/**
 * get signed url for upload thunbmail
 * @param {string} fileKey a key of the thunbmail
 * @returns {Promise<string>} signed url for upload thunbmail
 */
async function deleteFile(fileKey) {
    const params_video = {
        Bucket: S3BUCKET,
        Key: fileKey + ".webm",
    };
    const params_thumbnail = {
        Bucket: S3BUCKET,
        Key: fileKey + ".jpg",
    };

    return {
        video: await S3.deleteObject(params_video).promise(),
        thumbnail: await S3.deleteObject(params_thumbnail).promise(),
    };
}

module.exports = {
    getUploadFileUrl,
    getDownloadFileUrl,
    getUploadThumbnailUrl,
    getDownloadThumbnailUrl,
    deleteFile,
};
