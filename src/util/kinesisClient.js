import { SignalingClient } from "amazon-kinesis-video-streams-webrtc";

const ERROR_CODE = {
    OK: 0,
    NO_WEBCAM: 1,
    NOT_MASTER: 2,
    VIEWER_NOT_FOUND: 3,
    LOCAL_STREAM_NOT_FOUND: 4,
    NOT_FOUND_ANY: 5,
    ERROR: 6,
    UNKNOWN_ERROR: 7,
};

class CustomSigner {
    constructor(_url) {
        this.url = _url;
    }

    getSignedURL() {
        return this.url;
    }
}

class KinesisUtil {
    constructor() {}

    async initializeViewer(kinesisInfo, clientId) {
        const result = { errorCode: ERROR_CODE.UNKNOWN_ERROR };
        const role = "VIEWER";
        this.clientId = clientId;
        this.role = role;

        const configuration = kinesisInfo.configuration;

        if (this.signalingClient) {
            this.signalingClient.close();
            this.signalingClient = null;
        }

        this.signalingClient = new SignalingClient({
            requestSigner: new CustomSigner(kinesisInfo.url),
            role,
            clientId,
            region: "default",
            channelARN: "default",
            channelEndpoint: "default",
        });

        this.peerConnection = new RTCPeerConnection(configuration);

        this.signalingClient.on("open", async () => {});
        this.signalingClient.on("close", async () => {
            console.warn("Currnet signaling closed");
        });
        this.signalingClient.on("error", async (e) => {
            console.warn("SignalingClient error:", e);
        });

        this.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
            const peerConnection = new RTCPeerConnection(configuration);
            this.peerConnectionByClientId[remoteClientId] = peerConnection;
        });

        this.signalingClient.open();
        result.errorCode = ERROR_CODE.OK;
        return result;
    }

    async initializeMaster(kinesisInfo, localView, videoSize) {
        const result = { errorCode: ERROR_CODE.UNKNOWN_ERROR };
        const role = "MASTER";
        this.clientId = "MASTER_ID";
        this.role = role;
        this.peerConnectionByClientId = {};

        const configuration = kinesisInfo.configuration;

        this.signalingClient = new SignalingClient({
            requestSigner: new CustomSigner(kinesisInfo.url),
            role,
            region: "default",
            channelARN: "default",
            channelEndpoint: "default",
        });

        this.signalingClient.on("open", async () => {});
        this.signalingClient.on("close", async () => {
            console.warn("Currnet signaling closed");
        });
        this.signalingClient.on("error", async (e) => {
            console.warn("SignalingClient error:", e);
        });

        this.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
            const peerConnection = new RTCPeerConnection(configuration);
            this.peerConnectionByClientId[remoteClientId] = peerConnection;
        });
    }
}

export { KinesisUtil };
