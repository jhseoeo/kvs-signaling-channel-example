import getRecordsList from "../../lib/clips/getRecordsList";
import uploadClip from "../../lib/clips/uploadClip";

function Clips(props) {
    return (
        <div>
            <button
                onClick={() => {
                    getRecordsList().then((x) => console.log(x));
                }}
            >
                getRecordsList
            </button>
            <button>getClips</button>
            <input
                type="file"
                onChange={(e) => {
                    uploadClip(e.target.files[0]).then((x) => console.log(x));
                }}
            />
        </div>
    );
}

export default Clips;
