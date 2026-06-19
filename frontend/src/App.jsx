import { useState, useEffect, useRef } from 'react'
import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from '../../../examples/frontend/src/components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
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

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user ? (
          <button style={padding} onClick={handleLogout}>
            logout
          </button>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              user={user}
              blogs={blogs}
              incrementLike={incrementLike}
              handleBlogDelete={handleBlogDelete}
            />
          }
        />
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
      </Routes>
    </div>
  )
}

export default App
