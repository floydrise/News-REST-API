const {getTopics, postTopic} = require("../MVC/controller");
const topicsRouter = require('express').Router()

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;