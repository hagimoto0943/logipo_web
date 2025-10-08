import { useEffect } from 'react'
import initResetPasswordRequestForm from '../../scripts/reset-password-request-form.js'

const ResetPasswordRequestClient = () => {
  useEffect(() => {
    initResetPasswordRequestForm()
  }, [])

  return null
}

export default ResetPasswordRequestClient
