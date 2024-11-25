const format = require("pg-format");
const db = require("../db/connection");

const fetchAllTopics = async () => {
  const { rows } = await db.query(`select *
                                   from topics`);
  return rows;
};

const fetchArticleByID = async (article_id) => {
  const { rows } = await db.query(
    `select *
                                   from articles
                                   where article_id = $1`,
    [article_id],
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
  return rows[0];
};

module.exports = { fetchAllTopics, fetchArticleByID };
