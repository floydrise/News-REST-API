const endpointsJson = require("../endpoints.json");
const app = require("../Express/app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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

describe("GET /api/topics", () => {
  it("should respond with status 200 and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should return status 200 and an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("should respond with 404 not found if the article does't exist", () => {
    return request(app)
      .get("/api/articles/0")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  it('should respond with status 400 and message "Bad request" if the id is NaN', () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  it("should return status 200 and an array of all articles sorted by 'created_at' property in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(1);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should return status 200 and all comments associated with the article passed as a parameter", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThanOrEqual(1);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: false });
      });
  });
  it("should return 400 with message Bad request if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should return 404 with message Bad request if article_id is a number but is not present in the database", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should return status 201 and the new comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "The most amazing comment ever",
      })
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          body: "The most amazing comment ever",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("should respond with status 404 bad request if username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "coolDude42",
        body: "The most amazing comment ever",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Key is not present in table");
      });
  });
  it("should respond with 400 bad request if article_id is not a number", () => {
    return request(app)
      .post("/api/articles/waffle/comments")
      .send({
        username: "butter_bridge",
        body: "The most amazing comment ever",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with 404 bad request if article_id is a number but not present in the database", () => {
    return request(app)
      .post("/api/articles/0/comments")
      .send({
        username: "butter_bridge",
        body: "The most amazing comment ever",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("should update an article by article_id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 103,
          article_img_url: expect.any(String),
        });
      });
  });
  it("should update an article when passed votes are a negative number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -3 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 97,
          article_img_url: expect.any(String),
        });
      });
  });
  it("should return 404 not found if article_id is a number but is not present in the database", () => {
    return request(app)
      .patch("/api/articles/9999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  it("should return 400 if the article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/ice-cream")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should return 400 if the update is badly formatted", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Ratatouille" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
