import { useRef } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../lib/kinesis/getChannelInfo");
const startViewer = require("../lib/kinesis/viewer");

function Viewer(props) {
    const { channelName } = useParams();
    const viewerRemoteView = useRef();

    let tmp = async () => {
        let channelData = await getSignalingChannelInfo("viewer", channelName, "client");
        startViewer(
            channelData.channelData,
            viewerRemoteView.current,
            () => {},
            () => {}
        );
    };
    tmp();

    return (
        <>
            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
        </>
    );
}

export default Viewer;
