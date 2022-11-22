import { useRef, useEffect } from "react";
import RecordVideo from "../../lib/recoder/recodeVideo";
import Modal from "../modal"
import Header from "../header";
import React from 'react';
import startDecideRecordLoop from "../../lib/recoder/decideRecord";

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    const cameraStream = useRef();
    const flag = "recorder"

    const [modalIsOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
        (async () => {
            cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            recorderView.current.srcObject = cameraStream.current;
            startDecideRecordLoop(cameraStream.currentㅈ);
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
            <Header />
            <Modal
                flag={flag}
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
            />
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
