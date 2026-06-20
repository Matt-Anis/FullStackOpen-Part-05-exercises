import { useState } from 'react'
import { Button, TextField, Container } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogSubmit = async (event) => {
    event.preventDefault()

    await createBlog({ title, author, url })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  }
  return (
    <Container>
      <h2>Add blog</h2>
      <form style={style} onSubmit={handleBlogSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <TextField
          label="Author"
          variant="outlined"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          label="URL"
          variant="outlined"
          type="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />

        <Button variant="contained" type="submit">
          Add
        </Button>
      </form>
    </Container>
  )
}

export default BlogForm
