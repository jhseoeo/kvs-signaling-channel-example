const express = require("express");
const path = require("path");
const { kinesis } = require("./util/kinesis");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", __dirname + "/pages");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(path.join(__dirname, "pages")));

app.get("/", (req, res) => {
    return res.status(200).send({
        message: "Hi there!",
    });
});

app.get("/kinesis", async (req, res) => {
    const response = await kinesis.createChannel("NewChannel", "MASTER");
    return res.status(200).json(response);
});

app.get("/test", async (req, res) => {
    return res.render("index.html");
});

app.listen(3000, () => {
    console.log("app running on port : 3000");
});
