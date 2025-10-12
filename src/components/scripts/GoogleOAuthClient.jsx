import { useEffect } from 'react'
import initGoogleOAuth from '../../scripts/google-oauth.js'

const GoogleOAuthClient = () => {
  useEffect(() => {
    initGoogleOAuth()
  }, [])

  return null
}

export default GoogleOAuthClient
