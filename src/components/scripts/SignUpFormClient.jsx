import { useEffect } from 'react'
import initSignUpForm from '../../scripts/sign-up-form.js'

const SignUpFormClient = () => {
  useEffect(() => {
    initSignUpForm()
  }, [])

  return null
}

export default SignUpFormClient
