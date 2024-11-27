const {getApi} = require("../MVC/controller");
const apiRouter = require("express").Router();
const articlesRouter = require('./articles_router');
const topicsRouter = require("./topics_router")
const commentsRouter = require("./comments_router")
const usersRouter = require("./usersRouter");

apiRouter.use("/users", usersRouter);
apiRouter.use("/comments",commentsRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/articles", articlesRouter);
apiRouter.get("/", getApi);

module.exports = apiRouter;