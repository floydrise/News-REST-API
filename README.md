# News API

---

**Info**

A REST API with the purpose of accessing application data.
The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.
The data will be displayed in JSON format.

---

**Hosted version:** [News API](https://news-api-40x5.onrender.com/api)

---

**Prerequisites**

- Node.js v20.15.0 - [Installation guide](https://nodejs.org/en/download/package-manager)
- PostgreSQL v14.13 - [Installation guide](https://www.postgresql.org/download/)

---
**Instructions**
1. Clone the repo by running: `git clone <repository-url>`
2. You'll need to install the project dependencies by running: `npm install`
3. Two *.env* files would need to be created
   1. .env.test - put `PGDATABASE=nc_news_test` inside
   2. .env.development - put `PGDATABASE=nc_news` inside
4. Next the databases have to be initialised locally. Run `npm run setup-dbs`
5. After this run `npm run seed` to seed the databases with data
6. `npm run listen` can be used so the server can be started and requests to be sent using Postman or other software.
7. Check `endpoints.json` for the available endpoints.

---
**Dependencies**

- Express
- dotenv
- pg-format
- node-postgres

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
