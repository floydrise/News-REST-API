const {getUsers} = require("../MVC/controller");
const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

module.exports = usersRouter;