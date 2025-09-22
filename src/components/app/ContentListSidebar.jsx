import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarGroupContent, SidebarInput, SidebarTrigger, useSidebar } from "@components/ui/sidebar"
import { Label } from "@components/ui/label"
import { Switch } from "@components/ui/switch"
import { History, Star } from "lucide-react"
import { StructureKindBadge } from "@components/app/StructureKindBadge"
import ReviewApi from "@api/base/review"
import newInfiniteList from "@components/app/newInfiniteList"

export function ContentListSidebar({ width = "clamp(260px, 22vw, 360px)", collapsible = "icon", className = "", dense = false, overlay = false, ...props }) {
  const reviewApi = new ReviewApi()

  const getReviewList = async ({ offset, limit }) => {
    const res = await reviewApi.getList({ offset, limit })
    return {
      item: res.data || [],
      hasMore: (offset + res.data.length) < res.total
    }
  }

  const ItemWrapper = (props) => {
    const location = useLocation()
    const isActive = typeof location?.pathname === 'string' && location.pathname.includes(`/app/reviews/${props.item?.id}`)
    return <ReviewItem {...props} dense={dense} isActive={isActive} />
  }

  const infiniteList = newInfiniteList({
    getList: getReviewList,
    ItemComponent: ItemWrapper,
    limit: 10
  })

  return (
    <Sidebar
      {...props}
      className={`hidden md:flex ${className}`}
      collapsible={collapsible}
      overlay={overlay}
      style={{ "--sidebar-width": width }}
    >
      <SidebarHeader className="gap-3.5 border-b p-4 sticky top-0 z-10 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/75">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-foreground text-neutral-700 font-bold">
            <History className="h-4 w-4 text-muted-foreground" />
            <span>添削履歴</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
            <SidebarTrigger className="h-7 w-7 rounded-md border bg-white/70 text-stone-700 hover:bg-white" title="履歴を閉じる" aria-label="履歴を閉じる" />
          </div>
        </div>
        <SidebarInput placeholder="検索…" />
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

const ReviewItem = ({ item, dense = false, isActive = false }) => {
  const baseItemPad = dense ? "p-3" : "p-4"
  const titleSize = dense ? "text-[13px]" : "text-sm"
  const metaSize = dense ? "text-[10px]" : "text-xs"
  const activeCls = isActive ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

  // Derive preview text (fallbacks)
  const rawPreview = item?.preview_text || item?.result?.feedback || item?.original_text || ""
  const previewCollapsed = rawPreview ? rawPreview.replace(/\s+/g, " ").slice(0, 80) + (rawPreview.length > 80 ? "…" : "") : null

  // Derive average score if available
  const scoreObj = item?.result?.score_analysis?.score || null
  const scoreValues = scoreObj ? ["structure","logic","concreteness","clarity"].map(k => scoreObj?.[k]).filter(v => typeof v === 'number') : []
  const avgScore = scoreValues.length ? Math.round((scoreValues.reduce((a,b)=>a+b,0)/scoreValues.length)*10)/10 : null
  const scoreClass = avgScore == null
    ? "bg-gray-100 text-gray-600 border-gray-200"
    : avgScore >= 4
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : avgScore >= 3
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-rose-100 text-rose-700 border-rose-200"
  return (
    <Link
      to={`/app/reviews/${item.id}`}
      key={item.id}
      aria-current={isActive ? 'page' : undefined}
      className={`${activeCls} group flex flex-col items-start gap-1 ${baseItemPad} text-sm leading-tight rounded-md border border-transparent transition-colors whitespace-nowrap ring-1 ring-transparent hover:ring-sidebar-border`}
    >
      <div className="flex w-full items-center gap-2">
        <span className={`font-semibold text-stone-800 ${titleSize} truncate w-full`}>{item.title || '無題'}</span>
        {avgScore != null && (
          <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${scoreClass}`} title={`平均スコア: ${avgScore}`}>
            <Star className="h-3 w-3" />
            {avgScore.toFixed(1)}
          </span>
        )}
      </div>
      {previewCollapsed && (
        <div className="w-full text-[11px] text-muted-foreground/90 leading-snug truncate">
          {previewCollapsed}
        </div>
      )}
      <div className="flex w-full items-center justify-between gap-2 mt-0.5">
        <StructureKindBadge structureKind={item?.structure_kind} />
        <span className={`${metaSize} text-muted-foreground tabular-nums`}>
          {new Date(item.created_at).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
        </span>
      </div>
    </Link>
  )
}
