import { useState, useEffect } from 'react'
import Blog from './Blog'

const BlogList = ({ user, blogs, incrementLike, handleBlogDelete }) => {
  return (
    <div>
      <h2>blogs</h2>
      {user && <p>{user.name} logged in</p>}
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={incrementLike}
            deleteBlog={handleBlogDelete}
          />
        ))}
    </div>
  )
}

export default BlogList
