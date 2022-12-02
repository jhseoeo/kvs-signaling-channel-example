import React, { useEffect, useState } from "react";
import "./row.css";
import getClips from "../../lib/clips/getClips";
import VideoModal from "../videoModal";
import getClip from "../../lib/clips/getClip";

// clips : {
// "recorded_at": "2022-11-17T15:56:39.596Z",
// "link": "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/3/49/2022-11-18-0%3A56%3A39.webm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221123%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221123T112829Z&X-Amz-Expires=3600&X-Amz-Signature=e70b925fc36bedc0cfb6ead2ccf041f164a48e66499e674b814cb11e1f982b9f&X-Amz-SignedHeaders=host"

function Row(props) {
    const [videoUrl, setVideoUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [clipId, setClipId] = useState("");
    const [tag, setTag] = useState("");
    const [firstLoad, setFirstLoad] = useState(true);
    const [recordedAt, setRecordedAt] = useState("");
    const [clips, setClips] = useState([
        {
            recorded_at: "",
            recorded_stop: "",
            link: "",
            clipid: "",
            tag: "",
        },
    ]);

    const handleClick = (clip) => {
        if (clip.clipid && props.recordId) {
            setClipId(clip.clipid);
            setTag(clip.tag);
            setRecordedAt(clip.recorded_at);

            getClip(props.recordId, clip.clipid)
                .then((result) => {
                    console.log(result);
                    if (result && result.link) {
                        setVideoUrl(result.link);
                        setFirstLoad(true);
                        setShowModal(true);
                    }
                })
                .catch((err) => {
                    setShowModal(false);
                    console.log(err);
                });
        }
    };

    const reqGetClips = () => {
        getClips(props.recordId).then((result) => {
            console.log(props.recordId);
            console.log("getClips()");
            console.log(result);

            let tempList = [];
            if (result && result.videoDatas) {
                tempList = result.videoDatas
                    .sort(function (a, b) {
                        return a.recorded_at - b.recorded_at;
                    })
                    .map((v) => {
                        return {
                            clipid: v.clipid,
                            link: v.link,
                            tag: v.tag,
                            hour: new Date(v.recorded_at).getHours(),
                            minute: new Date(v.recorded_at).getMinutes(),
                        };
                    });
            } else {
                for (let i = 0; i < 20; i++) {
                    tempList.push({
                        recorded_at: "",
                        link: "",
                        thumbNail: "",
                    });
                }
            }
            setClips(tempList);
        });
    };

    useEffect(() => {
        (async () => {
            reqGetClips();
        })();
        // eslint-disable-next-line
    }, []);
    let id = 10;

    const handleClose = () => {
        console.log("called handleClose");
        reqGetClips();
        setShowModal(false);
    };

    if (clips && clips.length > 0) {
        return (
            <div className="row2">
                <VideoModal
                    showModal={showModal}
                    handleClose={handleClose}
                    videoUrl={videoUrl}
                    recordedAt={recordedAt}
                    recordId={props.recordId}
                    clipId={clipId}
                    tag={tag}
                    firstLoad={firstLoad}
                    refreshList={reqGetClips}
                    loadCallback={() => setFirstLoad(false)}
                />

                <h2 style={{ marginLeft: "20px", fontSize: "20px" }}>{props.recordTimeStartToEnd}</h2>

                <div className="row_posters">
                    {clips.map((clip) => (
                        <div>
                            <img
                                key={id++}
                                onClick={() => handleClick(clip)}
                                className={"row_poster row_posterLarge"}
                                src={clip.link}
                                alt={clip.recorded_at}
                            />
                            <div style={{ fontWeight: "600", textAlign: "center" }}>
                                녹화 시각 :{" "}
                                {`
                                ${clip.hour >= 10 ? clip.hour : "0" + clip.hour}:${
                                    clip.minute >= 10 ? clip.minute : "0" + clip.minute
                                }
                            `}
                            </div>
                            <div
                                className="HashWrapInner2"
                                hidden={!clip.tag || (clip.tag && clip.tag.length === 0)}
                                onClick={() => {
                                    props.tagClickCallback(clip.tag);
                                }}
                            >
                                {"#" + clip.tag}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return <div />;
    }
}

export default Row;
