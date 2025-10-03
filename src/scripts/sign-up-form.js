import AuthApi from "../lib/api/base/auth.js";

let authApi = null;

export const initSignUpForm = () => {
  const form = document.querySelector("#sign-up-form");
  if (!form) return;

  const feedback = form.querySelector("[data-feedback]");
  const submitButton = form.querySelector("button[type=submit]");
  const redirectTarget = form.dataset.redirect || "/app/account";
  const guestLink = form.querySelector("[data-link=guest-demo]");

  const setFeedback = (message, variant = "muted") => {
    if (!feedback) return;
    if (!message) {
      feedback.classList.add("hidden");
      feedback.textContent = "";
      return;
    }
    const variants = {
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
      error: "border-destructive/40 bg-destructive/10 text-destructive",
      muted: "border-border bg-muted/50 text-muted-foreground",
    };
    feedback.className = `rounded-lg border px-3 py-2 text-sm ${variants[variant] || variants.muted}`;
    feedback.textContent = message;
    feedback.classList.remove("hidden");
  };

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
    setFeedback("会員登録処理中です...", "muted");

    try {
      if (!authApi) authApi = new AuthApi();
      const data = await authApi.signUp(payload);
      setFeedback(data?.message || "会員登録が完了しました。メールをご確認ください。", "success");
      setTimeout(() => {
        window.location.href = decodeURIComponent(redirectTarget);
      }, 600);
    } catch (error) {
      setFeedback(error?.message || "会員登録に失敗しました", "error");
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
