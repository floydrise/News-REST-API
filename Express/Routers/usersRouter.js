const {getUsers} = require("../controller");
const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

module.exports = usersRouter;