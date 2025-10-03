import AuthApi from "../lib/api/base/auth.js";
import { showFlash, queueFlash } from "./flash-messages.js";

let authApi = null;

export const initSignUpForm = () => {
  const form = document.querySelector("#sign-up-form");
  if (!form) return;

  const submitButton = form.querySelector("button[type=submit]");
  const redirectTarget = form.dataset.redirect || "/app/account";
  const guestLink = form.querySelector("[data-link=guest-demo]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const password = formData.get("password")?.toString() ?? "";
    const passwordConfirmation = formData.get("password_confirmation")?.toString() ?? "";

    if (password !== passwordConfirmation) {
      setFeedback("パスワードが一致しません", "error");
      return;
    }

    const payload = {
      email: formData.get("email")?.toString().trim(),
      password,
      password_confirmation: passwordConfirmation,
    };

    submitButton.disabled = true;

    try {
      if (!authApi) authApi = new AuthApi();
      const data = await authApi.signUp(payload);
      const message = data?.message || "会員登録が完了しました。メールをご確認ください。";
      queueFlash(message, { variant: "success" });
      setTimeout(() => {
        window.location.href = decodeURIComponent(redirectTarget);
      }, 600);
    } catch (error) {
      const message = error?.message || "会員登録に失敗しました";
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

export default initSignUpForm;
