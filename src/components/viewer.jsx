import { useRef } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../lib/kinesis/getChannelInfo");
const startViewer = require("../lib/kinesis/viewer");

function Viewer(props) {
    const { channelName } = useParams();
    const viewerLocalView = useRef();
    const viewerRemoteView = useRef();

    let tmp = async () => {
        let channelData = await getSignalingChannelInfo(channelName, "VIEWER", "hi");
        startViewer(channelData, viewerLocalView.current, viewerRemoteView.current, () => {});
    };
    tmp();

    return (
        <>
            <video className="viewer-local-view" autoPlay playsInline controls muted ref={viewerLocalView} />
            <video className="viewer-remote-view" autoPlay playsInline controls ref={viewerRemoteView} />
            <button>close channel</button>
        </>
    );
}

export default Viewer;
