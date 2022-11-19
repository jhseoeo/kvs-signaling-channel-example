import { useRef, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from 'react';
import Button from 'react-bootstrap/Button';
import Header from "../header";
import Modal from "../modal"

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

    const [modalIsOpen, setIsOpen] = React.useState(false);

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
            });

        // eslint-disable-next-line
    }, []);

    const style = {
        buttonStyle: {
            position: 'absolute',
            right: '10%',
            top: '78%',
        }
    }

    return (
        <>
            <Header />
            <Modal
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
            />

            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
            <Button style={style.buttonStyle} onClick={() => { setIsOpen(true) }}>?</Button>
        </>
    );
}

export default Viewer;
