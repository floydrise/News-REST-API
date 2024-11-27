const {getTopics} = require("../MVC/controller");
const topicsRouter = require('express').Router()

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;