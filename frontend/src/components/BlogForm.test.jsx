import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { expect } from "vitest";

test("<BlogForm /> calls the event handler it received as props with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("Title");
  const authorInput = screen.getByLabelText("Author");
  const urlInput = screen.getByLabelText("URL");

  const sendButton = screen.getByText("Add");

  await user.type(titleInput, "Testing a form...");
  await user.type(authorInput, "John Doe");
  await user.type(urlInput, "https://example.com");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Testing a form...");
  expect(createBlog.mock.calls[0][0].author).toBe("John Doe");
  expect(createBlog.mock.calls[0][0].url).toBe("https://example.com");
});
