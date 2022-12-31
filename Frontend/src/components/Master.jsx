import { useRef } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../lib/kinesis/getChannelInfo");
const startMaster = require("../lib/kinesis/master");

function Master(props) {
    const { channelName } = useParams();
    const localStream = useRef();
    const masterLocalView = useRef();

    let tmp = async () => {
        try {
            localStream.current = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            masterLocalView.current.srcObject = localStream.current;
        } catch (e) {
            console.error("[MASTER] Could not find webcam");
        }

        let channelData = await getSignalingChannelInfo("master", channelName, "client");
        startMaster(channelData.channelData, localStream.current, () => {});
    };
    tmp();

    return (
        <>
            <video className="viewer-local-view" autoPlay playsInline controls muted ref={masterLocalView} />
        </>
    );
}

export default Master;
