
import AuthApi from "../lib/api/base/auth.js";
import { showFlash, queueFlash } from "./flash-messages.js";

let authApi = null;

export const initLoginForm = () => {
  const form = document.querySelector("#login-form");
  if (!form) return;

  const submitButton = form.querySelector("button[type=submit]");
  const redirectTarget = form.dataset.redirect || "/app/account";
  const guestLink = form.querySelector("[data-link=guest-demo]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString() ?? "",
    };

    submitButton.disabled = true;

    try {
      if (!authApi) authApi = new AuthApi();
      const data = await authApi.signIn(payload);
      const message = data?.message || "ログインしました";
      queueFlash(message, { variant: "success" });
      setTimeout(() => {
        window.location.href = decodeURIComponent(redirectTarget);
      }, 400);
    } catch (error) {
      const message = error?.message || "ログインに失敗しました";
      showFlash(message, { variant: "error" });
      submitButton.disabled = false;
    }
  });

  if (guestLink) {
    guestLink.addEventListener("click", (event) => {
      event.preventDefault();
      const target = guestLink.getAttribute("href") || "/app";
      window.location.href = target;
    });
  }
};

export default initLoginForm;
