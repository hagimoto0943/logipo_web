import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { BicepsFlexed, CircleUserRound, PanelLeft, PanelLeftClose, SquarePen, Sparkles } from "lucide-react"
import { NavMain } from "@components/ui/nav-main"
import { NavUser } from "@components/ui/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator, useSidebar } from "@components/ui/sidebar"
import { useSession } from "@lib/providers/SessionProvider.jsx"

export function AppSidebar({
  ...props
}) {
  const location = useLocation()
  const { me, isLoading, isHydrated, signOut } = useSession()

  const navItems = useMemo(() => {
    const pathname = location.pathname || ""
    const baseItems = [
      {
        title: "添削",
        url: "/app/reviews",
        match: ["/app/reviews/new", "/app/reviews", "/app/dashboard"],
        icon: SquarePen,
        items: [
          { title: "新規作成", url: "/app/reviews/new" },
          { title: "添削履歴", url: "/app/reviews" },
          { title: "ダッシュボード", url: "/app/dashboard" },
        ],
      },
      {
        title: "トレーニング",
        url: "/app/training",
        icon: BicepsFlexed,
        items: [
          { title: "トレーニング", url: "/app/training" },
        ],
      },
      {
        title: "アカウント",
        url: "/app/account",
        icon: CircleUserRound,
        items: [
          { title: "アカウント設定", url: "/app/account" },
        ],
      },
    ]

    return baseItems.map((item) => {
      const prefixes = item.match || [item.url]
      const isActive = prefixes.some((prefix) => pathname.startsWith(prefix))
      const subItems = item.items?.map((subItem) => ({
        ...subItem,
        isActive: pathname.startsWith(subItem.url),
      }))
      return {
        ...item,
        isActive,
        items: subItems,
      }
    })
  }, [location.pathname])

  const userForNav = me ?? { status: "guest" }
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/80 bg-[#fafafa]"
      {...props}>
      <SidebarHeader className="border-b border-slate-200/80 px-4 pb-5 pt-6">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between gap-3"}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <Sparkles className="size-4" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-900">LOGIPO</p>
                <p className="text-xs text-slate-500">Writing Intelligence</p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 pb-4 pt-0">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarSeparator className="mx-3 my-4 bg-slate-200/70" />
      <SidebarFooter className="px-3 pb-6">
        <div className="space-y-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="
              flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-600 shadow-sm transition
              hover:border-primary/40 hover:text-slate-900 hover:shadow-md
              group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
            "
            aria-label={isCollapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
          >
            {isCollapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
            {!isCollapsed && <span>サイドバーを{isCollapsed ? "展開" : "折りたたむ"}</span>}
          </button>

          <NavUser user={userForNav} onLogout={signOut} isLoading={isLoading} isHydrated={isHydrated} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
