import Modal from "react-bootstrap/Modal";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import "./videoModal.css";
import moment from "moment";
import setClipTag from "../lib/clips/setClipTag";
import CloseButton from "react-bootstrap/CloseButton";

export default function VideoModal(props) {
    // onChange로 관리할 문자열
    const [hashtag, setHashtag] = useState("");
    // 저장된 해시 태그
    const [savedHashTag, setSavedHashtag] = useState("");

    const onKeyUp = useCallback(
        (e) => {
            if (process.browser) {
                /* enter 키 코드 :13 */
                if (e.keyCode === 13 && e.target.value.trim() !== "" && savedHashTag.length === 0) {
                    console.log("Enter Key 입력됨!", e.target.value);
                    setSavedHashtag(e.target.value);
                    console.log(savedHashTag);
                    setHashtag("");
                }
            }
        },
        // eslint-disable-next-line
        [hashtag, savedHashTag]
    );

    const onTagClick = () => {
        setSavedHashtag("");
    };

    const onChangeHashtag = (e) => {
        setHashtag(e.target.value);
    };

    // eslint-disable-next-line
    useEffect(() => {
        if (props.tag && props.firstLoad) {
            console.log("tag");
            console.log(props.tag);
            setSavedHashtag(props.tag);
            props.loadCallback();
        }
    });

    const handleClose = () => {
        let tag = savedHashTag;

        if (tag.length === 0) {
            tag = null;
        }

        setClipTag(props.recordId, props.clipId, tag)
            .then((result) => {
                console.log(`${tag} setClipTag called`);
                console.log(result);
            })
            .catch((err) => console.log(err));
        setSavedHashtag("");
        setHashtag("");
        props.handleClose();
    };

    return (
        <Modal
            show={props.showModal}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{`${moment(props.recordedAt).format("LT")}`}</Modal.Title>
                {/* <Modal.Title>{props.recordedAt}</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
                <video controls autoPlay={true} width={"100%"} height={"100%"}>
                    <source src={props.videoUrl} type="video/webm"></source>
                </video>

                <div className="HashWrap">
                    <div className="HashWrapOuter">
                        <div className="HashWrapInner" hidden={savedHashTag.length === 0} onClick={onTagClick}>
                            {"#" + savedHashTag} <CloseButton className="HashWrapCancel" />
                        </div>
                    </div>
                    <input
                        hidden={savedHashTag.length !== 0}
                        className="HashInput"
                        type="text"
                        value={hashtag}
                        onChange={onChangeHashtag}
                        onKeyUp={onKeyUp}
                        placeholder="#해시태그 입력"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}
