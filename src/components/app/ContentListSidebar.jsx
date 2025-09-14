import React, {useState, useEffect} from "react"
import { Link } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarGroupContent, SidebarInput, useSidebar } from "@components/ui/sidebar"
import { Label } from "@components/ui/label"
import { Switch } from "@components/ui/switch"
import ReviewApi from "@api/base/review"
import newInfiniteList from "@components/app/newInfiniteList"

export function ContentListSidebar({ ...props }) {
  const reviewApi = new ReviewApi()

  const getReviewList = async ({ offset, limit }) => {
    const res = await reviewApi.getList({ offset, limit })
    return {
      item: res.data || [],
      hasMore: (offset + res.data.length) < res.total
    }
  }

  const infiniteList = newInfiniteList({
    getList: getReviewList,
    ItemComponent: ReviewItem,
    limit: 10
  })

  return (
    <Sidebar variant="floating" {...props} className="hidden flex-1 md:flex" style={{ "--sidebar-width": "350px" }}>
      <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              文章添削履歴
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {infiniteList.render}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

const ReviewItem = ({ item }) => {
  return (
    <Link
      to={`/app/reviews/${item.id}`}
      key={item.id}
      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
    >
      <div className="flex w-full items-center gap-2">
        <span>{item.title}</span>
      </div>
      <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
        {item.original_text}
      </span>
      <div className="flex w-full items-center gap-2">
        <span className="ml-auto text-xs">{item?.structure_kind}</span>
        <span className="ml-auto text-xs">{new Date(item.created_at).toLocaleString()}</span>
      </div>
    </Link>
  )
}
