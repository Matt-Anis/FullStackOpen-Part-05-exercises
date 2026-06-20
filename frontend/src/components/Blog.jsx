import { Card, CardContent, Typography, Button } from '@mui/material'

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
    <Card data-testid="blog-container">
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography variant="body" color="textSecondary">
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </Typography>
        <Typography variant="body2">by: {blog.author}</Typography>
        <Typography variant="body2">Likes: {blog.likes}</Typography>
        {user && <Button onClick={handleLike}>Like</Button>}
        <Typography variant="body2">
          Added by: {blog?.user?.username}
        </Typography>
        {user?.username === blog?.user?.username && (
          <Button onClick={handleDeleteBlog} color="error">
            Remove
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
