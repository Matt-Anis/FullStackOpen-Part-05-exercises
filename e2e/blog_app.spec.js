const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:5173");
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matt Anis",
        username: "mattanis",
        password: "secret",
      },
    });
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByRole("textbox", { name: "username" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
  });

  test("login succeeds with correct credentials", async ({ page }) => {
    await loginWith(page, "mattanis", "secret");
    await expect(page.getByText("Matt Anis logged in")).toBeVisible();
  });

  test("login fails with wrong credentials", async ({ page }) => {
    await loginWith(page, "mattanis", "wrong");
    await expect(page.getByText("wrong credentials")).toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mattanis", "secret");
    });

    test("a blog can be created", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://test.com");
      await expect(
        page.getByTestId("blog-title").filter({ hasText: "Test Blog" }),
      ).toBeVisible();
    });
  });
});
