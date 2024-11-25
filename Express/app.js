const express = require("express");
const app = express();
const {getApi, getTopics} = require("./controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics)
app.all("*", (req, res) => {
    res.status(404).send({msg: "Not found"});
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
})

module.exports = app;