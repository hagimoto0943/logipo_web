"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  MailCheck,
  MailWarning,
  ShieldAlert,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/ui/avatar"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@components/ui/sidebar"
import { queueFlash, showFlash } from "../../scripts/flash-messages.js"

export function NavUser({
  user,
  onLogout,
  isLoading,
  isHydrated,
}) {
  const { isMobile } = useSidebar()
  const isPending = !isHydrated || isLoading
  const rawName = user?.name || user?.email?.split("@")?.[0] || "Guest"
  const displayName = isPending ? "読み込み中..." : rawName
  const displayEmail = isPending ? "---" : user?.email || "guest@logipo"
  const status = user?.status || "guest"
  const isActivated = Boolean(
    user?.is_activate ?? user?.is_activated
  )
  const isEnabled = user?.is_enabled !== undefined ? Boolean(user.is_enabled) : true
  const statusLabel = isPending ? "確認中..." : status === "guest" ? "ゲスト" : status

  const initials = rawName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const isGuest = !isPending && (!user || user.status === "guest")

  const handleLogout = (event) => {
    event.preventDefault()
    if (!onLogout || isPending) return
    Promise.resolve(onLogout())
      .then(() => {
        queueFlash("ログアウトしました", { variant: "success" })
        window.location.href = "/login"
      })
      .catch((err) => {
        const message = err?.message || "ログアウトに失敗しました"
        showFlash(message, { variant: "error" })
      })
  }

  if (isGuest) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-background/80 p-4 text-sm">
            <p className="text-xs text-muted-foreground">ログインして学習データを同期しましょう。</p>
            <Button asChild size="sm" className="w-full">
              <a href="/sign-up">会員登録</a>
            </Button>
            <Button asChild size="sm" variant="outline" className="w-full">
              <a href="/login">ログイン</a>
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                {!isPending && user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                <AvatarFallback className="rounded-lg">{initials || "G"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {isPending ? <span className="block h-4 w-24 animate-pulse rounded bg-muted" /> : displayName}
                </span>
                <span className="truncate text-xs">
                  {isPending ? <span className="block h-3 w-28 animate-pulse rounded bg-muted" /> : displayEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {!isPending && user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                  <AvatarFallback className="rounded-lg">{initials || "G"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {isPending ? "読み込み中..." : displayName}
                  </span>
                  <span className="truncate text-xs">
                    {isPending ? "---" : displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => { window.location.href = "/app/account" }}>
                <UserRoundCog />
                アカウント設定
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-default">
                <BadgeCheck className="mr-2 h-4 w-4" />
                <div className="flex flex-1 flex-col">
                  <span className="text-xs text-muted-foreground">ステータス</span>
                  <span className="text-sm font-medium leading-none">{statusLabel}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-default">
                {(isActivated ? <MailCheck className="mr-2 h-4 w-4" /> : <MailWarning className="mr-2 h-4 w-4" />)}
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span className="text-sm">メール確認</span>
                  <Badge variant={isPending ? "muted" : isActivated ? "success" : "warning"}>
                    {isPending ? "確認中" : isActivated ? "確認済み" : "未確認"}
                  </Badge>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="cursor-default">
                {(isEnabled ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldAlert className="mr-2 h-4 w-4" />)}
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span className="text-sm">利用状態</span>
                  <Badge variant={isPending ? "muted" : isEnabled ? "success" : "destructive"}>
                    {isPending ? "確認中" : isEnabled ? "利用可能" : "利用制限"}
                  </Badge>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleLogout}
              className={isPending ? "opacity-50 pointer-events-none" : ""}
            >
              <LogOut />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
