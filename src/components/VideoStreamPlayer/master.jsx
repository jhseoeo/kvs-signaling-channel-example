import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./player.css";
const getSignalingChannelInfo = require("../../lib/kinesis/getChannelInfo");
const startMaster = require("../../lib/kinesis/master");

/**
 * Page that produces video stream and transfers to Viewer
 * @param {string} channelName - /master/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Master page
 */
function Master() {
    const { channelName } = useParams();
    const masterLocalView = useRef();

    useEffect(() => {
        getSignalingChannelInfo(channelName, "MASTER")
            .then((channelData) => {
                startMaster(channelData, masterLocalView.current, () => {});
            })
            .catch((e) => {
                console.log(e);
            });

        // return () => {deleteSignalingChannel(channelName)};
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <video className="viewer-local-view" autoPlay playsInline controls muted ref={masterLocalView} />
            <button>close channel</button>
        </>
    );
}

export default Master;
