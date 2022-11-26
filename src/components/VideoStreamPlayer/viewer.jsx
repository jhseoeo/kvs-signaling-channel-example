import { useRef, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from 'react';
import Header from "../header";
import Modal from "../modal"
import IconButton from '@mui/material/IconButton';
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone';

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
    const flag = "viewer"

    const dtoList = [
        {
            title : "fwoeifj",
            contentTitle: "foweijf",
            mainContent: "foweijfoi",
            img: "foweijf"
        },
        {
            title : "fwoeifj",
            contentTitle: "foweijf",
            mainContent: "foweijfoi",
            img: "foweijf"
        },
        {
            title : "fwoeifj",
            contentTitle: "foweijf",
            mainContent: "foweijfoi",
            img: "foweijf"
        }
    ]

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
            top: '10%',
        }
    }

    return (
        <>
            <Header />
            <Modal
                flag={flag}
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
                dtoList={dtoList}
            />

            <video className="viewer-remote-view" autoPlay playsInline controls muted ref={viewerRemoteView} />
            <IconButton aria-label="delete" size="large" color="primary" style={style.buttonStyle} onClick={() => setIsOpen(true)}>
                <HelpOutlineTwoToneIcon fontSize="inherit"/>
            </IconButton>
        </>
    );
}

export default Viewer;
