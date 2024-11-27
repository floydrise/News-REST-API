const { getAllArticles, getArticleByID, patchArticle, getCommentsByArticleID, postComment} = require("../controller");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.route("/:article_id").get(getArticleByID).patch(patchArticle);
articlesRouter.route("/:article_id/comments").get(getCommentsByArticleID).post(postComment);
module.exports = articlesRouter;
