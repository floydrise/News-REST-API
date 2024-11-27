const {getUsers, getUserByUsername} = require("../MVC/controller");
const usersRouter = require("express").Router()

usersRouter.get("/:username", getUserByUsername)
usersRouter.get("/", getUsers)

module.exports = usersRouter;