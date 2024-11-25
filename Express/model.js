const format = require("pg-format");
const db = require("../db/connection");

const fetchAllTopics = async () => {
    const {rows} = await db.query(`select * from topics`);
    if (rows.length === 0) {
       return Promise.reject({status: 404, msg: "Not found"});
    }
    return rows;
}

module.exports = {fetchAllTopics};