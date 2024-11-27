const {getApi} = require("./MVC/controller");
const apiRouter = require("express").Router();
const articlesRouter = require('./Routers/articles_router');
const topicsRouter = require("./Routers/topics_router")
const commentsRouter = require("./Routers/comments_router")
const usersRouter = require("./Routers/usersRouter");

apiRouter.use("/users", usersRouter);
apiRouter.use("/comments",commentsRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/articles", articlesRouter);
apiRouter.get("/", getApi);

module.exports = apiRouter;