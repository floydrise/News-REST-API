const express = require("express");
const app = express();
const apiRouter = require("./Routers/api_router")
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

//Error handling
app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Key is not present in table" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if ((err.code = "42702")) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status === 400 && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
