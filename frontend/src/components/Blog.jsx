import { useState } from "react";

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleExpand = () => setExpanded(!expanded);

  const like = () => {};

  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={toggleExpand}>view</button>
      {expanded && (
        <div>
          <p>{blog.url}</p>
          Likes: {blog.likes}
          <button onClick={like}>like</button>
          <p>{blog.author}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
