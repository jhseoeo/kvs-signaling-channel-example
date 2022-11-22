const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
const cocossd = require("@tensorflow-models/coco-ssd");

let model = null;

/**
 * Setup cocossd model
 */
const setupCoco = async () => {
    model = await cocossd.load();
    console.log("finish loading cocossd");
};

/**
 * detect
 * @param {blob} imageblob
 * @return {any} Objects that detected in screenshot
 */
const detect = async (imageblob) => {
    if (model) {
        const ImageBitmap = await createImageBitmap(imageblob);
        const tensor = tf.browser.fromPixels(ImageBitmap);

        const predictions = await model.detect(tensor);
        return predictions;
    } else {
        console.log("아직이요");
    }
};

module.exports = { detect, setupCoco };
