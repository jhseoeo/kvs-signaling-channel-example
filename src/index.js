const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const WebRTCChannelRouter = require("./routes/Channels");
const AuthenticateRouter = require("./routes/Auth");
const ClipsRouter = require("./routes/Clips");
require("./models").sequelize.sync();
require("dotenv").config();

const app = express();
const options = {
    key: fs.readFileSync("./keys/key.pem", "utf-8"),
    cert: fs.readFileSync("./keys/cert.pem", "utf-8"),
    passphrase: process.env.HTTPS_PASSPHRASE,
    rejectUnauthorized: false,
};

app.use(cors());
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    return res.status(200).send({
        message: "Hi there!",
    });
});

app.use("/channel", WebRTCChannelRouter);
app.use("/auth", AuthenticateRouter);
app.use("/clips", ClipsRouter);

const server = https.createServer(options, app);

server.listen(8484, () => {
    console.log("app running on port : 8484");
});
