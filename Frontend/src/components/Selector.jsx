import { useRef } from "react";
import "./player.css";
const createSignalingChannel = require("../lib/kinesis/createChannel");
const deleteSignalingChannel = require("../lib/kinesis/deleteChannel");

function Selector() {
    const channelName = useRef();

    return (
        <div className="controllerPlane">
            <input placeholder="channel name" ref={channelName} />
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    createSignalingChannel(channelName.current.value);
                }}
            >
                Create Channel
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    deleteSignalingChannel(channelName.current.value);
                }}
            >
                Delete Channel
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    window.location.href = "/master/" + channelName.current.value;
                }}
            >
                Connect Master
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={async () => {
                    window.location.href = "/viewer/" + channelName.current.value;
                }}
            >
                Connect Viewer
            </button>
        </div>
    );
}

export default Selector;
