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

const fetchArticles = async () => {
  const { rows } = await db.query(`SELECT articles.article_id,
                                          articles.author,
                                          articles.title,
                                          articles.topic,
                                          articles.created_at,
                                          articles.votes,
                                          articles.article_img_url,
                                          COUNT(comments.article_id)::INT AS comment_count
                                   FROM articles
                                            LEFT JOIN
                                        comments
                                        ON
                                            comments.article_id = articles.article_id
                                   GROUP BY articles.article_id
                                   ORDER BY articles.created_at DESC;
    `);
  return rows;
};
module.exports = { fetchAllTopics, fetchArticleByID, fetchArticles };
