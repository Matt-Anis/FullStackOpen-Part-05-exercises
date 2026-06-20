const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./helpers/user_helper");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = await Promise.all(
    helper.initialUsers.map(async ({ username, name, password }) => {
      const passwordHash = await bcrypt.hash(password, 10);
      return new User({ username, name, passwordHash });
    }),
  );

  await User.insertMany(userObjects);
});

describe("tests pass on normal case", () => {
  test("fetches all users correctly", async () => {
    await api.get("/api/users").expect(200);
  });

  test("passes when creating user with correct data", async () => {
    await api
      .post("/api/users")
      .send({ username: "abc", name: "test_user", password: "abc" })
      .expect(201);
  });
});

describe("checking that creating users with invalid data will fail", () => {
  test("fails when password is too short", async () => {
    await api
      .post("/api/users")
      .send({ username: "test_user", name: "test_user", password: "ab" })
      .expect(400);
  });

  test("fails when password is missing", async () => {
    await api
      .post("/api/users")
      .send({ username: "test_user", name: "test_user" })
      .expect(400);
  });

  test("fails when username is too missing", async () => {
    await api
      .post("/api/users")
      .send({ name: "test_user", password: "abc" })
      .expect(400);
  });

  test("fails when username is too short", async () => {
    await api
      .post("/api/users")
      .send({ username: "ab", name: "test_user", password: "abc" })
      .expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
