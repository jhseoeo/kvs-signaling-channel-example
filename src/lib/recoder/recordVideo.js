/**
 * Record a video and store with given method
 * @param {MediaStream} stream - local video stream
 * @param {Number} recordTime - video length(ms)
 * @return {Promise<Blob>} - recorded video clip
 */
function RecordVideo(stream, recordTime) {
    return new Promise((resolve, reject) => {
        try {
            let blobs = [];
            let media_recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=h264" });

            media_recorder.ondataavailable = (e) => {
                blobs.push(e.data);
            };

            media_recorder.onstop = () => {
                let videoData = new Blob(blobs, { type: "video/webm" });
                resolve(videoData);
            };

            setTimeout(() => {
                media_recorder.stop();
            }, recordTime);

            media_recorder.start(recordTime);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = RecordVideo;
