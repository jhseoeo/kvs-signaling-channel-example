const compareImages = require("resemblejs/compareImages");

/**
 * Get image mismatch rate of two images
 * @param {Blob} image1 - image
 * @param {Blob} image2 - image to compare
 * @returns {Promise<Number>} image mismatch rate
 */
async function getDiff(image1, image2) {
    return new Promise((resolve, reject) => {
        const options = {
            returnEarlyThreshold: 100,
        };

        try {
            compareImages(image1, image2, options).then(function (data, err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(Number(data.misMatchPercentage));
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = getDiff;
