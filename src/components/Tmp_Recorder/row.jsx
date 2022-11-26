import React, { useEffect, useState } from 'react';
import "./row.css";
import getClips from "../../lib/clips/getClips";
import VideoModal from "../videoModal";


// clips : {
// "recorded_at": "2022-11-17T15:56:39.596Z",
// "link": "https://dogibogi-laptop.s3.ap-northeast-2.amazonaws.com/3/49/2022-11-18-0%3A56%3A39.webm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV6AMEL465PKO6YAE%2F20221123%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20221123T112829Z&X-Amz-Expires=3600&X-Amz-Signature=e70b925fc36bedc0cfb6ead2ccf041f164a48e66499e674b814cb11e1f982b9f&X-Amz-SignedHeaders=host"

function Row(props) {
    const [videoUrl, setVideoUrl] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [clips, setClips] = useState([
        {
            recorded_at: "",
            link: "",
            thumbNail: ""
        }
    ]);
    
    const handleClick = (clip) => {
        // 영상 팝업으로 실행
        setVideoUrl(clip.link)
        // setShowModal(true)
        setShowModal(clip.link.length > 0)
    };



    let flag = 45934
    useEffect(() => {
        (async () => {
            getClips(props.recordId).then((result) => {
                console.log(props.recordId)
                console.log("getClips()")
                console.log(result)
                
                // 썸네일
        
                // 받아온 클립들 저장 

                let tempList = []
                if (result.videoDatas) {
                    tempList = result.videoDatas
                }
                for (let i = 0; i < 20; i++) {
                    tempList.push({
                        recorded_at: "",
                        link: "",
                        thumbNail: ""
                    })
                }
                setClips(tempList)

                // setClips(result.videoDatas)
            });
        })();
        // eslint-disable-next-line
    }, []);
    let id = 10

    {if (clips && clips.length > 0) {
        return (
                
            <div className="row2" >
                <VideoModal
                    showModal={showModal}
                    handleClose={() => { setShowModal(false) }}
                    url={videoUrl}                
                />

                <h2 style={{marginLeft:"20px", fontSize:"20px"}}>{props.recordTimeStartToEnd}</h2>
    
                <div className="row_posters">
                
                {clips.map(clip => (
                    <img
                        key={id++}
                        onClick={() => handleClick(clip)}
                        className={"row_poster row_posterLarge"}
                        src='img/testpicture.jpeg'
                        // src={clip.thumbNail} 
                        alt={clip.recorded_at} 
                    />
                ))}
                </div>
            </div>
        )
    } else {
        return (<div/>)
    }}
    
}

export default Row
