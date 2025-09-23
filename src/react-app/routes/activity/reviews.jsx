import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReviewApi from "@api/base/review";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import { Button } from "@components/ui/button";

export default function Reviews() {
  const reviewApi = new ReviewApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const load = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await reviewApi.getList({ offset, limit })
      const list = Array.isArray(res?.data) ? res.data : []
      setItems(prev => [...prev, ...list])
      const nextOffset = offset + list.length
      setOffset(nextOffset)
      setHasMore(nextOffset < (res?.total || 0))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial load
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-stone-700">添削一覧</h1>
          <Button asChild>
            <Link to="/app/reviews/new">新規作成</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <Link
              to={`/app/reviews/${item.id}`}
              key={item.id}
              className="block rounded-md border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <StructureKindBadge structureKind={item?.structure_kind} />
                  <span className="text-sm font-medium text-stone-800 truncate">
                    {item.title || `レビュー #${item.id}`}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                </span>
              </div>
              {item.original_text && (
                <div className="mt-2 text-xs text-muted-foreground truncate">
                  {String(item.original_text).replace(/\s+/g,' ').slice(0, 120)}{String(item.original_text).length > 120 ? '…' : ''}
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          {hasMore ? (
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? '読み込み中…' : 'もっと読み込む'}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">すべて表示しました</span>
          )}
        </div>
      </div>
    </div>
  )
}
