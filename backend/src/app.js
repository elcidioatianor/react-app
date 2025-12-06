const express = require("express");
const cors = require("cors");
const index = require("./routes/index");
const auth = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/index", index);
app.use("/auth", auth);

module.exports = app;
