const {getTopics} = require("../controller");
const topicsRouter = require('express').Router()

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;