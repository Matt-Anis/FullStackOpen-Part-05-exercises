import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";

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
