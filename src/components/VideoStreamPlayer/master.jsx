import { useState } from "react";
import { useRef, useEffect } from "react";
import "./player.css";
const createSignalingChannel = require("../../lib/kinesis/createChannel");
const deleteSignalingChannel = require("../../lib/kinesis/deleteChannel");
const startMaster = require("../../lib/kinesis/master");

/**
 * Page that produces video stream and transfers to Viewer
 * @param {string} params.channelName - /master/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Master page
 */
function Master() {
    const masterLocalView = useRef();
    const localStream = useRef();

    useState(() => {}, []);

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

            createSignalingChannel()
                .then((channelData) => {
                    startMaster(channelData.channelData, localStream.current, () => {});
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        makeLocalStream();
        window.onbeforeunload = () => {
            deleteSignalingChannel();
        };
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
