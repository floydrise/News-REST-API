const { getAllArticles, getArticleByID, patchArticle, getCommentsByArticleID, postComment, postNewArticle} = require("../MVC/controller");
const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postNewArticle);
articlesRouter.route("/:article_id").get(getArticleByID).patch(patchArticle);
articlesRouter.route("/:article_id/comments").get(getCommentsByArticleID).post(postComment);

module.exports = articlesRouter;