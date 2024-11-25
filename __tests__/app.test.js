const endpointsJson = require("../endpoints.json");
const app = require("../Express/app");
const request = require("supertest");
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed')
const db = require('../db/connection')


beforeEach(() => {
    return seed(data);
})

afterAll(() => {
   return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
