const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./helpers/blog_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const blogs = await helper.blogInDb();

  assert.strictEqual(blogs.length, helper.initialBlogs.length);
});

test('checking that unique identifier is "id" instead of "_id"', async () => {
  const blogs = await helper.blogInDb();

  assert.ok(blogs[0].id);
  assert.ok(!blogs[0]._id);
});

test("check that new posts are added successfully", async () => {
  const currentBlogs = await helper.blogInDb();
  const newBlog = {
    title: "this is a test note",
    author: "me",
    url: "https://fullstackopen.com/en/part4/testing_the_backend",
    likes: 0,
  };

  await api.post("/api/blogs").send(newBlog).expect(201);

  const updatedBlogsInDb = await helper.blogInDb();
  assert.strictEqual(updatedBlogsInDb.length, currentBlogs.length + 1);
});

test("check that if adding a blog without the field 'likes' it gets automatically 0", async () => {
  const newBlog = {
    title: "this is a test note",
    author: "me",
    url: "https://fullstackopen.com/en/part4/testing_the_backend",
  };

  await api.post("/api/blogs").send(newBlog).expect(201);

  const blogs = await helper.blogInDb();
  assert.strictEqual(blogs[blogs.length - 1]?.likes, 0);
});

test("check that inserting blogs without title will result in bad request ", async () => {
  const newBlog = {
    author: "me",
    url: "https://fullstackopen.com/en/part4/testing_the_backend",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("check that inserting blogs without url will result in bad request ", async () => {
  const newBlog = {
    title: "testing ",
    author: "me",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("check that delete by id works", async () => {
  const blogs = await helper.blogInDb();

  await api.delete(`/api/blogs/${blogs[0].id}`).expect(204);

  const updatedBlogs = await helper.blogInDb();
  assert.strictEqual(updatedBlogs.length, blogs.length - 1);
});

test("check that updating post by id works", async () => {
  const blogs = await helper.blogInDb();
  blogs[0].title = "updated blog title test";

  await api.put(`/api/blogs/${blogs[0].id}`).send(blogs[0]).expect(200);
});

after(async () => {
  await mongoose.connection.close();
});
