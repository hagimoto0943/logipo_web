import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  IdCard,
  Inbox,
  KeyRound,
  LineChart,
  Mail,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { useSession } from "@lib/providers/SessionProvider.jsx"

const Feedback = ({ variant = "neutral", message }) => {
  if (!message) return null

  const icons = {
    success: CheckCircle2,
    error: CircleAlert,
    warning: AlertTriangle,
    neutral: Inbox,
  }

  const styles = {
    success: "border-emerald-200/60 bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    error: "border-destructive/30 bg-destructive/10 text-destructive ring-destructive/30",
    warning: "border-amber-200/60 bg-amber-100/40 text-amber-700 ring-amber-500/20",
    neutral: "border-border bg-muted/50 text-muted-foreground ring-border/40",
  }

  const Icon = icons[variant] || icons.neutral

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ring-1 ${styles[variant] || styles.neutral}`}>
      <Icon className="mt-0.5 h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

const InfoTile = ({ label, value, icon: Icon, monospace = false }) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur">
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-1 text-sm font-semibold ${monospace ? "font-mono" : ""}`}>
          {value ?? "-"}
        </p>
      </div>
    </div>
  </div>
)

export default function AccountOverview() {
  const { me, isLoading, isHydrated, error, signOut } = useSession()
  const [logoutState, setLogoutState] = useState({ submitting: false, success: "", error: "" })

  const statusLabel = useMemo(() => {
    const value = me?.status
    if (!value || value === "guest") return "ゲスト"
    if (value === "trial") return "トライアル"
    if (value === "member") return "メンバー"
    return value
  }, [me])

  const userStatus = me?.status || (isHydrated ? "guest" : "loading")
  const isGuest = isHydrated ? userStatus === "guest" : false
  const isActivated = Boolean(
    me?.is_activate ?? me?.is_activated
  )
  const isEnabled = me?.is_enabled !== undefined ? Boolean(me.is_enabled) : true

  const obfuscateToken = (token) => {
    if (!token) return "-"
    if (token.length <= 10) return token
    return `${token.slice(0, 6)}…${token.slice(-4)}`
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

  return (
    <div className="space-y-10">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="gap-2 pb-2">
          <CardTitle className="text-2xl">アカウントの概要</CardTitle>
          <CardDescription>
            現在のログイン状態とセッション情報、確認ステータスをまとめて表示します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-0">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-primary-foreground shadow-sm md:col-span-2">
                  <div className="flex flex-col gap-3 text-primary-foreground">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/90">
                      現在のログイン状態
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/90">
                      <Badge variant="muted" className="rounded-full border border-primary/30 bg-primary/20 text-primary-foreground">
                        ステータス: {statusLabel}
                      </Badge>
                      <Badge variant={isActivated ? "success" : "warning"} className="rounded-full border-none">
                        {isActivated ? "メール確認済み" : "メール未確認"}
                      </Badge>
                      <Badge variant={isEnabled ? "success" : "destructive"} className="rounded-full border-none">
                        {isEnabled ? "利用可能" : "利用制限"}
                      </Badge>
                    </div>
                    <p className="text-sm text-primary-foreground/80">
                      セッションの状態やメール確認状況を確認し、必要に応じて次のアクションに進みましょう。
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    セッション操作
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    セッションを切り替える場合や、共有端末ではログアウトを実施してください。
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      disabled={logoutState.submitting || isGuest}
                    >
                      {logoutState.submitting ? "ログアウト中..." : "ログアウト"}
                    </Button>
                    {logoutState.success && <Feedback variant="success" message={logoutState.success} />}
                    {logoutState.error && <Feedback variant="error" message={logoutState.error} />}
                  </div>
                </div>
              </div>

              {!isActivated && (
                <Feedback
                  variant="warning"
                  message="メールアドレスの確認が完了していません。アカウントの安全性を保つために、確認メール内のリンクを開くかトークンを入力してください。"
                />
              )}

              {!isEnabled && (
                <Feedback
                  variant="error"
                  message="このアカウントには現在利用制限が設定されています。詳細についてはサポートまでお問い合わせください。"
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoTile label="メールアドレス" value={me?.email || "未設定"} icon={Mail} />
                <InfoTile label="ユーザーID" value={me?.id ?? "-"} icon={IdCard} />
                <InfoTile label="セッショントークン" value={obfuscateToken(me?.token)} icon={KeyRound} monospace />
                <InfoTile
                  label="最終更新"
                  value={me?.updated_at ? new Date(me.updated_at).toLocaleString() : "未取得"}
                  icon={Clock3}
                />
              </div>

              {error && <Feedback variant="error" message={error} />}
            </>
          )}
        </CardContent>
      </Card>

      {!isHydrated ? (
        <Card className="border-dashed border-border/60 bg-muted/30 shadow-sm">
          <CardContent className="space-y-3 py-8">
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ) : isGuest ? (
        <Card className="border-dashed border-border/70 bg-muted/30 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle>はじめてご利用の方へ</CardTitle>
            <CardDescription>
              学習データを保存するには会員登録が必要です。既存アカウントをお持ちの場合はログインしてください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm">
                <p className="text-sm font-semibold">初めての方</p>
                <p className="mt-2 text-sm text-muted-foreground">基本情報の登録で学習履歴を保存できます。</p>
                <Button asChild className="mt-4 w-full">
                  <Link to="/app/account/sign-up">会員登録へ進む</Link>
                </Button>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm">
                <p className="text-sm font-semibold">既にアカウントをお持ちの方</p>
                <p className="mt-2 text-sm text-muted-foreground">ログインして前回の続きから学習を再開しましょう。</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link to="/app/account/sign-in">ログインする</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-background/80 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle>次のステップ</CardTitle>
            <CardDescription>
              アカウントをさらに活用するための推奨アクションです。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              {!isActivated && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-100/40 p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-700">メール確認がまだ完了していません</p>
                    <p className="text-xs text-amber-700/80">
                      確認メールのリンクからアクセスするか、トークンを入力して認証を完了しましょう。
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-2 w-fit border-amber-300 text-amber-700">
                      <Link to="/app/account/activation" className="inline-flex items-center gap-1">
                        メール確認ページへ
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
                <LineChart className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">学習の進捗をチェック</p>
                  <p className="text-xs text-muted-foreground">
                    ダッシュボードで最近の学習結果や推奨トレーニングを確認できます。
                  </p>
                  <Button asChild size="sm" variant="ghost" className="mt-2 w-fit px-0 text-sm text-primary">
                    <Link to="/app/dashboard" className="inline-flex items-center gap-1">
                      ダッシュボードを開く
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
