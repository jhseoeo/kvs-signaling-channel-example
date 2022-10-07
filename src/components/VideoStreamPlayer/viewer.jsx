import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../../lib/kinesis/getChannelInfo");
const startViewer = require("../../lib/kinesis/viewer");

// Username is fixed, becuase viewer per channel is only one in early level of development.
const USERNAME = "FIXED_USER_NAME";

/**
 * Page to view WebCAM video stream transfered from Master
 * @param {string} channelName - /viewer/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Viewer page
 */
function Viewer() {
    const { channelName } = useParams();
    const viewerRemoteView = useRef();

    useEffect(() => {
        getSignalingChannelInfo(channelName, "VIEWER", USERNAME)
            .then((channelData) => {
                startViewer(channelData, viewerRemoteView.current, () => {});
            })
            .catch((e) => {
                console.log(e);
            });

        // return () => {deleteSignalingChannel(channelName)};
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
            <button>close channel</button>
        </>
    );
}

export default Viewer;
