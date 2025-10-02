import { useEffect } from "react"
import { Outlet, NavLink, useLocation } from "react-router-dom"

import { buttonVariants } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { cn } from "@lib/utils"
import { useSession } from "@lib/providers/SessionProvider.jsx"
import { Loader2, MailCheck, MailWarning, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react"

const baseNavItems = [
  { label: "概要", to: "/app/account", key: "overview" },
  { label: "ログイン", to: "/app/account/sign-in", key: "sign-in", hideWhenAuthenticated: true },
  { label: "会員登録", to: "/app/account/sign-up", key: "sign-up", hideWhenAuthenticated: true },
  { label: "メール確認", to: "/app/account/activation", key: "activation", hideWhenActivated: true },
]

export default function AccountLayout() {
  const location = useLocation()
  const { me, isLoading, isHydrated } = useSession()

  const sessionResolved = isHydrated
  const isPending = !isHydrated || isLoading
  const statusValue = me?.status || "guest"
  const isGuest = sessionResolved ? (!me || statusValue === "guest") : false
  const isActivated = sessionResolved ? Boolean(me?.is_activate ?? me?.is_activated) : false
  const isEnabled = sessionResolved
    ? me?.is_enabled !== undefined
      ? Boolean(me.is_enabled)
      : true
    : false

  const displayName = sessionResolved
    ? me?.name || me?.email?.split("@")?.[0] || "ゲストユーザー"
    : "ログイン状態を確認中…"
  const displayEmail = sessionResolved ? me?.email || "guest@logipo" : "メールアドレス取得中…"
  const statusLabel = sessionResolved ? (isGuest ? "ゲスト" : statusValue) : "確認中…"

  const navItems = sessionResolved
    ? baseNavItems.filter((item) => {
        if (item.hideWhenAuthenticated && !isGuest) return false
        if (item.hideWhenActivated && isActivated) return false
        return true
      })
    : []

  useEffect(() => {
    if (!isHydrated) return
    if (!me || me.status === "guest") {
      const redirect = encodeURIComponent(location.pathname + location.search)
      window.location.href = `/login?redirect=${redirect}`
    }
  }, [isHydrated, me, location.pathname, location.search])

  if (!isHydrated || !me || me.status === "guest") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 認証状態を確認しています...
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <section className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/10 p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              アカウントセンター
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">こんにちは、{displayName}さん</h1>
              <p className="text-sm text-muted-foreground">
                ログイン状態、会員登録、メール確認など、アカウントに関する操作をここでまとめて管理できます。
              </p>
            </div>
            <div className="flex min-h-[38px] flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {!isPending ? (
                <>
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-medium text-foreground">
                    {displayEmail}
                  </span>
                  <Badge variant="muted" className="rounded-full">
                    ステータス: {statusLabel}
                  </Badge>
                  <Badge variant={isActivated ? "success" : "warning"} className="inline-flex items-center gap-1 rounded-full">
                    {isActivated ? <MailCheck className="h-3.5 w-3.5" /> : <MailWarning className="h-3.5 w-3.5" />}
                    {isActivated ? "メール確認済み" : "メール未確認"}
                  </Badge>
                  <Badge variant={isEnabled ? "success" : "destructive"} className="inline-flex items-center gap-1 rounded-full">
                    {isEnabled ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                    {isEnabled ? "利用可能" : "利用制限"}
                  </Badge>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="h-8 w-40 animate-pulse rounded-full bg-muted" />
                  <span className="h-8 w-28 animate-pulse rounded-full bg-muted" />
                  <span className="h-8 w-28 animate-pulse rounded-full bg-muted" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex min-h-[42px] flex-wrap items-center gap-2 rounded-full border border-border/50 bg-background/70 p-1 text-sm shadow-inner">
          {!isPending ? (
            navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }),
                    "rounded-full px-4"
                  )
                }
                end={item.to === "/app/account"}
              >
                {item.label}
              </NavLink>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-8 w-20 animate-pulse rounded-full bg-muted" />
              <span className="h-8 w-24 animate-pulse rounded-full bg-muted" />
              <span className="h-8 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          )}
        </div>
      </section>

      <div>
          {isPending && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> 状態を取得しています...
            </p>
          )}
        <Outlet />
      </div>
    </div>
  )
}
