const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const WebRTCChannelRouter = require("./routes/Channels");
require("dotenv").config();

const app = express();

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

app.listen(8484, () => {
    console.log("app running on port : 8484");
});
