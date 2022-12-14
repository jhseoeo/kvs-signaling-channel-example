import { useRef, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./player.css";
import React from "react";
import Header from "../header";
import { Button } from "react-bootstrap";

const createSignalingChannel = require("../../lib/kinesis/createChannel");
const deleteSignalingChannel = require("../../lib/kinesis/deleteChannel");
const startMaster = require("../../lib/kinesis/master");
const { RecordVideo, startDecideRecordLoop } = require("../../lib/recoder");
const uploadClip = require("../../lib/clips/uploadClip");

const LOCALVIEW_SHOW_TIMEOUT = 10 * 1000;
const RECORD_TIME = 60 * 1000;

/**
 * Page that produces video stream and transfers to Viewer
 * @param {string} params.channelName - /master/:channelName. Name of the channel
 * @returns {JSX.Element} WebCAM Master page
 */
function Master() {
    const masterLocalView = useRef();
    const localStream = useRef();
    const closeFunc = useRef();

    const [connectionState, setConnectionState] = useState(false);
    const [showLocalView, setShowLocalView] = useState(false);
    const [loaded, setLoaded] = useState(false);
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
            }, LOCALVIEW_SHOW_TIMEOUT);
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
                    const file = await RecordVideo(localStream.current, RECORD_TIME);
                    uploadClip(file, thumbnail);
                },
                () => {
                    return connectionState;
                }
            );

            await createSignalingChannel()
                .then((channelData) => {
                    if (channelData.ok) {
                        alert("설정이 완료되었습니다. 녹화를 시작합니다!");
                    } else {
                        alert("설정 중 오류가 발생하였습니다. 다시 시도해주세요!");
                        window.location.href = "/modeSelector";
                    }

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

            setLoaded(true);
        };
        makeLocalStream();
        // eslint-disable-next-line
    }, []);

    const style = {
        buttonStyle: {
            position: "absolute",
            right: "10%",
            top: "7%",
        },
        showButtonStyle: {
            position: "absolute",
            left: "10%",
            bottom: "2%",
            // marginLeft:"10px"
        },
        showButtonStyle2: {
            position: "absolute",
            right: "10%",
            bottom: "2%",
        },

        videoStyle: {
            width: "80%",
            position: "absolute",
            right: "10%",
            top: "7%",
            marginTop: "50px",
            display: showLocalView ? "block" : "none",
        },

        imgStyle: {
            maxWidth: "600px",
            minWidth: "300px",
        },
    };

    const onBackButtonClick = () => {
        window.location.href = "/modeSelector";
    };

    return (
        <>
            <Header />
            <div style={style.divStyle}>
                <Button style={style.showButtonStyle2} onClick={onBackButtonClick}>
                    나가기
                </Button>
                <Button style={style.showButtonStyle} onClick={handleShowLocalView}>
                    {showLocalView ? "숨기기" : "보이기"}
                </Button>
            </div>

            <div
                style={{
                    display: !showLocalView ? "block" : "none",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                {loaded ? (
                    <img src="img/recording.png" alt="recording" style={style.imgStyle} />
                ) : (
                    <img src="img/loading.png" alt="loading" style={style.imgStyle} />
                )}
            </div>
            <video
                // className="viewer-remote-view"
                width="80%"
                height="80%"
                autoPlay
                playsInline
                controls
                muted
                ref={masterLocalView}
                style={style.videoStyle}
            />
        </>
    );
}

export default Master;
