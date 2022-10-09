// const RECORD_INTERVAL = 10 * 60 * 1000;
// const RECORD_TIME = 5 * 60 * 1000;
const RECORD_INTERVAL = 5 * 1000;
const RECORD_TIME = 3 * 1000;

let recordable = true;

/**
 * Record a video and store with given method
 * @param {MediaStream} stream - local video stream
 * @return {Promise<Blob>} - recorded video clip
 */
function RecordVideo(stream) {
    return new Promise((resolve, reject) => {
        if (recordable) {
            recordable = false;

            let blobs = [];
            let media_recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

            media_recorder.ondataavailable = (e) => {
                blobs.push(e.data);
            };

            media_recorder.onstop = () => {
                let videoData = new Blob(blobs, { type: "video/webm" });
                resolve(videoData);
            };

            setTimeout(() => {
                media_recorder.stop();
            }, RECORD_TIME);
            setTimeout(() => {
                recordable = true;
            }, RECORD_INTERVAL);

            media_recorder.start(RECORD_TIME);
        } else {
            alert("지금못찍어요");
            reject("not recordable yet");
        }
    });
}

module.exports = RecordVideo;
