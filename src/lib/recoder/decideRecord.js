const detect = require("./tensor_objdetect");
const compare = require("./compareImg");

const INITIAL_INTERVAL = 500;
const MAX_INTERVAL = 2500;
const INITIAL_COMP_THRESHOLD = 60;
const MIN_COMP_THRESHOLD = 1;

const INCREMENTER_INTERVAL = 150;
const INCREMENTER_COMP_THRESHOLD = 0.95;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function max(a, b) {
    return a > b ? a : b;
}

function min(a, b) {
    return a < b ? a : b;
}

async function startDecideRecordLoop(cameraStream) {
    const imageCapture = new ImageCapture(cameraStream.getVideoTracks()[0]);

    // dynamic values
    let logicInterval = INITIAL_INTERVAL;
    let compThreshold = INITIAL_COMP_THRESHOLD;

    let prevImgBlob = await imageCapture.takePhoto({ imageWidth: 640, imageHeight: 480 });
    while (true) {
        if (imageCapture) {
            const imageBlob = await imageCapture.takePhoto({ imageWidth: 640, imageHeight: 480 });
            const compareResult = await compare(imageBlob, prevImgBlob, compThreshold * 2);

            console.log(compareResult, compThreshold);
            if (compareResult < compThreshold) {
                logicInterval = min(logicInterval + INCREMENTER_INTERVAL, MAX_INTERVAL);
                compThreshold = max(compThreshold * INCREMENTER_COMP_THRESHOLD, MIN_COMP_THRESHOLD);
                prevImgBlob.current = imageBlob;
            } else {
                const detectResult = await detect(imageBlob);
                console.log(compareResult, detectResult);

                if (compareResult < compThreshold * 1.3) {
                    logicInterval = INITIAL_INTERVAL;
                    compThreshold = INITIAL_COMP_THRESHOLD;
                    console.log("record");
                } else {
                    logicInterval = min(logicInterval + INCREMENTER_INTERVAL, MAX_INTERVAL);
                }
                prevImgBlob = imageBlob;
            }
            await sleep(logicInterval);
        }
    }
}

module.exports = startDecideRecordLoop;
