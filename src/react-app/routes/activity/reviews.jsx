import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewApi from "@api/base/review";
import { HistoryView } from "@components/app/HistoryView";

export default function Reviews() {
  const reviewApi = new ReviewApi()
  const navigate = useNavigate();
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
      const formattedList = list.map(item => ({
        id: item.id,
        timestamp: new Date(item.created_at).getTime(),
        method: item.structure_kind,
        originalText: item.original_text,
        overallScore: item.result?.score_analysis?.score || {},
        highlights: item.result?.structure_analysis || [],
      }));
      setItems(prev => [...prev, ...formattedList])
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

  const handleSelectAnalysis = (analysis) => {
    navigate(`/app/reviews/${analysis.id}`);
  };

  return (
    <HistoryView analyses={items} onSelectAnalysis={handleSelectAnalysis} />
  )
}