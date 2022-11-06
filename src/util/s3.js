const AWS = require("aws-sdk");
require("dotenv").config();

const S3BUCKET = "dogibogi-laptop";
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
    };

    return await S3.getSignedUrlPromise(action, params);
}

async function getUploadFileUrl(fileKey) {
    return await getSignedUrl(fileKey, "putObject");
}

/**
 * get signed url for download file
 * @param {string} fileKey a key of the file
 * @returns {Promise<string>} signed url for download file
 */
async function getDownloadFileUrl(fileKey) {
    return await getSignedUrl(fileKey, "getObject");
}

/**
 * get signed url for upload file
 * @param {string} fileKey - a key of the file
 * @returns {Promise<string>} signed url for upload file
 */
async function deleteFile(fileKey) {
    const params = {
        Bucket: S3BUCKET,
        Key: fileKey,
    };

    return S3.deleteObject(params).promise();
}

module.exports = {
    getUploadFileUrl,
    getDownloadFileUrl,
    deleteFile,
};
