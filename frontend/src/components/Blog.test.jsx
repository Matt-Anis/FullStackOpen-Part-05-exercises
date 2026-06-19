import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('<Blog /> when like clicked twice, the two calls are recorded', async () => {
  const blog = {
    author: 'me',
    title: 'only the title should be visible',
    likes: 1,
    url: 'https://example.com',
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} like={mockHandler} user={'not null'} />)

  const user = userEvent.setup()

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<Blog /> when user not logged in ')
