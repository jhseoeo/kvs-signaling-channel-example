<div id="top"></div>

<br />
<div align="center">
  <h2 align="center">KVS Signaling Channel Example</h2>

  <p align="center">
    An example of KVS WebRTC Signaling Channel
</div>

<br>

## About The Project

This is an example of KVS WebRTC Signaling Channel that creates a presigned channel on backend, so any credentials can be hidden from clients.

If you want more information(in Korean), you can get here:
<https://junhyuk0801.github.io/posts/post/Cloud/AWS/AWS%20Kinesis%20Video%20Streaming>

<br>

### Built with

-   [Node.js](https://nodejs.org/en/)
-   [amazon-kinesis-video-streams-webrtc-sdk-js](https://github.com/awslabs/amazon-kinesis-video-streams-webrtc-sdk-js)
-   Express (for backend)
-   React (for frontend)

<br>

## Getting Started

```bash
git clone https://github.com/junhyuk0801/aws-kvs-webtrtc-signaling-channel-example
cd aws-kvs-webtrtc-signaling-channel-example
cd Frontend
npm i
cd ../Backend
npm i
cd ..
```

### Start Backend

```bash
cd Backend
npm start
```

### Start Frontend

```bash
cd Frontend
npm start
```

Then connect <http://localhost:3000> with your browser and check how it works!
