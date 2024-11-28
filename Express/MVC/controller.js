const endpointsJSON = require("../../endpoints.json");
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
  checkTopicExists,
  fetchUsername,
  uploadNewArticle,
  updateComment,
  createNewTopic,
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
  const { sort_by, order, topic, limit, p } = req.query;
  try {
    let articles;
    if (topic === undefined) {
      articles = await fetchArticles(sort_by, order, topic, limit, p);
    } else {
      [_, articles] = await Promise.all([
        checkTopicExists(topic),
        fetchArticles(sort_by, order, topic, limit),
      ]);
    }
    const total_count = articles.length;
    res.status(200).send({ articles, total_count });
  } catch (err) {
    next(err);
  }
};

const getCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  try {
    const [_, comments] = await Promise.all([
      fetchArticleByID(article_id),
      fetchComments(article_id, limit, p),
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

const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

const postNewArticle = async (req, res, next) => {
  const { author, title, body, topic } = req.body;
  const articleValues = [author, title, body, topic];
  try {
    const articleID = await uploadNewArticle(articleValues);
    const article = await fetchArticleByID(articleID);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

const patchComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  try {
    const comment = await updateComment(comment_id, inc_votes);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

const postTopic = async (req, res, next) => {
  const { slug, description } = req.body;
  try {
    const topic = await createNewTopic(slug, description);
    res.status(200).send({ topic });
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
  getUserByUsername,
  postNewArticle,
  patchComment,
  postTopic,
};
