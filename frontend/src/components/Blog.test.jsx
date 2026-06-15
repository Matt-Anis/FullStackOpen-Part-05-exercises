import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

test("<Blog /> shows only title initially", async () => {
  const blog = {
    author: "me",
    title: "only the title should be visible",
    likes: 1,
    url: "https://example.com",
  };

  render(<Blog blog={blog} />);

  const title = screen.getByText("only the title should be visible");
  const author = screen.queryByText("me");

  expect(title).toBeVisible();
  expect(author).toBeNull();
});

test("<Blog /> shows likes, url, and author when button is clicked", async () => {
  const blog = {
    author: "me",
    title: "only the title should be visible",
    likes: 1,
    url: "https://example.com",
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const author = screen.queryByText("me");
  const title = screen.getByText("only the title should be visible");
  expect(title).toBeVisible();
  expect(author).toBeVisible();
});
