const compareImages = require("resemblejs/compareImages");

async function getDiff(image1, image2, threshold = 30) {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                returnEarlyThreshold: threshold,
            };

            compareImages(image1, image2, options).then(function (data, err) {
                if (err) {
                    console.error(err);
                } else {
                    resolve(data.misMatchPercentage);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = getDiff;
