import { useState, useEffect, useRef } from 'react'
import {
  Link,
  Route,
  Routes,
  Navigate,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import AppNotification from './components/AppNotification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

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

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setNotification({
        text: 'Successfully Logged in',
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        text: 'Wrong credentials',
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)

    setNotification({
      text: 'Successfully Logged out',
      type: 'success',
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleBlogSubmit = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      navigate('/')
      setNotification({
        text: `A new blog "${returnedBlog.title}" by "${returnedBlog.author}" added!`,
        type: 'success',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({
        text: `${error}`,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const incrementLike = async (id, newBlog) => {
    try {
      const response = await blogService.update(id, newBlog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : response.data)))
      setNotification({
        text: 'Successfully Liked the blog!',
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({
        text: error,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleBlogDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))

      setNotification({
        text: `Blog successfully deleted`,
        type: 'success',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({
        text: `${error}`,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <Container>
      <AppBar
        position="static"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
        }}
      >
        <h2>Blog App</h2>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <AppNotification notification={notification} />
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
                user={user}
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
    </Container>
  )
}
export default App
