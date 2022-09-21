const express = require("express");
const path = require("path");
const kinesisRouter = require("./routes/kinesis");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
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

app.use("/kinesis", kinesisRouter);

app.get("/test", async (req, res) => {
    return res.render("test.html");
});

app.listen(3000, () => {
    console.log("app running on port : 3000");
});
