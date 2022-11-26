import { useRef, useEffect } from "react";
import Modal from "../modal"
import Header from "../header";
import React from 'react';
import uploadClip from "../../lib/clips/uploadClip";
import getRecordsList from "../../lib/clips/getRecordsList";
import Row from "./row";
const { RecordVideo, startDecideRecordLoop } = require("../../lib/recoder");

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    const cameraStream = useRef();
    const flag = "recorder"

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [recordList, setRecordList] = React.useState([
        {
            record_start: "",
            record_stop: "",
            recordid: "",
            userid: ""
        }
    ]);

    const dtoList = [
        {
            title : "녹화영상 확인하기",
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

    // useEffect(() => {
    //     (async () => {
    //         cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    //         recorderView.current.srcObject = cameraStream.current;
    //         startDecideRecordLoop(
    //             cameraStream.current,
    //             async () => {
    //                 const file = await RecordVideo(cameraStream.current, 5 * 1000);
    //                 downloadFile(file);
    //             },
    //             () => {
    //                 return false;
    //             }
    //         );
    //     })();
    //     // eslint-disable-next-line
    // }, []);

    // const downloadFile = (blobFile) => {
    //     const url = window.URL.createObjectURL(blobFile);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "video.webm");
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    // };


    useEffect(() => {
        (async () => {
            console.log("here")
            getRecordsList().then((result) => {
                console.log("getRecordsList()")
                console.log(result)
                // console.log(result.recordlist)

                if (result && result.recordlist) {
                    // 리스폰스 결과값 저장
                    setRecordList(result.recordlist)
                    // console.log(recordList)
                } else {
                    let tempList = []

                    for (let i = 0; i < 20; i++) {
                        tempList.push({
                            record_start: "",
                            record_stop: "",
                            recordid: "",
                            userid: `${i}`
                        })
                    }
                    setRecordList(tempList)
                }                
            });
        })();
        // eslint-disable-next-line
    }, []);
    

    const style = {
        vgStyle: {
            marginTop:"200px"
        },

    }
    

    return (
        <div>
            <Header />
            <Modal
                flag={flag}
                isShow={modalIsOpen}
                closeCallback={() => setIsOpen(false)}
                dtoList={dtoList}
            />

            <div style={style.vgStyle}>

                {recordList.map(record => (
                    <Row
                        key={record.recordid}
                        recordTimeStartToEnd={`${record.record_start} ~ ${record.record_stop}`}
                        recordId={record.recordid}
                    />
                ))}
                
                    
                
            </div>
            {/* <video className="recorder-view" autoPlay playsInline controls muted ref={recorderView} />
            <button
                onClick={async () => {
                    const file = await RecordVideo(cameraStream.current, 5 * 1000);
                    downloadFile(file);
                }}
            >
                Start Recording
            </button> */}
            
        </div>
    );
}

export default Recorder;
