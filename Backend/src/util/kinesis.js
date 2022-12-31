const kinesisVideo = require("aws-sdk/clients/kinesisvideo");
const SigV4RequestSigner = require("amazon-kinesis-video-streams-webrtc").SigV4RequestSigner;
const KinesisVideoSignalingChannels = require("aws-sdk/clients/kinesisvideosignalingchannels");
require("dotenv").config();

// Rquest Timeout Message
const REQUEST_TIMEOUT_VALUE = "REQUEST TIMED OUT!";

// Request Timeout Time
const REQUEST_TIMEOUT = 15 * 1000;

// Promise resolved after given time passes
const requestTimeout = (time, value) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value);
        }, time);
    });
};

class KinesisUtil {
    constructor() {
        // AWS IAM Credential Data
        this.credential = {
            region: process.env.KINESIS_REGION,
            accessKeyId: process.env.KINESIS_ACCESS_KEY_ID,
            secretAccessKey: process.env.KINESIS_SECRET_ACCESS_KEY,
        };

        if (!this.kinesisClient) {
            try {
                this.kinesisClient = new kinesisVideo({ ...this.credential });
            } catch (err) {
                console.error("An error is occured creating Kinesis Client", err.message);
            }
        }
    }

    /**
     * Creates channel
     * @param {string} ChannelName - Name of the channel
     * @param {string} role - Role of the channel
     * @param {string} clientId - Id of peer. Only vewer needs it
     * @returns {{errorCode:number}} An object contains information about request, which includes Error Code
     */
    async createChannel(ChannelName, role = "VIEWER", clientId = null) {
        try {
            const result = { errorCode: 400 };
            // CHECK IF THE CHANNEL ALREADY EXISTS
            const list = await this.kinesisClient
                .listSignalingChannels({
                    ChannelNameCondition: {
                        ComparisonOperator: "BEGINS_WITH",
                        ComparisonValue: ChannelName,
                    },
                    MaxResults: 1,
                })
                .promise();

            if (list.ChannelInfoList.length) {
                // CHANNEL ALREADY EXISTS
                console.warn("Channel already exists:", ChannelName);
            } else {
                // CREATE NEW CHANNEL
                await this.kinesisClient.createSignalingChannel({ ChannelName }).promise();
            }

            const describeSignalingChannelResponse = await this.kinesisClient
                .describeSignalingChannel({ ChannelName })
                .promise();
            const channelInfo = describeSignalingChannelResponse.ChannelInfo;

            const endpointsByProtocol = await this.listEndpoints(channelInfo.ChannelARN, role);
            if (!endpointsByProtocol) {
                result.errorCode = 404;
                return result;
            }

            const iceServers = await this.listICEServers(channelInfo.ChannelARN, endpointsByProtocol.HTTPS);
            if (!iceServers) {
                result.errorCode = 404;
                return result;
            }

            const configuration = {
                iceServers,
                iceTransportPolicy: "all",
            };

            let queryParams = {
                "X-Amz-ChannelARN": channelInfo.ChannelARN,
            };
            if (clientId) {
                queryParams = {
                    ...queryParams,
                    "X-Amz-ClientId": clientId,
                };
            }

            const signer = new SigV4RequestSigner(process.env.KINESIS_REGION, this.credential);
            const url = await signer.getSignedURL(endpointsByProtocol.WSS, queryParams);
            console.log("Kinesis created channel ARN:", channelInfo.ChannelARN);
            const response = { configuration, url, role };
            return response;
        } catch (err) {
            console.error("An error is occured creating channel", err.message);
        }

        return result;
    }

    async listEndpoints(channelARN, role) {
        const getSignalingChannelEndpoint = this.kinesisClient
            .getSignalingChannelEndpoint({
                ChannelARN: channelARN,
                SingleMasterChannelEndpointConfiguration: {
                    Protocols: ["WSS", "HTTPS"],
                    Role: role,
                },
            })
            .promise();

        const getSignalingChannelEndpointResponse = await Promise.race([
            getSignalingChannelEndpoint,
            requestTimeout(REQUEST_TIMEOUT, REQUEST_TIMEOUT_VALUE),
        ]);

        if (getSignalingChannelEndpointResponse === REQUEST_TIMEOUT_VALUE) {
            console.error("getSignalingChannelEndpoint timeout!");
            return null;
        }

        const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce(
            (endpoints, endpoint) => {
                endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
                return endpoints;
            },
            {}
        );

        return endpointsByProtocol;
    }

    async listICEServers(channelARN, endpoint) {
        const KinesisVideoSignalingChannelsClient = new KinesisVideoSignalingChannels({
            ...this.credential,
            endpoint,
            correctClockSkew: true,
        });

        const getIceServerConfig = KinesisVideoSignalingChannelsClient.getIceServerConfig({
            ChannelARN: channelARN,
        }).promise();

        const getIceServerConfigResponse = await Promise.race([
            getIceServerConfig,
            requestTimeout(REQUEST_TIMEOUT, REQUEST_TIMEOUT_VALUE),
        ]);

        if (getIceServerConfigResponse === REQUEST_TIMEOUT_VALUE) {
            console.error("getIceServerConfigResponse timeout!");
            return null;
        }

        const iceServers = [];
        getIceServerConfigResponse.IceServerList.forEach((iceServer) =>
            iceServers.push({
                urls: iceServer.Uris,
                username: iceServer.Username,
                credential: iceServer.Password,
            })
        );

        return iceServers;
    }

    async getChannelInfo(ChannelName, role, clientId = null) {
        const describeSignalingChannelResponse = await this.kinesisClient
            .describeSignalingChannel({ ChannelName })
            .promise();
        const channelInfo = describeSignalingChannelResponse.ChannelInfo;

        const endpointsByProtocol = await this.listEndpoints(channelInfo.ChannelARN, role);
        if (!endpointsByProtocol) {
            result.errorCode = 404;
            return result;
        }

        const iceServers = await this.listICEServers(channelInfo.ChannelARN, endpointsByProtocol.HTTPS);
        if (!iceServers) {
            result.errorCode = 404;
            return result;
        }

        const configuration = {
            iceServers,
            iceTransportPolicy: "all",
        };

        let queryParams = {
            "X-Amz-ChannelARN": channelInfo.ChannelARN,
        };
        if (clientId) {
            queryParams = {
                ...queryParams,
                "X-Amz-ClientId": clientId,
            };
        }

        const signer = new SigV4RequestSigner(process.env.KINESIS_REGION, this.credential);
        const url = await signer.getSignedURL(endpointsByProtocol.WSS, queryParams);
        const response = { configuration, url, role };
        return response;
    }

    async deleteChannel(ChannelName) {
        const describeSignalingChannelResponse = await this.kinesisClient
            .describeSignalingChannel({ ChannelName })
            .promise();
        const ChannelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;

        try {
            await this.kinesisClient.deleteSignalingChannel({ ChannelARN }).promise();
        } catch (err) {
            console.error("An error is occured deleting channel", err.message);
        }
    }
}

module.exports = new KinesisUtil();
