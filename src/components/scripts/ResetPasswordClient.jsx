import { useEffect } from 'react'
import initResetPasswordForm from '../../scripts/reset-password-form.js'

const ResetPasswordClient = ({ token = '' }) => {
  useEffect(() => {
    initResetPasswordForm(token)
  }, [token])

  return null
}

export default ResetPasswordClient
