const endpointsJSON = require("../endpoints.json");
const {
  fetchAllTopics,
  fetchArticleByID,
  fetchArticles,
  fetchComments,
  uploadNewComment,
  updateArticle,
  removeComment,
  fetchCommentByID,
  fetchAllUsers,
} = require("./model");

const getApi = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJSON });
};

const getTopics = async (req, res, next) => {
  try {
    const topics = await fetchAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

const getArticleByID = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await fetchArticleByID(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    const { sort_by, order } = req.query;
    const articles = await fetchArticles(sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const [_, comments] = await Promise.all([
      fetchArticleByID(article_id),
      fetchComments(article_id),
    ]);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    const comment = req.body;
    const { article_id } = req.params;
    const [_, newComment] = await Promise.all([
      fetchArticleByID(article_id),
      uploadNewComment(article_id, comment),
    ]);
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};

const patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const [_, article] = await Promise.all([
      fetchArticleByID(article_id),
      updateArticle(article_id, inc_votes),
    ]);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await Promise.all([
      fetchCommentByID(comment_id),
      removeComment(comment_id),
    ]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getApi,
  getTopics,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleID,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
};
