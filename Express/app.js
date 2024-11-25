const express = require("express");
const app = express();
const {getApi} = require("./controller");

app.get("/api", getApi);

module.exports = app;