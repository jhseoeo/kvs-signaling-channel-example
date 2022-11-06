import { useState, useRef, useEffect } from "react";
const compare = require("../../lib/recoder/compareImg");

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function TestRecorder() {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const recorderView = useRef();
    const canvas1 = useRef();
    const canvas2 = useRef();
    const cameraStream = useRef();
    const imageCapture = useRef();

    useEffect(() => {
        (async () => {
            // eslint-disable-next-line
            cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            recorderView.current.srcObject = cameraStream.current;
            imageCapture.current = new ImageCapture(cameraStream.current.getVideoTracks()[0]);
        })();
    }, []);

    const drawCanvas = async (canvas, img) => {
        createImageBitmap(img).then((imageBitmap) => {
            canvas.getContext("2d").drawImage(imageBitmap, 0, 0);
        });
    };

    const takeImg1 = async () => {
        const imageBitmap = await imageCapture.current.takePhoto({ imageWidth: 640, imageHeight: 480 });
        setImage1(imageBitmap);
        drawCanvas(canvas1.current, imageBitmap);
    };

    const takeImg2 = async () => {
        const imageBitmap = await imageCapture.current.takePhoto({ imageWidth: 640, imageHeight: 480 });
        setImage2(imageBitmap);
        drawCanvas(canvas2.current, imageBitmap);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <video
                className="recorder-view"
                autoPlay
                playsInline
                controls
                muted
                width={640}
                height={480}
                ref={recorderView}
            />
            <button
                onClick={() => {
                    compare(image1, image2).then((res) => console.log(res));
                }}
            >
                compare
            </button>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <canvas className="img1" ref={canvas1} width={640} height={480}></canvas>
                    <button onClick={takeImg1}>capture img1</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <canvas className="img2" ref={canvas2} width={640} height={480}></canvas>
                    <button onClick={takeImg2}>capture img2</button>
                </div>
            </div>
        </div>
    );
}

export default TestRecorder;
