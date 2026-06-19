import { expect } from "@playwright/test";

const loginWith = async (page, username, password) => {
  await page.getByRole("link", { name: "login" }).click();
  await page.getByRole("textbox", { name: "username" }).fill(username);
  await page.getByRole("textbox", { name: "password" }).fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("link", { name: "new blog" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(title);
  await page.getByRole("textbox", { name: "Author" }).fill(author);
  await page.getByRole("textbox", { name: "URL" }).fill(url);
  await page.getByRole("button", { name: "Add" }).click();
  await page
    .getByTestId("blogs-container")
    .filter({ hasText: title })
    .waitFor();
};

const likeBlog = async (blogLocator, expectedLikes) => {
  await blogLocator.getByRole("button", { name: "Like" }).click();
  await expect(blogLocator.getByText(`Likes: ${expectedLikes}`)).toBeVisible();
};

export { loginWith, createBlog, likeBlog };
