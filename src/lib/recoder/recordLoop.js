const compare = require("./compareImg");
const { setupCoco, detect } = require("./tensor_objdetect");
const { getNewInterval, getNewThreshold, getValidThreshold } = require("./recordFactorController");
const { sleep, imageBitmapToBlob } = require("../util");

const START_RECORD_TIMEOUT = (1000 * 60 * 15) / 60 / 3;
const DETECTABLE_OBJECTS = ["dog", "cat"];
const INITIAL_INTERVAL = 1000 * 2;
const INITIAL_COMP_THRESHOLD = 60;
const RECORD_STOP_LOOP = 1000 * 60 * 5;

/**
 * Start record loop
 * @param {MediaStream} cameraStream
 * @param {function():void} recordCallback
 * @param {function():boolean} isStreaming
 */
async function startDecideRecordLoop(cameraStream, recordCallback, isStreaming) {
    const imageCapture = new ImageCapture(cameraStream.getVideoTracks()[0]);
    await setupCoco();

    // dynamic record factors
    let logicInterval = INITIAL_INTERVAL;
    let compThreshold = INITIAL_COMP_THRESHOLD;

    let prevImgBlob = await imageCapture.grabFrame().then((imgbmp) => imageBitmapToBlob(imgbmp));

    const recordLoop = async () => {
        while (true) {
            if (!imageCapture) continue;
            else if (isStreaming()) continue; // when streaming, pause recording

            let imageBlob = await imageCapture.grabFrame().then((imgbmp) => imageBitmapToBlob(imgbmp));
            let detected = false;
            // compare current frame with previous frame
            const compareResult = await compare(imageBlob, prevImgBlob);
            const matchRateDelta = (compThreshold - compareResult) / 100;

            console.log(compareResult, compThreshold, matchRateDelta);
            if (compThreshold < compareResult && compareResult < getValidThreshold(compThreshold)) {
                const detectResult = await detect(imageBlob);
                console.log(detectResult);

                // successfully detected
                // if (true) {
                if (detectResult.filter((v) => DETECTABLE_OBJECTS.includes(v.class)).length > 0) {
                    console.log("start record!");
                    detected = true;
                    recordCallback(imageBlob);
                    await sleep(RECORD_STOP_LOOP);
                    imageBlob = await imageCapture.grabFrame().then((imgbmp) => imageBitmapToBlob(imgbmp));
                }
            }

            logicInterval = getNewInterval(logicInterval, matchRateDelta, detected);
            compThreshold = getNewThreshold(compThreshold, matchRateDelta, detected);
            prevImgBlob = imageBlob;

            await sleep(logicInterval);
        }
    };

    setTimeout(recordLoop, START_RECORD_TIMEOUT);
}

module.exports = startDecideRecordLoop;
