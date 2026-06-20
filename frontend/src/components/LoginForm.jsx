import { useState } from 'react'
import { Button, TextField, Container } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleLogin = (event) => {
    event.preventDefault()

    login({ username, password })
  }

  const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  }
  return (
    <Container>
      <h2>Login</h2>
      <form style={style} onSubmit={handleLogin}>
        <TextField
          required
          label="username"
          variant="outlined"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          type="password"
          label="password"
          variant="outlined"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button variant="contained" type="submit">
          login
        </Button>
      </form>
    </Container>
  )
}

export default LoginForm
