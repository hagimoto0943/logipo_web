import Base from "../base.js"

export default class AuthApi extends Base {
  constructor() {
    super({ apiPrefix: import.meta.env.PUBLIC_API_URL || "" })
  }

  signUp(data) {
    return this.fetch("/auth/sign_up", { method: "POST", body: data })
  }

  signIn(data) {
    return this.fetch("/auth/sign_in", { method: "POST", body: data })
  }

  signOut() {
    return this.fetch("/auth/sign_out", { method: "POST" })
  }

  activate(token) {
    return this.fetch("/auth/activations", { method: "POST", body: { token } })
  }

  resendActivation() {
    return this.fetch("/auth/activations/resend", { method: "POST" })
  }

  requestPasswordReset(payload) {
    return this.fetch("/reset_password_requests", {
      method: "POST",
      body: payload,
    })
  }

  resetPassword({ token, password, password_confirmation }) {
    const search = token ? `?token=${encodeURIComponent(token)}` : ""
    return this.fetch(`/reset_password${search}`, {
      method: "PUT",
      body: {
        token,
        password,
        password_confirmation,
      },
    })
  }
}
