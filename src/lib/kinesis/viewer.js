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
 * Start WebRTC Connection for Viewer side.
 * @param {object} kinesisInfo - Information about KInesis
 * @param {HTMLVideoElement} localView - HTML Video Player that displays Webcam view of master
 * @param {function(string)} onStatsReport - callback function to inform current stat of webrtc connection
 * @return {function():void} close function that sends connection termination signal to another peer
 */
async function startViewer(kinesisInfo, remoteView, pollConnection, onConnectionEnd) {
    const role = "VIEWER";
    this.clientId = "strong";

    const configuration = kinesisInfo.configuration;

    if (this.signalingClient) {
        this.signalingClient.close();
        this.signalingClient = null;
    }

    this.signalingClient = new SignalingClient({
        requestSigner: new CustomSigner(kinesisInfo.url),
        role,
        clientId: this.clientId,
        region: "default",
        channelARN: "default",
        channelEndpoint: "default",
    });

    this.peerConnection = new RTCPeerConnection(configuration);
    this.peerConnectionStatsInterval = setInterval(() => this.peerConnection.getStats().then(pollConnection), 1000);

    this.dataChannel = this.peerConnection.createDataChannel("kvsDataChannel");
    this.peerConnection.ondatachannel = (e) => {
        e.channel.onmessage = (msg) => {
            if (msg.data === "done") onConnectionEnd();
        };
        this.dataChannel.send("open");
    };

    this.signalingClient.on("open", async () => {
        console.log("[VIEWER] Connected to signaling service");

        // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
        // If no video/audio needed, no need to request for the sources.
        // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
        // try {
        //     this.localStream = await navigator.mediaDevices.getUserMedia({
        //         video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        //         // video: false,
        //         audio: false,
        //     });
        //     this.localStream.getTracks().forEach((track) => this.peerConnection.addTrack(track, this.localStream));
        //     localView.srcObject = this.localStream;
        // } catch (e) {
        //     console.error("[VIEWER] Could not find webcam");
        //     return;
        // }

        // Create an SDP offer to send to the master
        console.log("[VIEWER] Creating SDP offer");
        await this.peerConnection.setLocalDescription(
            await this.peerConnection.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: true,
            })
        );

        // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        console.log("[VIEWER] Sending SDP offer");
        this.signalingClient.sendSdpOffer(this.peerConnection.localDescription);
        console.log("[VIEWER] Generating ICE candidates");
    });

    this.signalingClient.on("sdpAnswer", async (answer) => {
        // Add the SDP answer to the peer connection
        console.log("[VIEWER] Received SDP answer");
        await this.peerConnection.setRemoteDescription(answer);
    });

    this.signalingClient.on("iceCandidate", (candidate) => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.log("[VIEWER] Received ICE candidate");
        this.peerConnection.addIceCandidate(candidate);
    });

    this.signalingClient.on("close", () => {
        console.log("[VIEWER] Disconnected from signaling channel");
    });

    this.signalingClient.on("error", (error) => {
        console.error("[VIEWER] Signaling client error: ", error);
    });

    // Send any ICE candidates to the other peer
    this.peerConnection.addEventListener("icecandidate", ({ candidate }) => {
        if (candidate) {
            console.log("[VIEWER] Generated ICE candidate");

            // When trickle ICE is enabled, send the ICE candidates as they are generated.
            console.log("[VIEWER] Sending ICE candidate");
            this.signalingClient.sendIceCandidate(candidate);
        } else {
            console.log("[VIEWER] All ICE candidates have been generated");

            // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
            // console.log("[VIEWER] Sending SDP offer");
            // this.signalingClient.sendSdpOffer(this.peerConnection.localDescription);
        }
    });

    // As remote tracks are received, add them to the remote view
    this.peerConnection.addEventListener("track", (event) => {
        console.log("[VIEWER] Received remote track");
        if (remoteView.srcObject) {
            return;
        }
        this.remoteStream = event.streams[0];
        remoteView.srcObject = this.remoteStream;
    });

    console.log("[VIEWER] Starting viewer connection");
    this.signalingClient.open();

    // close function that sends connection termination signal to master
    return () => {
        this.dataChannel.send("close");
    };
}

module.exports = startViewer;
