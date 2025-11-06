import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarGroupContent, SidebarInput, SidebarTrigger, useSidebar } from "@components/ui/sidebar"
import { useIsMobile } from "@lib/api/hooks/use-mobile"
import { Label } from "@components/ui/label"
import { Switch } from "@components/ui/switch"
import { History, Star } from "lucide-react"
import { cn } from "@lib/utils"
import { StructureKindBadge } from "@components/app/StructureKindBadge"
import ReviewApi from "@api/base/review"
import newInfiniteList from "@components/app/newInfiniteList"

export function ContentListSidebar({ width = "clamp(260px, 22vw, 360px)", collapsible, className = "", dense = false, overlay, ...props }) {
  const reviewApi = new ReviewApi()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [kind, setKind] = useState("all") // all | prep | sds | desc | free
  const isMobile = useIsMobile()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const getReviewList = async ({ offset, limit }) => {
    const params = { offset, limit }
    if (debouncedQuery) params.q = debouncedQuery
    if (kind && kind !== 'all') params.structure_kind = kind
    const res = await reviewApi.getList(params)
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
    limit: 10,
    resetDeps: [debouncedQuery, kind]
  })

  // Desktop: fully off-canvas (no icon rail width when collapsed)
  // Mobile: off-canvas overlay
  const resolvedOverlay = overlay ?? isMobile
  const resolvedCollapsible = collapsible ?? "offcanvas"

  const floatingCards = [
    {
      id: "card-1",
      position: "top-3 right-4",
      title: "ステータス更新",
      date: "2024.03.18",
      body: "田中さん：次回ミーティングの資料を共有しました！"
    },
    {
      id: "card-2",
      position: "bottom-2 left-3",
      title: "共有メモ",
      date: "2024.03.16",
      body: "レビューアサインを更新しました。"
    }
  ]

  return (
    <>
      <Sidebar
        {...props}
        className={cn(
          "hidden md:flex bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(56,189,248,0.18),transparent_45%),linear-gradient(to_bottom,#f4f9ff,#ffffff_45%,#f0f9ff)] text-slate-800 shadow-[0_30px_60px_-45px_rgba(14,116,144,0.45)]",
          "border-r border-sky-100/80",
          className
        )}
        collapsible={resolvedCollapsible}
        overlay={resolvedOverlay}
        style={{ "--sidebar-width": width }}
      >
        <SidebarHeader className="relative gap-4 overflow-hidden border-b border-sky-100/70 p-4 pb-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-100/80 via-transparent to-sky-200/40 backdrop-blur-sm" aria-hidden />
          <div className="pointer-events-none absolute -left-20 top-12 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-28 -top-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" aria-hidden />

          <div className="relative z-10 flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
              <History className="h-4 w-4 text-cyan-600" />
              <span className="tracking-wide">添削履歴</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="flex items-center gap-2 text-sm">
                <span className="text-xs font-medium text-sky-900/80">未読のみ</span>
                <Switch className="shadow-none data-[state=checked]:bg-cyan-500" />
              </Label>
              <SidebarTrigger className="h-8 w-8 rounded-full border border-sky-200 bg-white/80 text-cyan-600 shadow-sm backdrop-blur hover:bg-white" title="履歴を閉じる" aria-label="履歴を閉じる" />
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <div>
              <h2 className="text-base font-semibold text-sky-900">チームの声を素早くキャッチ</h2>
              <p className="mt-1 text-xs text-slate-500">検索やフィルターで、求めている添削履歴にすぐたどり着けます。</p>
            </div>
            <SidebarInput
              placeholder="キーワードで検索…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 border-sky-100/80 bg-white/80 text-sm text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {[
              {key:'all', label:'すべて'},
              {key:'prep', label:'PREP'},
              {key:'sds', label:'SDS'},
              {key:'desc', label:'DESC'},
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setKind(opt.key)}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors shadow-sm backdrop-blur",
                  kind===opt.key
                    ? "bg-cyan-500/90 text-white border-cyan-500"
                    : "bg-white/70 text-slate-600 hover:bg-sky-50/90 border-sky-100/80"
                )}
                aria-pressed={kind===opt.key}
              >
                {opt.label}
              </button>
            ))}
          </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {floatingCards.map(card => (
              <div
                key={card.id}
                className={cn(
                  "absolute w-48 rounded-2xl border border-white/60 bg-white/75 px-3 py-3 shadow-[0_15px_30px_-20px_rgba(14,116,144,0.45)] backdrop-blur-sm transition duration-700 ease-out",
                  "ring-1 ring-white/50",
                  card.position
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-500">{card.title}</span>
                <span className="mt-0.5 block text-[9px] text-slate-400">{card.date}</span>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-white/70 backdrop-blur-sm">
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {infiniteList.render}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {/* Mobile floating open button */}
      <OpenSidebarTrigger side={props.side || 'right'} />
    </>
  )
}

function OpenSidebarTrigger({ side = 'right' }) {
  const { open, toggleSidebar } = useSidebar()
  if (open) return null
  const sidePos = side === 'right' ? 'right-4' : 'left-4'
  return (
    <div className={`fixed ${sidePos} bottom-5 z-40 md:hidden`}>
      <SidebarTrigger
        onClick={toggleSidebar}
        className="h-10 w-10 rounded-full border bg-white shadow-lg text-stone-700 hover:bg-stone-50"
        title="履歴を開く"
        aria-label="履歴を開く"
      />
    </div>
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
  // Use theme-neutral chip (avoid strong colors)
  const scoreClass = "bg-secondary text-foreground/70 border-border"
  return (
    <Link
      to={`/app/reviews/${item.id}`}
      key={item.id}
      aria-current={isActive ? 'page' : undefined}
      className={`${activeCls} group flex flex-col items-start gap-1 ${baseItemPad} text-sm leading-tight rounded-md border border-transparent whitespace-nowrap ring-1 ring-transparent hover:ring-sidebar-border transition-colors`}
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
