import { useRef } from "react";
import {
    getRecordsList,
    deleteRecord,
    uploadClip,
    getClips,
    getClip,
    setClipTag,
    searchClipByTag,
    deleteClip,
} from "../../lib/clips";

function Clips(props) {
    const getClips_recordid = useRef();
    const deleteRecord_recordid = useRef();

    const getClip_recordid = useRef();
    const getClip_clipid = useRef();

    const setClipTag_recordid = useRef();
    const setClipTag_clipid = useRef();
    const setClipTag_tag = useRef();

    const searchClipByTag_tag = useRef();

    const deleteClip_recordid = useRef();
    const deleteClip_clipid = useRef();

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div>
                get Records List&nbsp;
                <button
                    onClick={() => {
                        getRecordsList().then((x) => console.log(x));
                    }}
                >
                    getRecordsList
                </button>
            </div>
            <br />
            <div>
                delete Record&nbsp;
                <input style={{ border: "1px solid black" }} ref={deleteRecord_recordid} placeholder="record id" />
                <button
                    onClick={() => {
                        const recordid = Number(deleteRecord_recordid.current.value);
                        deleteRecord(recordid).then((x) => console.log(x));
                    }}
                >
                    deleteRecord
                </button>
            </div>
            <br />
            <div>
                get clips&nbsp;
                <input style={{ border: "1px solid black" }} ref={getClips_recordid} placeholder="record id" />
                <button
                    onClick={() => {
                        const recordid = Number(getClips_recordid.current.value);
                        getClips(recordid).then((x) => console.log(x));
                    }}
                >
                    getClips
                </button>
            </div>
            <br />
            <div>
                get clip&nbsp;
                <input style={{ border: "1px solid black" }} ref={getClip_recordid} placeholder="recordid" />
                <input style={{ border: "1px solid black" }} ref={getClip_clipid} placeholder="clipid" />
                <button
                    onClick={() => {
                        const recordid = getClip_recordid.current.value;
                        const clipid = getClip_clipid.current.value;
                        getClip(recordid, clipid).then((x) => console.log(x));
                    }}
                >
                    getClip
                </button>
            </div>
            <br />
            <div>
                upload clips[사용하지 마세요]&nbsp;
                <input
                    type="file"
                    onChange={(e) => {
                        uploadClip(e.target.files[0]).then((x) => console.log(x));
                    }}
                />
            </div>
            <br />
            <div>
                set clip tag&nbsp;
                <input style={{ border: "1px solid black" }} ref={setClipTag_recordid} placeholder="recordid" />
                <input style={{ border: "1px solid black" }} ref={setClipTag_clipid} placeholder="clipid" />
                <input style={{ border: "1px solid black" }} ref={setClipTag_tag} placeholder="tag" />
                <button
                    onClick={() => {
                        const recordid = setClipTag_recordid.current.value;
                        const clipid = setClipTag_clipid.current.value;
                        const tag = setClipTag_tag.current.value;
                        setClipTag(recordid, clipid, tag).then((x) => console.log(x));
                    }}
                >
                    setClipTag
                </button>
            </div>
            <br />
            <div>
                search clip by tag&nbsp;
                <input style={{ border: "1px solid black" }} ref={searchClipByTag_tag} placeholder="tag" />
                <button
                    onClick={() => {
                        const tag = searchClipByTag_tag.current.value;
                        searchClipByTag(tag).then((x) => console.log(x));
                    }}
                >
                    searchClipByTag
                </button>
            </div>
            <br />
            <div>
                delete clip&nbsp;
                <input style={{ border: "1px solid black" }} ref={deleteClip_recordid} placeholder="record id" />
                <input style={{ border: "1px solid black" }} ref={deleteClip_clipid} placeholder="clip id" />
                <button
                    onClick={() => {
                        const recordid = deleteClip_recordid.current.value;
                        const clipid = deleteClip_clipid.current.value;
                        deleteClip(recordid, clipid).then((x) => console.log(x));
                    }}
                >
                    deleteClip
                </button>
            </div>
        </div>
    );
}

export default Clips;
