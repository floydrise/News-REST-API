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
                                   FROM articles /*^casting as I was getting article_id in string format^*/
                                            LEFT JOIN
                                        comments
                                        ON
                                            comments.article_id = articles.article_id
                                   GROUP BY articles.article_id
                                   ORDER BY articles.created_at DESC;
    `);
  return rows;
};

const fetchComments = async (article_id) => {
  const { rows } = await db.query(
    `select comments.comment_id,
                comments.votes,
                comments.created_at,
                comments.author,
                comments.body,
                comments.article_id
         from comments
                  join articles on articles.article_id = comments.article_id
         where articles.article_id = $1
         group by comment_id
         order by comments.created_at asc`,
    [article_id],
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return rows;
};

const uploadNewComment = async (article_id, newComment) => {
  const commentValues = Object.values(newComment);
  commentValues.push(article_id);
  const { rows } = await db.query(
    `insert into comments (author, body, article_id)
         values ($1, $2, $3)
         returning *`,
    commentValues,
  );
  return rows[0];
};

const updateArticle = async (article_id, inc_votes) => {
  const { rows } = await db.query(
    `update articles
         set votes = votes + $1
         where article_id = $2
         returning *`,
    [inc_votes, article_id],
  );
  return rows[0];
};

const removeComment = async (comment_id) => {
  return db.query(
    `delete
         from comments
         where comment_id = $1`,
    [comment_id],
  );
};

const fetchCommentByID = async (comment_id) => {
  const { rows } = await db.query(
    `select *
         from comments
         where comment_id = $1`,
    [comment_id],
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

const fetchAllUsers = async () => {
    const {rows} = await db.query(`select * from users`);
    if (rows.length === 0) return { msg: "No users yet" };
    return rows;
};

module.exports = {
  fetchAllTopics,
  fetchArticleByID,
  fetchArticles,
  fetchComments,
  uploadNewComment,
  updateArticle,
  removeComment,
  fetchCommentByID,
  fetchAllUsers,
};
