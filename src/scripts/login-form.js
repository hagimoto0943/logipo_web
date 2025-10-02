
import AuthApi from "@lib/api/base/auth.js";

let authApi = null;

const initLoginForm = () => {
  const form = document.querySelector("#login-form");
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
    const payload = {
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString() ?? "",
    };

    submitButton.disabled = true;
    setFeedback("ログイン処理中です...", "muted");

    try {
      if (!authApi) authApi = new AuthApi();
      const data = await authApi.signIn(payload);
      setFeedback(data?.message || "ログインしました", "success");
      setTimeout(() => {
        window.location.href = decodeURIComponent(redirectTarget);
      }, 400);
    } catch (error) {
      setFeedback(error?.message || "ログインに失敗しました", "error");
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoginForm, { once: true });
} else {
  initLoginForm();
}
