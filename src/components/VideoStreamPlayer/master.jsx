import { useRef, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from 'react';
import Header from "../header"
import Modal from "../modal"
import { ConstructionOutlined } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone';
import { Button, Row, Container, Card } from "react-bootstrap";

const createSignalingChannel = require("../../lib/kinesis/createChannel");
const deleteSignalingChannel = require("../../lib/kinesis/deleteChannel");
const startMaster = require("../../lib/kinesis/master");
const { RecordVideo, startDecideRecordLoop } = require("../../lib/recoder");
const uploadClip = require("../../lib/clips/uploadClip");

const LOCALVIEW_SHOW_TIMEOUT = 30 * 1000;

/**
 * Page that produces video stream and transfers to Viewer
 * @param {string} params.channelName - /master/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Master page
 */
function Master() {
    const masterLocalView = useRef();
    const localStream = useRef();
    const closeFunc = useRef();

    const flag = "master"

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [connectionState, setConnectionState] = useState(false);
    const [showLocalView, setShowLocalView] = useState(true);
    let showLocalViewTimeout;

    const handleShowLocalView = () => {
        if (showLocalView) {
            // if (showLocalViewTimeout) {
            //     clearTimeout(showLocalViewTimeout);
            //     showLocalViewTimeout = null;
            // }
            setShowLocalView(false);
        } else {
            // showLocalViewTimeout = setTimeout(() => {
            // setShowLocalView(false);
            // }, LOCALVIEW_SHOW_TIMEOUT / 10);
            setShowLocalView(true);
        }
    };

    useBeforeunload((e) => {
        e.preventDefault();
        deleteSignalingChannel();
        if (closeFunc.current) closeFunc.current();
        window.close();
    });

    useEffect(() => {
        const makeLocalStream = async () => {
            try {
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
                masterLocalView.current.srcObject = localStream.current;
            } catch (e) {
                console.error("[MASTER] Could not find webcam");
            }

            await startDecideRecordLoop(
                localStream.current,
                async (thumbnail) => {
                    const file = await RecordVideo(localStream.current, 5 * 1000);
                    uploadClip(file, thumbnail);
                },
                () => {
                    return connectionState;
                }
            );

            await createSignalingChannel()
                .then((channelData) => {
                    return startMaster(channelData.channelData, localStream.current, (connected) => {
                        setConnectionState(connected);
                    });
                })
                .then((close) => {
                    closeFunc.current = close;
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        makeLocalStream();
        // eslint-disable-next-line
    }, []);

    const style = {
        buttonStyle: {
            position: 'absolute',
            right: '10%',
            top: '7%',
        },
        showButtonStyle: {
            position: 'absolute',
            left: '10%',
            bottom: '2%',
            // marginLeft:"10px"
        },
        showButtonStyle2: {
            position: 'absolute',
            right: '10%',
            bottom: '2%',
        },
        divStyle: {
            // display:"flex",
            // position: 'absolute',
            // right: '10%',
            // bottom: '2%',
        },
        videoStyle: {
            width: "80%",
            position: "absolute",
            right: "10%",
            top: "7%",
            marginTop: "50px",
            display: showLocalView ? "block" : "none"
        }
    }

    const onBackButtonClick = () => {
        window.location.href="/modeSelector"
    }

    return (
        <>
            <Header />
            <Modal
                flag={flag}
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
            />
            <div style={style.divStyle}>
                <Button style={style.showButtonStyle2} onClick={onBackButtonClick}>나가기</Button>
                <Button style={style.showButtonStyle} onClick={() => { setShowLocalView(!showLocalView) }}> {showLocalView ? "숨기기" : "보이기"} </Button>
            </div>

            <video
                // className="viewer-remote-view"
                autoPlay
                playsInline
                controls
                muted
                ref={masterLocalView}
                style={style.videoStyle}
            />
            <IconButton aria-label="delete" size="large" color="primary" style={style.buttonStyle} onClick={() => setIsOpen(true)}>
                <HelpOutlineTwoToneIcon fontSize="inherit" />
            </IconButton>
        </>
    );
}

export default Master;
