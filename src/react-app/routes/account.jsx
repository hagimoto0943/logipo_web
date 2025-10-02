import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Label } from "@components/ui/label"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { useSession } from "@lib/providers/SessionProvider.jsx"

const initialSignUp = {
  email: "",
  password: "",
  passwordConfirmation: "",
}

const initialSignIn = {
  email: "",
  password: "",
}

const initialActivation = {
  token: "",
}

const Feedback = ({ variant = "neutral", message }) => {
  if (!message) return null
  const color = useMemo(() => {
    switch (variant) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }, [variant])

  return <p className={`text-sm ${color}`}>{message}</p>
}

export default function Account() {
  const {
    me,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    activateEmail,
    resendActivation,
  } = useSession()
  const [searchParams, setSearchParams] = useSearchParams()
  const processedTokenRef = useRef(null)

  const [signUpForm, setSignUpForm] = useState(initialSignUp)
  const [signUpState, setSignUpState] = useState({ submitting: false, success: "", error: "" })

  const [signInForm, setSignInForm] = useState(initialSignIn)
  const [signInState, setSignInState] = useState({ submitting: false, success: "", error: "" })

  const [activationForm, setActivationForm] = useState(initialActivation)
  const [activationState, setActivationState] = useState({ submitting: false, success: "", error: "" })

  const [resendState, setResendState] = useState({ submitting: false, success: "", error: "" })
  const [logoutState, setLogoutState] = useState({ submitting: false, success: "", error: "" })

  const statusLabel = useMemo(() => {
    if (!me?.status) return "guest"
    return me.status
  }, [me])

  const userStatus = me?.status || "guest"

  const obfuscateToken = (token) => {
    if (!token) return "-"
    if (token.length <= 10) return token
    return `${token.slice(0, 6)}…${token.slice(-4)}`
  }

  const clearUrlToken = () => {
    const next = new URLSearchParams(searchParams)
    next.delete("token")
    setSearchParams(next, { replace: true })
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    setSignUpState({ submitting: true, success: "", error: "" })
    try {
      const payload = await signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        password_confirmation: signUpForm.passwordConfirmation,
      })
      const message = payload?.message || "会員登録が完了しました。メールをご確認ください。"
      setSignUpState({ submitting: false, success: message, error: "" })
    } catch (err) {
      setSignUpState({
        submitting: false,
        success: "",
        error: err?.message || "会員登録に失敗しました",
      })
    }
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    setSignInState({ submitting: true, success: "", error: "" })
    try {
      const payload = await signIn({
        email: signInForm.email,
        password: signInForm.password,
      })
      const message = payload?.message || "ログインしました"
      setSignInState({ submitting: false, success: message, error: "" })
    } catch (err) {
      setSignInState({
        submitting: false,
        success: "",
        error: err?.message || "ログインに失敗しました",
      })
    }
  }

  const handleSignOut = async () => {
    setLogoutState({ submitting: true, success: "", error: "" })
    try {
      await signOut()
      setLogoutState({ submitting: false, success: "ログアウトしました", error: "" })
    } catch (err) {
      setLogoutState({
        submitting: false,
        success: "",
        error: err?.message || "ログアウトに失敗しました",
      })
    }
  }

  const handleActivation = async (token, { triggeredByUrl } = { triggeredByUrl: false }) => {
    setActivationState({ submitting: true, success: "", error: "" })
    try {
      const payload = await activateEmail(token)
      const message = payload?.message || "メールアドレスの確認が完了しました"
      setActivationState({ submitting: false, success: message, error: "" })
      setActivationForm({ token: "" })
      if (triggeredByUrl) clearUrlToken()
    } catch (err) {
      setActivationState({
        submitting: false,
        success: "",
        error: err?.message || "メール確認に失敗しました",
      })
      if (triggeredByUrl) clearUrlToken()
    }
  }

  const handleSubmitActivation = async (event) => {
    event.preventDefault()
    if (!activationForm.token) return
    await handleActivation(activationForm.token)
  }

  const handleResendActivation = async () => {
    setResendState({ submitting: true, success: "", error: "" })
    try {
      const payload = await resendActivation()
      const message = payload?.message || "確認メールを再送しました"
      setResendState({ submitting: false, success: message, error: "" })
    } catch (err) {
      setResendState({
        submitting: false,
        success: "",
        error: err?.message || "確認メールの再送に失敗しました",
      })
    }
  }

  useEffect(() => {
    const token = searchParams.get("token")
    if (token && processedTokenRef.current !== token) {
      processedTokenRef.current = token
      setActivationForm({ token })
      handleActivation(token, { triggeredByUrl: true })
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>アカウント情報</CardTitle>
          <CardDescription>
            現在のログイン状態と会員情報を確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          ) : (
            <>
              <div className="text-sm">
                <span className="font-medium">ステータス: </span>
                <span className="uppercase">{statusLabel}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">メールアドレス: </span>
                <span>{me?.email || "未設定"}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">ユーザーID: </span>
                <span>{me?.id ?? "-"}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                セッショントークン: {obfuscateToken(me?.token)}
              </div>
              {error && <Feedback variant="error" message={error} />}
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={logoutState.submitting || userStatus === "guest"}
            >
              {logoutState.submitting ? "ログアウト中..." : "ログアウト"}
            </Button>
            {logoutState.success && <Feedback variant="success" message={logoutState.success} />}
            {logoutState.error && <Feedback variant="error" message={logoutState.error} />}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>会員登録</CardTitle>
            <CardDescription>
              現在のゲストアカウントにメールアドレスとパスワードを設定します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="grid gap-2">
                <Label htmlFor="sign-up-email">メールアドレス</Label>
                <Input
                  id="sign-up-email"
                  type="email"
                  placeholder="example@example.com"
                  value={signUpForm.email}
                  onChange={(event) => setSignUpForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sign-up-password">パスワード</Label>
                <Input
                  id="sign-up-password"
                  type="password"
                  value={signUpForm.password}
                  onChange={(event) => setSignUpForm((prev) => ({ ...prev, password: event.target.value }))}
                  minLength={8}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sign-up-password-confirmation">パスワード（確認）</Label>
                <Input
                  id="sign-up-password-confirmation"
                  type="password"
                  value={signUpForm.passwordConfirmation}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({ ...prev, passwordConfirmation: event.target.value }))}
                  minLength={8}
                  required
                />
              </div>
              {signUpState.error && <Feedback variant="error" message={signUpState.error} />}
              {signUpState.success && <Feedback variant="success" message={signUpState.success} />}
              <Button type="submit" disabled={signUpState.submitting} className="w-full">
                {signUpState.submitting ? "登録中..." : "登録する"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
            <CardDescription>
              既存の会員情報でログインし、セッションを切り替えます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="grid gap-2">
                <Label htmlFor="sign-in-email">メールアドレス</Label>
                <Input
                  id="sign-in-email"
                  type="email"
                  value={signInForm.email}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sign-in-password">パスワード</Label>
                <Input
                  id="sign-in-password"
                  type="password"
                  value={signInForm.password}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>
              {signInState.error && <Feedback variant="error" message={signInState.error} />}
              {signInState.success && <Feedback variant="success" message={signInState.success} />}
              <Button type="submit" disabled={signInState.submitting} className="w-full">
                {signInState.submitting ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>メールアドレス確認</CardTitle>
          <CardDescription>
            受信した確認メールのトークンを入力するか、URLに含まれるトークンから自動確認します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmitActivation}>
            <div className="grid gap-2">
              <Label htmlFor="activation-token">確認トークン</Label>
              <Input
                id="activation-token"
                value={activationForm.token}
                onChange={(event) => setActivationForm({ token: event.target.value })}
                placeholder="メールに記載されたトークン"
                required
              />
            </div>
            {activationState.error && <Feedback variant="error" message={activationState.error} />}
            {activationState.success && <Feedback variant="success" message={activationState.success} />}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={activationState.submitting}>
                {activationState.submitting ? "確認中..." : "確認する"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendActivation}
                disabled={resendState.submitting || userStatus === "guest"}
              >
                {resendState.submitting ? "再送中..." : "確認メールを再送"}
              </Button>
            </div>
            {resendState.error && <Feedback variant="error" message={resendState.error} />}
            {resendState.success && <Feedback variant="success" message={resendState.success} />}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
