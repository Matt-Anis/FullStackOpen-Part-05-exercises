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

  const likeButton = screen.getByText('Like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<Blog /> when user not logged in like and delete buttons not visible', async () => {
  const blog = {
    author: 'Anis',
    id: '6a3577ee578c562685d229eb',
    likes: 7,
    title: 'test blog',
    url: 'https://example.com',

    user: {
      id: '6a35686e578c562685d229ea',
      name: 'Matt Anis',
      username: 'anis',
    },
  }
  const user = null
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.queryByRole('button', { name: 'Like' })
  const deleteButton = screen.queryByRole('button', { name: 'Remove' })

  expect(likeButton).toBeNull()
  expect(deleteButton).toBeNull()
})

test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
  const blog = {
    author: 'Anis',
    id: '6a3577ee578c562685d229eb',
    likes: 7,
    title: 'test blog',
    url: 'https://example.com',

    user: {
      id: '6a35686e578c562685d229ea',
      name: 'Matt Anis',
      username: 'anis',
    },
  }
  const user = 'not null'
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.queryByRole('button', { name: 'Like' })
  const deleteButton = screen.queryByRole('button', { name: 'Remove' })

  expect(likeButton).not.toBeNull()
  expect(deleteButton).toBeNull()
})
test('The blog’s creator is also shown the delete button', () => {
  const blog = {
    author: 'Anis',
    id: '6a3577ee578c562685d229eb',
    likes: 7,
    title: 'test blog',
    url: 'https://example.com',

    user: {
      id: '6a35686e578c562685d229ea',
      name: 'Matt Anis',
      username: 'anis',
    },
  }
  const user = {
    id: '6a35686e578c562685d229ea',
    name: 'Matt Anis',
    username: 'anis',
  }
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.queryByRole('button', { name: 'Like' })
  const deleteButton = screen.queryByRole('button', { name: 'Remove' })

  expect(likeButton).not.toBeNull()
  expect(deleteButton).not.toBeNull()
})
