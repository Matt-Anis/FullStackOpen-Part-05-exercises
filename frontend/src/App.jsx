import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "../../../examples/frontend/src/components/Togglable";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
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

  const blogFormRef = useRef();

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

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

  const handleBlogSubmit = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      setBlogs(blogs.concat(returnedBlog));
      blogFormRef.current.toggleVisibility();

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
    <Togglable buttonLabel="login">
      <LoginForm login={handleLogin} />
    </Togglable>
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
    <Togglable buttonLabel="Add blog" ref={blogFormRef}>
      <BlogForm createBlog={handleBlogSubmit} />
    </Togglable>
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
