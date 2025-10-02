import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { useSession } from "@lib/providers/SessionProvider.jsx"

const STATUS = {
  idle: "idle",
  processing: "processing",
  success: "success",
  error: "error",
}

export default function Activation() {
  const { me, activateEmail, resendActivation } = useSession()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState(STATUS.idle)
  const [token, setToken] = useState("")
  const [resendState, setResendState] = useState({ submitting: false })
  const [messages, setMessages] = useState([])
  const processedTokens = useRef(new Set())

  const canResend = useMemo(() => me?.status && me.status !== "guest", [me])

  useEffect(() => {
    const urlToken = searchParams.get("token") || ""
    setToken(urlToken)
    if (!urlToken) return
    if (processedTokens.current.has(urlToken)) return
    processedTokens.current.add(urlToken)

    const activate = async () => {
      setStatus(STATUS.processing)
      try {
        const payload = await activateEmail(urlToken)
        const text = payload?.message || "メールアドレスの確認が完了しました"
        setStatus(STATUS.success)
        setMessages((prev) => [...prev, { type: STATUS.success, text }])
      } catch (err) {
        const text = err?.message || "メール確認に失敗しました"
        setStatus(STATUS.error)
        setMessages((prev) => [...prev, { type: STATUS.error, text }])
      }
    }

    activate()
  }, [searchParams, activateEmail])

  const headline = useMemo(() => {
    switch (status) {
      case STATUS.processing:
        return "確認中です"
      case STATUS.success:
        return "確認が完了しました"
      case STATUS.error:
        return "確認に失敗しました"
      default:
        return "確認トークンが必要です"
    }
  }, [status])

  const description = useMemo(() => {
    if (status === STATUS.success) return "ブラウザをそのまま閉じていただいて構いません。"
    if (status === STATUS.processing) return "数秒お待ちください..."
    if (status === STATUS.error) return "再度メールのリンクを開くか、確認メールを再送してください。"
    return "メールに記載されたリンクからアクセスしてください。"
  }, [status])

  const handleNavigateAccount = () => {
    navigate("/app/account", { replace: true })
  }

  const handleResend = async () => {
    setResendState({ submitting: true })
    try {
      const payload = await resendActivation()
      const text = payload?.message || "確認メールを再送しました"
      setResendState({ submitting: false })
      setMessages((prev) => [...prev, { type: STATUS.success, text }])
    } catch (err) {
      const text = err?.message || "確認メールの再送に失敗しました"
      setResendState({ submitting: false })
      setMessages((prev) => [...prev, { type: STATUS.error, text }])
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{headline}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token && (
            <p className="text-sm text-muted-foreground">
              URL に `token` クエリパラメータが含まれていません。メール内のリンクから再度アクセスしてください。
            </p>
          )}

          {messages.length > 0 && (
            <div className="space-y-1 text-sm">
              {messages.map((entry, index) => {
                const label = entry.type === STATUS.error ? "エラー" : "成功"
                const textClass = entry.type === STATUS.error ? "text-red-600" : "text-foreground"
                return (
                  <p key={`${entry.type}-${index}`} className={textClass}>
                    [{label}] {entry.text}
                  </p>
                )
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleNavigateAccount}>
              アカウントページへ
            </Button>
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendState.submitting || !canResend}
            >
              {resendState.submitting ? "再送中..." : "確認メールを再送"}
            </Button>
          </div>

          {!canResend && (
            <p className="text-xs text-muted-foreground">
              確認メールの再送はログイン済みの会員アカウントでのみ利用できます。ログイン後に再度アクセスしてください。
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
