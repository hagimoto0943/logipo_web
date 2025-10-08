import AuthApi from "../lib/api/base/auth.js"
import { queueFlash, showFlash } from "./flash-messages.js"

let authApi = null

export const initResetPasswordForm = (initialToken = "") => {
  const form = document.querySelector("#reset-password-form")
  if (!form) return

  const submitButton = form.querySelector("button[type=submit]")
  const passwordField = form.querySelector("input[name=password]")
  const confirmationField = form.querySelector("input[name=password_confirmation]")

  const urlToken = new URLSearchParams(window.location.search || "").get("token") || ""
  const token = form.dataset.token || initialToken || urlToken

  if (!token) {
    showFlash("パスワードリセット用のトークンが確認できません。メール内のリンクから再度アクセスしてください。", {
      variant: "error",
    })
    if (submitButton) submitButton.disabled = true
    return
  }

  form.dataset.token = token

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const password = passwordField?.value?.toString() ?? ""
    const passwordConfirmation = confirmationField?.value?.toString() ?? ""

    if (!password || password.length < 8) {
      showFlash("パスワードは8文字以上で入力してください", { variant: "warning" })
      passwordField?.focus()
      return
    }

    if (password !== passwordConfirmation) {
      showFlash("パスワードが一致しません", { variant: "warning" })
      confirmationField?.focus()
      return
    }

    submitButton?.setAttribute("disabled", "true")

    try {
      if (!authApi) authApi = new AuthApi()
      const payload = await authApi.resetPassword({
        token,
        password,
        password_confirmation: passwordConfirmation,
      })
      const message = payload?.message || "パスワードを変更しました"
      queueFlash(message, { variant: "success" })
      window.location.href = "/login"
    } catch (error) {
      const message = error?.message || "パスワードの変更に失敗しました"
      showFlash(message, { variant: "error" })
      submitButton?.removeAttribute("disabled")
    }
  })
}

export default initResetPasswordForm
