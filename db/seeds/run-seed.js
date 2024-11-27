const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = async () => {
  try {
    await seed(devData);
    console.log("Seed successful");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    db.end();
  }
};

runSeed();
