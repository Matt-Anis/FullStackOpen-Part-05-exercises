const Blog = ({ blog, like, deleteBlog }) => {
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
      <button onClick={handleLike}>like</button>
      <p>{blog.author}</p>
      <button onClick={handleDeleteBlog}>Remove</button>
    </div>
  )
}

export default Blog
