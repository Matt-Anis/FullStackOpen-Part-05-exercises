const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog, likeBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matt Anis",
        username: "mattanis",
        password: "secret",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByRole("link", { name: "login" })).toBeVisible();
    await page.getByRole("link", { name: "login" }).click();
    await expect(page.getByRole("textbox", { name: "username" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
  });

  test("login succeeds with correct credentials", async ({ page }) => {
    await loginWith(page, "mattanis", "secret");
    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });

  test("login fails with wrong credentials", async ({ page }) => {
    await loginWith(page, "mattanis", "wrong");
    await expect(page.getByRole("link", { name: "logout" })).not.toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mattanis", "secret");
    });

    test("a blog can be created", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "https://test.com");
      await expect(
        page.getByTestId("blogs-container").filter({ hasText: "Test Blog" }),
      ).toBeVisible();
    });

    describe("and several blogs exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "First Blog", "Author 1", "https://first.com");
        await createBlog(page, "Second Blog", "Author 2", "https://second.com");
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("link", { name: "First Blog" }).click();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("Likes: 1")).toBeVisible();
      });

      test("a blog can be deleted by the creator", async ({ page }) => {
        page.on("dialog", async (dialog) => {
          expect(dialog.type()).toContain("confirm");
          expect(dialog.message()).toContain("Delete First Blog by Author 1");

          await dialog.accept();
        });

        await page.getByRole("link", { name: "First Blog" }).click();
        await page.getByRole("button", { name: "Remove" }).click();
        const blog = page.getByRole("link", { name: "First Blog" });
        await expect(blog).not.toBeVisible();
      });

      // test("the blogs are ordered according to likes with the blog with the most likes being first", async ({
      //   page,
      // }) => {
      //   const firstBlog = page
      //     .getByTestId("blog-container")
      //     .filter({ hasText: "First Blog" });
      //   const secondBlog = page
      //     .getByTestId("blog-container")
      //     .filter({ hasText: "Second Blog" });

      //   await firstBlog.getByRole("button", { name: "view" }).click();
      //   await likeBlog(firstBlog, 1);

      //   const topBlog = page.getByTestId("blog-container").first();
      //   await expect(topBlog).toContainText("First Blog");

      //   await secondBlog.getByRole("button", { name: "view" }).click();
      //   await likeBlog(secondBlog, 1);
      //   await likeBlog(secondBlog, 2);

      //   const newTopBlog = page.getByTestId("blog-container").first();
      //   await expect(newTopBlog).toContainText("Second Blog");
      // });
    });
  });
});
