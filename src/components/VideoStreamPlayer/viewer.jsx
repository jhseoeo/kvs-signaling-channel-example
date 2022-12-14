import { useRef, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from "react";
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
    const closeFunc = useRef();

    const onConnectionTerminated = () => {
        window.location.href = "/";
    };

    useBeforeunload((e) => {
        if (closeFunc.current) closeFunc.current();
    });

    useEffect(() => {
        getSignalingChannelInfo()
            .then((channelData) => {
                return startViewer(channelData.channelData, viewerRemoteView.current, () => {}, onConnectionTerminated);
            })
            .then((close) => {
                closeFunc.current = close;
            })
            .catch((e) => {
                console.log(e);
                alert("설정된 웹캠이 없습니다");
                window.location.href = "/modeselector";
            });

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />

            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
        </>
    );
}

export default Viewer;
