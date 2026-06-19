import { useEffect } from 'react'

const Blog = ({ user, blog, like, deleteBlog }) => {
  const handleLike = async () => {
    await like(blog.id, { likes: blog.likes + 1 })
  }

  const handleDeleteBlog = async () => {
    if (!window.confirm(`Delete ${blog.title} by ${blog.author}`)) {
      return
    }
    await deleteBlog(blog.id)
  }

  return (
    <div data-testid="blog-container">
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      Likes: {blog.likes}
      {user && <button onClick={handleLike}>Like</button>}
      <p>{blog.author}</p>
      {user?.username === blog?.user?.username && (
        <button onClick={handleDeleteBlog}>Remove</button>
      )}
    </div>
  )
}

export default Blog
