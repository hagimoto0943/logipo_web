import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { useSession } from "@lib/providers/SessionProvider.jsx"
import { Loader2 } from "lucide-react"

export default function AccountLayout() {
  const location = useLocation()
  const { me, isLoading, isHydrated } = useSession()

  const sessionResolved = isHydrated
  const isPending = !isHydrated || isLoading

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
    <div className="container mx-auto px-0 py-0">
      <div>
        <Outlet />
      </div>
    </div>
  )
}
