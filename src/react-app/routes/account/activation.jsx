import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { useSession } from "@lib/providers/SessionProvider.jsx"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Link as LinkIcon,
  Loader2,
  MailCheck,
} from "lucide-react"

const STATUS = {
  idle: "idle",
  processing: "processing",
  success: "success",
  error: "error",
}

const Feedback = ({ variant = "neutral", message }) => {
  if (!message) return null

  const icons = {
    success: CheckCircle2,
    error: CircleAlert,
    warning: AlertTriangle,
    neutral: LinkIcon,
  }

  const styles = {
    success: "border-emerald-200/60 bg-emerald-500/10 text-emerald-700",
    error: "border-destructive/40 bg-destructive/10 text-destructive",
    warning: "border-amber-200/60 bg-amber-100/40 text-amber-700",
    neutral: "border-border bg-muted/40 text-muted-foreground",
  }

  const Icon = icons[variant] || icons.neutral

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${styles[variant] || styles.neutral}`}>
      <Icon className="mt-0.5 h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

export default function AccountActivation() {
  const { me, activateEmail, resendActivation } = useSession()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState(STATUS.idle)
  const [token, setToken] = useState("")
  const [resendState, setResendState] = useState({ submitting: false })
  const [messages, setMessages] = useState([])
  const processedTokens = useRef(new Set())

  const isActivated = useMemo(
    () => Boolean(me?.is_activate ?? me?.is_activated),
    [me]
  )

  const canResend = useMemo(() => {
    if (!me) return false
    if (me.status === "guest") return false
    return !isActivated
  }, [me, isActivated])

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

  useEffect(() => {
    if (!token && isActivated && status === STATUS.idle) {
      setStatus(STATUS.success)
      setMessages((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                type: STATUS.success,
                text: "メールアドレスはすでに確認済みです。追加の操作は不要です。",
              },
            ]
      )
    }
  }, [isActivated, status, token])

  const headline = useMemo(() => {
    switch (status) {
      case STATUS.processing:
        return "確認中です"
      case STATUS.success:
        return isActivated ? "確認済みです" : "確認が完了しました"
      case STATUS.error:
        return "確認に失敗しました"
      default:
        return isActivated ? "確認済みです" : "確認トークンが必要です"
    }
  }, [status, isActivated])

  const description = useMemo(() => {
    if (status === STATUS.success) {
      return isActivated
        ? "このアカウントのメールアドレスは確認済みです。追加の操作は必要ありません。"
        : "ブラウザをそのまま閉じていただいて構いません。"
    }
    if (status === STATUS.processing) return "数秒お待ちください..."
    if (status === STATUS.error) return "再度メールのリンクを開くか、確認メールを再送してください。"
    return "メールに記載されたリンクからアクセスしてください。"
  }, [status, isActivated])

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
    <div className="mx-auto max-w-3xl space-y-8">
      <Card className="overflow-hidden border-border/60 shadow-md">
        <CardHeader className="gap-2 border-b border-border/60 bg-muted/40 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MailCheck className="h-3.5 w-3.5 text-primary" />
            メールアドレス確認
          </div>
          <CardTitle className="text-2xl">{headline}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {token && (
            <Badge variant="muted" className="w-fit rounded-full">
              トークン: {token.slice(0, 6)}…{token.slice(-4)}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {!token && !isActivated && (
            <Feedback
              variant="warning"
              message="URL に `token` クエリパラメータが含まれていません。メール内のリンクから再度アクセスするか、トークンをコピーして貼り付けてください。"
            />
          )}

          {status === STATUS.processing && (
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              認証を処理中です。しばらくお待ちください…
            </div>
          )}

          {messages.length > 0 && (
            <div className="space-y-2">
              {messages.map((entry, index) => (
                <Feedback
                  key={`${entry.type}-${index}`}
                  variant={entry.type === STATUS.error ? "error" : "success"}
                  message={entry.text}
                />
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">確認メールが届かない場合</p>
            <ul className="mt-3 space-y-2">
              <li>・迷惑メールフォルダに振り分けられていないかご確認ください。</li>
              <li>・複数回リクエストしている場合は最新のメールをご利用ください。</li>
              <li>・リンクの有効期限は24時間です。期限切れの場合は再送してください。</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/30 p-6">
          <Button variant="outline" onClick={handleNavigateAccount} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            アカウントページへ戻る
          </Button>
          {!isActivated && (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendState.submitting || !canResend}
              className="inline-flex items-center gap-2"
            >
              {resendState.submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  再送中...
                </>
              ) : (
                <>
                  <MailCheck className="h-4 w-4" />
                  確認メールを再送
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {!canResend && !isActivated && (
        <p className="text-xs text-muted-foreground">
          確認メールの再送はログイン済みの会員アカウントでのみ利用できます。ログイン後に再度アクセスしてください。
        </p>
      )}
    </div>
  )
}
