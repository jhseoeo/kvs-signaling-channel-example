import Modal from "react-bootstrap/Modal";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import "./videoModal.css";
import setClipTag from "../lib/clips/setClipTag";
import deleteClip from "../lib/clips/deleteClip";
import CloseButton from "react-bootstrap/CloseButton";
import { MdOutlineDeleteOutline } from "react-icons/md";

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
        props.refreshList();
    };

    const DeleteClip = async () => {
        if (window.confirm("클립을 삭제하시겠습니까?")) {
            const res = await deleteClip(props.recordId, props.clipId).catch((err) => {
                console.error(err);
            });
            if (res.statusCode === 200) {
                alert("클립이 삭제되었습니다!");
                props.refreshList();
                return;
            } else {
                alert("클립 삭제 중 에러가 발생하였습니다");
                console.error(res.message);
            }
        }
    };

    return (
        <Modal
            show={props.showModal}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <video controls autoPlay={true} width={"100%"} height={"100%"}>
                    <source src={props.videoUrl} type="video/webm"></source>
                </video>
                <div className="HashWrap">
                    <div className="HashWrapOuter" hidden={savedHashTag.length === 0}>
                        <div className="HashWrapInner" onClick={onTagClick}>
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
                    <div className="ClipDelete" onClick={DeleteClip}>
                        <MdOutlineDeleteOutline style={{ width: "24pt", height: "24pt" }} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
