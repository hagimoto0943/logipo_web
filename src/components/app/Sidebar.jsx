import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { Bot, SquarePen, Settings2 } from "lucide-react"
import { NavMain } from "@components/ui/nav-main"
import { NavUser } from "@components/ui/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@components/ui/sidebar"
import { useSession } from "@lib/providers/SessionProvider.jsx"

export function AppSidebar({
  ...props
}) {
  const location = useLocation()
  const { me, isLoading, signOut } = useSession()

  const navItems = useMemo(() => {
    const pathname = location.pathname || ""
    const baseItems = [
      {
        title: "添削",
        url: "/app/reviews",
        match: ["/app/reviews", "/app/dashboard"],
        icon: SquarePen,
        items: [
          { title: "新規作成", url: "/app/reviews/new" },
          { title: "一覧", url: "/app/reviews" },
          { title: "ダッシュボード", url: "/app/dashboard" },
        ],
      },
      {
        title: "トレーニング",
        url: "/app/training",
        icon: Bot,
        items: [
          { title: "トレーニング", url: "/app/training" },
        ],
      },
      {
        title: "アカウント",
        url: "/app/account",
        icon: Settings2,
        items: [
          { title: "アカウント設定", url: "/app/account" },
        ],
      },
    ]

    return baseItems.map((item) => {
      const prefixes = item.match || [item.url]
      const isActive = prefixes.some((prefix) => pathname.startsWith(prefix))
      return {
        ...item,
        isActive,
      }
    })
  }, [location.pathname])

  const userForNav = me || { status: "guest" }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userForNav} onLogout={signOut} isLoading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
