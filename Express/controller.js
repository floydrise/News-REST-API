const endpointsJSON = require("../endpoints.json");
const {
  fetchAllTopics,
  fetchArticleByID,
  fetchArticles,
  fetchComments,
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
    const articles = await fetchArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

const getCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const comments = await fetchComments(article_id);
    res.status(200).send({ comments });
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
};
