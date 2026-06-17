const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

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
});
