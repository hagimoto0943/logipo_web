import { useState, useRef, useEffect, useCallback } from 'react'

export default function newInfiniteList({ getList, ItemComponent, limit=30, resetDeps = [], ...props}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)

  const containerRef = useRef(null)
  const sentinelRef = useRef(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await getList({ offset: offsetRef.current, limit })
      const list = res.item || []
      setItems(prevItems => [...prevItems, ...list])
      offsetRef.current += list.length
      setHasMore(!!res.hasMore)
    } finally {                                                                         
      setLoading(false)
    }
  }, [getList, limit, loading, hasMore])

  useEffect(() => {
    loadMore()
  }, [])

  // Reset list when dependencies change (e.g., search query, filters)
  useEffect(() => {
    setItems([])
    offsetRef.current = 0
    setHasMore(true)
    // Kick a new load after reset
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  useEffect(() => {
    const root = containerRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return
    
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !loading) {
        loadMore()
      }
    }, { root, threshold: 0.1 })

    io.observe(sentinel)
    return () => io.disconnect()
  }, [loadMore, hasMore, loading])

  const render = (
    <div ref={containerRef} style={{ overflowY:'auto', height:'100%' }} {...props}>
      {items.map((item, i) => <ItemComponent key={item.id ?? i} item={item} />)}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <div style={{ padding: 8 }}>読み込み中...</div>}
      {!hasMore && <div style={{ padding: 8, color:'#777' }}>すべて読み込みました</div>}
    </div>
  )

  return {render, items, loading, hasMore, loadMore}
}
