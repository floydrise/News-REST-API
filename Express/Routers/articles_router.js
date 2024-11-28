const { getAllArticles, getArticleByID, patchArticle, getCommentsByArticleID, postComment, postNewArticle, deleteArticle} = require("../MVC/controller");
const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postNewArticle);
articlesRouter.route("/:article_id").get(getArticleByID).patch(patchArticle).delete(deleteArticle);
articlesRouter.route("/:article_id/comments").get(getCommentsByArticleID).post(postComment);

module.exports = articlesRouter;