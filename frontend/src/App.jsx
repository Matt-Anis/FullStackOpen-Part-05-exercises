import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("loggedBlogappUser"));
    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

      setNotification({
        message: "Successfully Logged in",
        isError: false,
      });
      setTimeout(() => {
        setNotification({ message: null, isError: false });
      }, 5000);
    } catch {
      setNotification({
        message: "Wrong credentials",
        isError: true,
      });
      setTimeout(() => {
        setNotification({ message: null, isError: false });
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);

    setNotification({
      message: "Successfully Logged out",
      isError: false,
    });
    setTimeout(() => {
      setNotification({ message: null, isError: false });
    }, 5000);
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      const returnedBlog = await blogService.create(newBlog);

      setBlogAuthor("");
      setBlogTitle("");
      setBlogUrl("");

      setBlogs(blogs.concat(returnedBlog));
      setNotification({
        message: `A new blog "${returnedBlog.title}" by "${returnedBlog.author}" added!`,
        isError: false,
      });
      setTimeout(() => {
        setNotification({ message: null, isError: false });
      }, 5000);
    } catch (error) {
      setNotification({
        message: `${error}`,
        isError: true,
      });
      setTimeout(() => {
        setNotification({ message: null, isError: false });
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Login to the application</h2>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>log out</button>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const blogForm = () => (
    <div>
      <h2>Add blog</h2>
      <form onSubmit={handleBlogSubmit}>
        <label>
          Title
          <input
            type="text"
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </label>
        <label>
          Author
          <input
            type="text"
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </label>
        <label>
          URL
          <input
            type="url"
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );

  return (
    <>
      <Notification {...notification} />
      {!user && loginForm()}
      {user && (
        <>
          {blogForm()}
          {blogList()}
        </>
      )}
    </>
  );
};

export default App;
