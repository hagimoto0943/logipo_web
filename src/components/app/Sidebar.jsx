import * as React from "react"
import { Bot, SquarePen, Settings2 } from "lucide-react"
import { NavMain } from "@components/ui/nav-main"
import { NavUser } from "@components/ui/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "User",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "添削",
      url: "/app/reviews/new",
      icon: SquarePen,
      isActive: true,
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
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
