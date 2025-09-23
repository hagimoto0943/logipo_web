"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { RadarChart } from "@mui/x-charts/RadarChart"

export default function FeedbackScorePanel({ feedback, scores, title = "総合フィードバック", height = 280, minHeight = 220 }) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect?.width || 0
        setWidth(w)
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Responsive labels: fall back to shorter text on narrow widths
  const labels = useMemo(() => {
    if (width && width < 380) return ["構成力", "論理性", "具体性", "明瞭性"]
    return ["構成力", "論理性", "具体性", "わかりやすさ"]
  }, [width])
  const data = [
    scores?.structure ?? 0,
    scores?.logic ?? 0,
    scores?.concreteness ?? 0,
    scores?.clarity ?? 0,
  ]

  const hasScores = data.some((v) => (v ?? 0) > 0)
  const hasFeedback = Boolean(feedback && String(feedback).trim().length > 0)

  if (!hasScores && !hasFeedback) return null

  // Chart height scales with available width, clamped to [minHeight, height]
  const chartHeight = Math.max(minHeight, Math.min(height, Math.floor(width || minHeight)))

  return (
    <div className="bg-white rounded-lg border p-5">
      <div className="md:grid grid-cols-12 gap-6 items-start">
        {hasFeedback && (
          <div className="col-span-12 md:col-span-8">
            <h2 className="text-md font-semibold text-stone-700 mb-3">{title}</h2>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
        {hasScores && (
          <div className="hidden md:block md:col-span-4" ref={containerRef}>
            <div className="bg-white rounded-lg border">
              <div className="p-3">
                <RadarChart
                  height={chartHeight}
                  series={[{ data, fillArea: true, color: "hsl(var(--primary))" }]}
                  radar={{ metrics: labels, max: 5 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
