import { useState, useRef, useEffect } from "react";
import RecordVideo from "../../lib/recoder/recoder";
const detect = require("../../lib/recoder/tensor_objdetect");
const compare = require("../../lib/recoder/compareImg");

const INITIAL_INTERVAL = 500;
const MAX_INTERVAL = 2500;
const INITIAL_COMP_THRESHOLD = 60;
const MIN_COMP_THRESHOLD = 1;

const INCREMENTER_INTERVAL = 150;
const INCREMENTER_COMP_THRESHOLD = 0.95;

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    const cameraStream = useRef();
    const imageCapture = useRef();
    const prevImgBlob = useRef();

    // dynamic values
    let logicInterval = INITIAL_INTERVAL;
    let compThreshold = INITIAL_COMP_THRESHOLD;

    useEffect(() => {
        (async () => {
            cameraStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            recorderView.current.srcObject = cameraStream.current;
            imageCapture.current = new ImageCapture(cameraStream.current.getVideoTracks()[0]);

            let canvas = document.createElement("canvas");
            canvas.width = 1280;
            canvas.height = 720;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(recorderView.current, 0, 0, canvas.width, canvas.height);
            const initialImageBlob = ctx.getImageData(0, 0, canvas.width, canvas.height);
            prevImgBlob.current = initialImageBlob;

            while (true) {
                if (imageCapture.current) {
                    ctx.drawImage(recorderView.current, 0, 0, canvas.width, canvas.height);
                    const imageBlob = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const compareResult = await compare(imageBlob, prevImgBlob.current, compThreshold * 2);

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
                            compThreshold = max(compThreshold * INCREMENTER_COMP_THRESHOLD, MIN_COMP_THRESHOLD);
                        }
                        prevImgBlob.current = imageBlob;
                    }
                    await sleep(logicInterval);
                }
            }
        })();
        // eslint-disable-next-line
    }, []);

    const downloadFile = (blobFile) => {
        const url = window.URL.createObjectURL(blobFile);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "video.webm");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function max(a, b) {
        return a > b ? a : b;
    }

    function min(a, b) {
        return a < b ? a : b;
    }

    return (
        <div>
            <video className="recorder-view" autoPlay playsInline controls muted ref={recorderView} />
            <button
                onClick={async () => {
                    const file = await RecordVideo(cameraStream);
                    downloadFile(file);
                }}
            >
                Start Recording
            </button>
        </div>
    );
}

export default Recorder;
