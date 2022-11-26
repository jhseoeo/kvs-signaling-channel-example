import { useRef, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from 'react';
import Header from "../header"
import Modal from "../modal"

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
    const [showLocalView, setShowLocalView] = useState(false);
    let showLocalViewTimeout;

    const handleShowLocalView = () => {
        if (showLocalView) {
            if (showLocalViewTimeout) {
                clearTimeout(showLocalViewTimeout);
                showLocalViewTimeout = null;
            }
            setShowLocalView(false);
        } else {
            showLocalViewTimeout = setTimeout(() => {
                setShowLocalView(false);
            }, LOCALVIEW_SHOW_TIMEOUT / 10);
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

    return (
        <>
            <Header/>
            <Modal
                flag={flag}
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
            />
            <button onClick={handleShowLocalView}> {showLocalView ? "보이기" : "숨기기"} </button>
            <video
                className="viewer-local-view"
                autoPlay
                playsInline
                controls
                muted
                ref={masterLocalView}
                style={{ display: showLocalView ? "block" : "none" }}
            />
        </>
    );
}

export default Master;
