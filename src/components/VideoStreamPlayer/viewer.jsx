import { useRef, useEffect } from "react";
import "./player.css";
import Header from "../header";
const getSignalingChannelInfo = require("../../lib/kinesis/getChannelInfo");
const startViewer = require("../../lib/kinesis/viewer");

/**
 * Page to view WebCAM video stream transfered from Master
 * @param {string} params.channelName - /viewer/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Viewer page
 */
function Viewer() {
    const viewerRemoteView = useRef();

    useEffect(() => {
        getSignalingChannelInfo()
            .then((channelData) => {
                startViewer(channelData.channelData, viewerRemoteView.current, () => {});
            })
            .catch((e) => {
                console.log(e);
            });

        // return () => {deleteSignalingChannel(channelName)};
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />
            {/* <br/> */}
            {/* <div style={{
                position:"absolute",
                right:"85%",
                top:"13%"
            }}>wefwfe</div> */}
            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
            {/* <button>close channel</button> */}
        </>
    );
}

export default Viewer;
