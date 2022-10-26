import { useState } from "react";
import "./player.css";
const createSignalingChannel = require("../../lib/kinesis/createChannel");
const deleteSignalingChannel = require("../../lib/kinesis/deleteChannel");
const getSignalingChannelInfo = require("../../lib/kinesis/getChannelInfo");

/**
 * Role selector for clients - Master or Viewer
 * @returns {JSX.Element} Selector page
 */
function Selector() {
    let [channelName, setChannelName] = useState("");

    return (
        <div className="controllerPlane">
            <input
                placeholder="channel name"
                onChange={(e) => {
                    setChannelName(e.target.value);
                }}
            />
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    createSignalingChannel(channelName);
                }}
            >
                Create Channel
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={async () => {
                    const info = await getSignalingChannelInfo(channelName, "VIEWER");
                    console.log(info);
                }}
            >
                Get Channel Info
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    deleteSignalingChannel(channelName);
                }}
            >
                Delete Channel
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={() => {
                    window.location.href = "/master/" + channelName;
                }}
            >
                Connect Master
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={async () => {
                    window.location.href = "/viewer/" + channelName;
                }}
            >
                Connect Viewer
            </button>
            <br />
            <button
                className="channel-button"
                type="button"
                onClick={async () => {
                    window.location.href = "/recorder/";
                }}
            >
                Connect Recoder
            </button>
        </div>
    );
}

export default Selector;
