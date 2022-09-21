import { useRef } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../lib/kinesis/getChannelInfo");
const startMaster = require("../lib/kinesis/master");

function Master(props) {
    const { channelName } = useParams();
    const masterLocalView = useRef();
    const masterRemoteView = useRef();

    let tmp = async () => {
        let channelData = await getSignalingChannelInfo(channelName, "MASTER");
        startMaster(channelData, masterLocalView.current, masterRemoteView.current, () => {});
    };
    tmp();

    return (
        <>
            <video className="viewer-local-view" autoPlay playsInline controls muted ref={masterLocalView} />
            <video className="viewer-remote-view" autoPlay playsInline controls ref={masterRemoteView} />
            <button>close channel</button>
        </>
    );
}

export default Master;
