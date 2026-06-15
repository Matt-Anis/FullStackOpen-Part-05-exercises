import { useState } from "react";

const Blog = ({ blog, like }) => {
  const [expanded, setExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleExpand = () => setExpanded(!expanded);

  const handleLike = async () => {
    await like(blog.id, { ...blog, likes: blog.likes + 1 });
  };

  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={toggleExpand}>view</button>
      {expanded && (
        <div>
          <p>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </p>
          Likes: {blog.likes}
          <button onClick={handleLike}>like</button>
          <p>{blog.author}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
