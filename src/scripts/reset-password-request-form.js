import AuthApi from "../lib/api/base/auth.js"
import { showFlash } from "./flash-messages.js"

let authApi = null

export const initResetPasswordRequestForm = () => {
  const form = document.querySelector("#reset-password-request-form")
  if (!form) return

  const submitButton = form.querySelector("button[type=submit]")
  const emailField = form.querySelector("input[name=email]")

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = emailField?.value?.toString().trim()
    if (!email) {
      showFlash("メールアドレスを入力してください", { variant: "warning" })
      emailField?.focus()
      return
    }

    submitButton?.setAttribute("disabled", "true")

    try {
      if (!authApi) authApi = new AuthApi()
      const payload = await authApi.requestPasswordReset({ email })
      const message = payload?.message || "パスワードリセットの案内を送信しました"
      showFlash(message, { variant: "success" })
      form.reset()
    } catch (error) {
      const message = error?.message || "パスワードリセットメールの送信に失敗しました"
      showFlash(message, { variant: "error" })
    } finally {
      submitButton?.removeAttribute("disabled")
    }
  })
}

export default initResetPasswordRequestForm
