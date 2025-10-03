import { useEffect } from 'react'
import initLoginForm from '../../scripts/login-form.js'

const LoginFormClient = () => {
  useEffect(() => {
    initLoginForm()
  }, [])

  return null
}

export default LoginFormClient
