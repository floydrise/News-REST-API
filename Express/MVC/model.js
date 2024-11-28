const format = require("pg-format");
const db = require("../../db/connection");
const _ = require("lodash");

const fetchAllTopics = async () => {
  const { rows } = await db.query(`select *
                                   from topics`);
  return rows;
};

const fetchArticleByID = async (article_id) => {
  const query = `SELECT articles.article_id,
                          articles.author,
                          articles.title,
                          articles.topic,
                          articles.created_at,
                          articles.votes,
                          articles.body,
                          articles.article_img_url,
                          COUNT(comments.article_id)::INT AS comment_count
                   FROM articles
                            left join comments
                                      ON comments.article_id = articles.article_id
                   where articles.article_id = $1
                   group by articles.article_id`;

  const { rows } = await db.query(query, [article_id]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
  return rows[0];
};

const fetchArticles = async (sort_by, order, topic, limit = 10, p = 1) => {
  const allowedSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const allowedOrders = ["asc", "desc"];
  let query = `SELECT articles.article_id,
                        articles.author,
                        articles.title,
                        articles.topic,
                        articles.created_at,
                        articles.votes,
                        articles.article_img_url,
                        COUNT(comments.article_id)::INT AS comment_count
                 FROM articles
                          LEFT JOIN comments
                                    ON comments.article_id = articles.article_id
    `;
  const queryValues = [];
  if (topic !== undefined) {
    query += ` where articles.topic=$1`;
    queryValues.push(topic);
  }

  query += ` group by articles.article_id`;

  if (!sort_by && !order) {
    query += ` order by created_at desc`;
  } else if (
    order &&
    sort_by &&
    allowedSorts.includes(sort_by) &&
    allowedOrders.includes(order)
  ) {
    query += ` order by ${sort_by} ${order}`;
  } else if (sort_by && allowedSorts.includes(sort_by) && order === undefined) {
    query += ` order by ${sort_by} desc`;
  } else if (order && allowedOrders.includes(order) && sort_by === undefined) {
    query += ` order by created_at ${order}`;
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const parsedLimit = Number(limit);
  const parsedPage = Number(p);

  if (isNaN(parsedLimit) || isNaN(parsedPage)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let countQuery = `SELECT COUNT(article_id)::INT AS total
                      FROM articles`;
  const countValues = [];
  let topics;
  if (topic !== undefined) {
    topics = await checkTopicExists(topic);
    countQuery += ` WHERE topic=$1`;
    countValues.push(topic);
  }
  const { rows: countRows } = await db.query(countQuery, countValues);
  const totalArticles = countRows[0].total;

  if (topics !== undefined) {
    if (parsedLimit > totalArticles && topics.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  } else {
    if (parsedLimit > totalArticles) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  }

  const offset = limit * (p - 1);
  query += ` limit ${limit} offset ${offset}`;

  const { rows } = await db.query(query, queryValues);
  return rows;
};

const checkTopicExists = async (topics) => {
  const { rows } = await db.query(
    `select *
         from topics
         where slug = $1`,
    [topics],
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Oops, does not exist yet" });
  }
  return rows;
};

const fetchComments = async (article_id, limit = 10, p = 1) => {
  let query = `select comments.comment_id,
                        comments.votes,
                        comments.created_at,
                        comments.author,
                        comments.body,
                        comments.article_id
                 from comments
                          join articles on articles.article_id = comments.article_id
                 where articles.article_id = $1
                 order by comments.created_at asc`;

  const parsedLimit = Number(limit);
  const parsePage = Number(p);

  if (isNaN(parsedLimit) || isNaN(parsePage)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const offset = limit * (p - 1);
  query += ` limit ${limit} offset ${offset}`;

  const { rows } = await db.query(query, [article_id]);
  if (parsePage > 1 && rows.length === 0) {
    return [];
  } else if (rows.length === 0) {
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
  const { rows } = await db.query(`select *
                                   from users`);
  if (rows.length === 0) return { msg: "No users yet" };
  return rows;
};

const fetchUsername = async (username) => {
  const { rows } = await db.query(
    `select *
         from users
         where username = $1`,
    [username],
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No such user found" });
  }
  return rows[0];
};

const uploadNewArticle = async (articleValues) => {
  const { rows } = await db.query(
    `insert into articles (author, title, body, topic)
         values ($1, $2, $3, $4)
         returning article_id`,
    articleValues,
  );
  return _.map(rows, "article_id")[0];
};

const updateComment = async (comment_id, inc_votes) => {
  const { rows } = await db.query(
    `update comments
         set votes = votes + $1
         where comment_id = $2
         returning *`,
    [inc_votes, comment_id],
  );
  return rows[0];
};

const createNewTopic = async (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({status: 400, msg: "Bad request"});
  }
  const { rows } = await db.query(`insert into topics (slug, description) values ($1, $2) returning *`, [slug, description])
  return rows[0];
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
  checkTopicExists,
  fetchUsername,
  uploadNewArticle,
  updateComment,
  createNewTopic
};
