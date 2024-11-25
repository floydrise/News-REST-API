const endpointsJSON = require("../endpoints.json");
const { fetchAllTopics, fetchArticleByID } = require("./model");

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
    res.status(200).send({article});
  } catch (err) {
    next(err);
  }
};
module.exports = { getApi, getTopics, getArticleByID };
