import { useState, useEffect, useRef } from 'react'
import { Link, Route, Routes, Navigate, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from '../../../examples/frontend/src/components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  })

  useEffect(() => {
    const fetchBlogs = async () => {
      const loadedBlogs = await blogService.getAll()
      setBlogs(loadedBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setNotification({
        message: 'Successfully Logged in',
        isError: false,
      })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    } catch {
      setNotification({
        message: 'Wrong credentials',
        isError: true,
      })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)

    setNotification({
      message: 'Successfully Logged out',
      isError: false,
    })
    setTimeout(() => {
      setNotification({ message: null, isError: false })
    }, 5000)
  }

  // TODO: will be refactored later into the blog form component
  const handleBlogSubmit = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()

      setNotification({
        message: `A new blog "${returnedBlog.title}" by "${returnedBlog.author}" added!`,
        isError: false,
      })

      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    } catch (error) {
      setNotification({
        message: `${error}`,
        isError: true,
      })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    }
  }

  const incrementLike = async (id, newBlog) => {
    try {
      const response = await blogService.update(id, newBlog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : response.data)))
      setNotification({
        message: 'Successfully Liked the blog!',
        isError: false,
      })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    } catch (error) {
      setNotification({
        message: error,
        isError: true,
      })
      setTimeout(() => {
        setTimeout(() => {
          setNotification({ message: null, isError: false })
        }, 5000)
      })
    }
  }

  const handleBlogDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))

      setNotification({
        message: `Blog successfully deleted`,
        isError: false,
      })

      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    } catch (error) {
      setNotification({
        message: `${error}`,
        isError: true,
      })
      setTimeout(() => {
        setNotification({ message: null, isError: false })
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="Add blog" ref={blogFormRef}>
      <BlogForm createBlog={handleBlogSubmit} />
    </Togglable>
  )

  const padding = {
    padding: 5,
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user ? (
          <>
            <Link style={padding} to="/create">
              new blog
            </Link>
            <button style={padding} onClick={handleLogout}>
              logout
            </button>
          </>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm login={handleLogin} />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            blog ? (
              <Blog
                blog={blog}
                deleteBlog={handleBlogDelete}
                like={incrementLike}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm createBlog={handleBlogSubmit} />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
