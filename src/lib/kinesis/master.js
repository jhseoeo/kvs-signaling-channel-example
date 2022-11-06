const SignalingClient = require("amazon-kinesis-video-streams-webrtc").SignalingClient;

class CustomSigner {
    constructor(_url) {
        this.url = _url;
    }

    getSignedURL() {
        return this.url;
    }
}

/**
 * Start WebRTC Connection for Master side.
 * @param {object} kinesisInfo - Information about KInesis
 * @param {HTMLVideoElement} localView - HTML Video Player that displays Webcam view of master
 * @param {function(string)} onStatsReport - callback function to inform current stat of webrtc connection
 * @return {function():void} close function that sends connection termination signal to another peer
 */
async function startMaster(kinesisInfo, localStream, onStatsReport) {
    const role = "MASTER";
    this.clientId = null;
    this.role = role;
    this.peerConnectionByClientId = {};
    this.localStream = localStream;

    const configuration = kinesisInfo.configuration;

    this.signalingClient = new SignalingClient({
        requestSigner: new CustomSigner(kinesisInfo.url),
        role,
        region: "default",
        channelARN: "default",
        channelEndpoint: "default",
    });

    this.peerConnection = new RTCPeerConnection(configuration);

    // Get a stream from the webcam and display it in the local view.
    // If no video/audio needed, no need to request for the sources.
    // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.

    this.signalingClient.on("open", async () => {
        console.log("[MASTER] Connected to signaling service");
    });

    this.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
        console.log("[MASTER] Received SDP offer from client: " + remoteClientId);

        // Create a new peer connection using the offer from the given client
        const peerConnection = new RTCPeerConnection(configuration);
        this.peerConnectionByClientId[remoteClientId] = peerConnection;

        // Poll for connection stats
        if (!this.peerConnectionStatsInterval) {
            this.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000);
        }

        // Send any ICE candidates to the other peer
        peerConnection.addEventListener("icecandidate", ({ candidate }) => {
            if (candidate) {
                console.log("[MASTER] Generated ICE candidate for client: " + remoteClientId);

                // When trickle ICE is enabled, send the ICE candidates as they are generated.
                console.log("[MASTER] Sending ICE candidate to client: " + remoteClientId);
                this.signalingClient.sendIceCandidate(candidate, remoteClientId);
            } else {
                console.log("[MASTER] All ICE candidates have been generated for client: " + remoteClientId);

                // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
                // console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);
                // this.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
            }
        });

        // As remote tracks are received, add them to the remote view
        // peerConnection.addEventListener("track", (event) => {
        //     console.log("[MASTER] Received remote track from client: " + remoteClientId);
        //     if (remoteView.srcObject) {
        //         return;
        //     }
        //     remoteView.srcObject = event.streams[0];
        // });

        // If there's no video/audio, this.localStream will be null. So, we should skip adding the tracks from it.
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, this.localStream));
        }
        await peerConnection.setRemoteDescription(offer);

        // Create an SDP answer to send back to the client
        console.log("[MASTER] Creating SDP answer for client: " + remoteClientId);
        await peerConnection.setLocalDescription(
            await peerConnection.createAnswer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
            })
        );

        // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);
        this.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
        console.log("[MASTER] Generating ICE candidates for client: " + remoteClientId);
    });

    this.signalingClient.on("iceCandidate", async (candidate, remoteClientId) => {
        console.log("[MASTER] Received ICE candidate from client: " + remoteClientId);

        // Add the ICE candidate received from the client to the peer connection
        const peerConnection = this.peerConnectionByClientId[remoteClientId];
        peerConnection.addIceCandidate(candidate);
    });

    this.signalingClient.on("close", () => {
        console.log("[MASTER] Disconnected from signaling channel");
    });

    this.signalingClient.on("error", () => {
        console.error("[MASTER] Signaling client error");
    });

    console.log("[MASTER] Starting master connection");
    this.signalingClient.open();

    // close function that sends connection termination signal to another peer
    return () => {};
}

module.exports = startMaster;
