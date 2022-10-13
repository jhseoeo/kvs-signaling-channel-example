import { useState, useRef, useEffect } from "react";
import RecordVideo from "../../lib/recoder/recoder";
const detect = require("../../lib/recoder/tensor_objdetect");
const compare = require("../../lib/recoder/compareImg");

const DETECT_INTERVAL = 500;
const THRESHOLD_OBJDETECT = 50;
const THRESHOLD_COMPAREIMAGE = 80;

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    let cameraStream = useRef();
    let imageCapture = useRef();
    let prevImgBlob;

    useEffect(() => {
        (async () => {
            // eslint-disable-next-line
            cameraStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            // cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            recorderView.current.srcObject = cameraStream.current;
            imageCapture.current = new ImageCapture(cameraStream.current.getVideoTracks()[0]);

            const initialImageBlob = await imageCapture.current.takePhoto({ imageWidth: 640, imageHeight: 480 });
            prevImgBlob = initialImageBlob;

            setInterval(async () => {
                if (imageCapture.current) {
                    const imageBlob = await imageCapture.current.takePhoto({ imageWidth: 640, imageHeight: 480 });
                    const compareResult = await detect(imageBlob, prevImgBlob);
                    console.log(compareResult);
                    // // 유사도 비교 결과에 따라 녹화 여부 결정
                    // // 녹화한다면 일정 기간동안 유사도 비교 멈춤
                    // // previmg 저장
                    prevImgBlob = imageBlob;
                }
            }, DETECT_INTERVAL);
        })();
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
