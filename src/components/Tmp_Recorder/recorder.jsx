import React, { useRef, useEffect, useState, useCallback } from "react";
import Modal from "../modal"
import Header from "../header";
import uploadClip from "../../lib/clips/uploadClip";
import getRecordsList from "../../lib/clips/getRecordsList";
import Row from "./row";
import moment from "moment";
import "../videoModal.css"
import SearchIcon from '@mui/icons-material/Search';
import searchClipByTag from "../../lib/clips/searchClipByTag";
import { FormControlUnstyledContext } from "@mui/base";
import { Grid, Item } from "@mui/material";
import getClip from "../../lib/clips/getClip"
import VideoModal from "../videoModal";

const { RecordVideo, startDecideRecordLoop } = require("../../lib/recoder");

/**
 * Page that produces video stream and transfers to Viewer
 * @returns {JSX.Element} WebCAM Master page
 */
function Recorder() {
    const recorderView = useRef();
    const cameraStream = useRef();
    const flag = "recorder"

    const [tagResult, setTagResult] = useState([
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // },
        // {
        //     recorded_at: "2022-11-26T12:59:34.001Z",
        //     recordid: "3",
        //     link: "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/1/3/2022-11-26-12%3A59%3A33.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221128%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221128T154456Z&X-Amz-Expires=3600&X-Amz-Signature=259c9f56f839a5a115d2a3311191b99b4d75e792df6d1672cdbdc6026d3e5d4b&X-Amz-SignedHeaders=host",
        //     clipid: "2",
        //     tag: "태그예요"
        // }

    ])
    const [hashtag, setHashtag] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [videoUrl, setVideoUrl] = useState("")
    const [clipId, setClipId] = useState('')
    const [recordId, setRecordId] = useState('')
    const [tag, setTag] = useState('')
    const [search, setSearch] = useState("");
    const [firstLoad, setFirstLoad] = useState(true)
    const onChange = (e) => {
        setSearch(e.target.value)

        if (e.target.value.length == 0) {
            reqRecordList()
            setTagResult([])
        }
    }

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [recordList, setRecordList] = React.useState([
        {
            record_start: "",
            record_stop: "",
            recordid: "",
            userid: ""
        }
    ]);


    const onKeyUp = useCallback(
        (e) => {
            // 검색 > 엔터 > 테그 하나 생기고 > api 호출 > 
            // 태그 누르면 없애고 > api 호출
            if (process.browser) {
                /* enter 키 코드 :13 */
                if (e.keyCode === 13 && e.target.value.trim() !== '') {
                    console.log('Enter Key 입력됨!', e.target.value)

                    if (e.target.value.length !== 0 && hashtag !== e.target.value) {
                        setHashtag(e.target.value)
                        searchClipByTag(e.target.value).then((result) => {
                            // 클립 다시 보여주기 
                            console.log(result.videoDatas)
                            if (result && result.videoDatas) {

                                console.log(result.videoDatas)
                                setTagResult(result.videoDatas)
                            }
                        })
                            .catch(err => console.log(err))
                    }
                }
            }
        },
        []
    )

    const reqRecordList = () => {
        getRecordsList().then((result) => {
            console.log("getRecordsList()")
            console.log(result)
            // console.log(result.recordlist)

            if (result && result.recordlist) {
                // 리스폰스 결과값 저장
                setRecordList(result.recordlist)
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
    }

    useEffect(() => {
        (async () => {
            console.log("here")
            reqRecordList()
        })();
        // eslint-disable-next-line
    }, []);

    const handleClick = (clip) => {
        if (clip.clipid && clip.recordid) {
            setClipId(clip.clipid)
            setTag(clip.tag)
            setRecordId(clip.recordid)

            getClip(clip.recordid, clip.clipid).then((result) => {
                console.log(result)
                if (result && result.link) {
                    setVideoUrl(result.link)
                    setFirstLoad(true)
                    setShowModal(true)
                }
            }).catch(err => {
                setShowModal(false)
                console.log(err)
            })
        }
    };


    const style = {
        vgStyle: {
            marginTop: "100px"
        },
        inputStyle: {
            marginTop: "100px",
            marginLeft: "20px",
            border: "1px solid gray"
        }

    }

    const handleClose = () => {
        console.log("called handleClose")
        // reqGetClips()
        setShowModal(false)
    }

    return (
        <div>
            <Header />
            <VideoModal
                showModal={showModal}
                handleClose={handleClose}
                videoUrl={videoUrl}
                recordId={recordId}
                clipId={clipId}
                tag={tag}
                firstLoad={firstLoad}
                loadCallback={() => setFirstLoad(false)}
            />

            <div className="HashWrap2">
                <input
                    className="HashInput2"
                    type="text"
                    value={search}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    placeholder="#태그로 검색"
                />
            </div>

            <div style={style.vgStyle}>

                {tagResult.length == 0 && recordList.map(record => (
                    <Row
                        key={record.recordid}
                        recordTimeStartToEnd={`${moment(Date(record.record_start)).format("MM월 DD일")}`}
                        recordId={record.recordid}
                    />
                ))}

                {tagResult.length !== 0 &&

                    < Grid style={{ margin: "10px" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {tagResult.map((clip, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <div >
                                    <img
                                        key={index}
                                        onClick={() => handleClick(clip)}
                                        className={"row_poster row_posterLarge"}
                                        src={clip.link}
                                        alt={clip.recorded_at}
                                    />
                                    <div className='HashWrapInner2' hidden={!clip.tag || (clip.tag && clip.tag.length == 0)}>{'#' + clip.tag}</div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                }
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

        </div >
    );
}

export default Recorder;
