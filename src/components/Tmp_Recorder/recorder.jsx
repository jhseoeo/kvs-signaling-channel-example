import { useRef, useEffect } from "react";
import uploadClip from "../../lib/clips/uploadClip";
const { RecordVideo, startDecideRecordLoop } = require("../../lib/recoder");

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    const cameraStream = useRef();

    useEffect(() => {
        (async () => {
            cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            recorderView.current.srcObject = cameraStream.current;
            startDecideRecordLoop(
                cameraStream.current,
                async () => {
                    const file = await RecordVideo(cameraStream.current, 5 * 1000);
                    downloadFile(file);
                },
                () => {
                    return false;
                }
            );
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

    return (
        <div>
            <video className="recorder-view" autoPlay playsInline controls muted ref={recorderView} />
            <button
                onClick={async () => {
                    const file = await RecordVideo(cameraStream.current, 5 * 1000);
                    downloadFile(file);
                }}
            >
                Start Recording
            </button>
        </div>
    );
}

export default Recorder;
