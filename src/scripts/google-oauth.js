const initGoogleOAuth = () => {
  const buttons = document.querySelectorAll('[data-google-auth-url]')
  if (!buttons.length) return

  buttons.forEach((button) => {
    if (button.dataset.googleAuthInitialized === 'true') return

    const targetUrl = button.getAttribute('data-google-auth-url')
    button.dataset.googleAuthInitialized = 'true'

    if (!targetUrl) return

    console.log("Google OAuth URL", targetUrl)

    button.addEventListener('click', () => {
      window.location.href = targetUrl
    })
  })
}

export default initGoogleOAuth
