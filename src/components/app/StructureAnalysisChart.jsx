"use client"

import { RadarChart } from "@mui/x-charts/RadarChart"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { HelpCircle } from "lucide-react"

export function StructureAnalysisChart({ structure, scores, title, description, structureKind }) {
  // Build labels/data based on structure kind. Fallback to legacy `scores`.
  const hasStructure = Boolean(structure)

  const CONFIG = {
    prep: [
      { key: 'point', label: '主張' },
      { key: 'reason', label: '理由' },
      { key: 'example', label: '具体例' },
      { key: 'repoint', label: '再主張' },
    ],
    sds: [
      { key: 'summary1', label: '要約' },
      { key: 'details', label: '詳細' },
      { key: 'summary2', label: '結論' },
    ],
    desc: [
      { key: 'describe', label: '描写' },
      { key: 'express', label: '表現' },
      { key: 'suggest', label: '提案' },
      { key: 'choose', label: '選択' },
    ],
    free: [
      { key: 'overall', label: '全体' },
      { key: 'clarity', label: '明瞭性' },
      { key: 'impression', label: '印象' },
    ],
  }

  const inferKind = (() => {
    if (!hasStructure) return undefined
    if (structureKind) return structureKind
    const keys = Object.keys(structure || {})
    const hasAll = (arr) => arr.every((k) => keys.includes(k))
    if (hasAll(['point', 'reason', 'example', 'repoint'])) return 'prep'
    if (hasAll(['summary1', 'details', 'summary2'])) return 'sds'
    if (hasAll(['describe', 'express', 'suggest', 'choose'])) return 'desc'
    if (hasAll(['overall', 'clarity', 'impression'])) return 'free'
    return undefined
  })()

  let labels = []
  let data = []

  if (hasStructure && inferKind && CONFIG[inferKind]) {
    const seq = CONFIG[inferKind]
    seq.forEach(({ key, label }) => {
      if (structure?.[key]) {
        labels.push(label)
        data.push(structure?.[key]?.score ?? 0)
      }
    })
  } else if (!hasStructure) {
    labels = ['構成力', '論理性', '具体性', 'わかりやすさ']
    data = [
      scores?.structure ?? 0,
      scores?.logic ?? 0,
      scores?.concreteness ?? 0,
      scores?.clarity ?? 0,
    ]
  }

  // If still nothing to display, avoid rendering the chart to prevent radar errors
  const canRender = labels.length > 0 && data.length > 0

  return (
    <div className="bg-white rounded-lg border">
      <CardHeader className="items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-md font-semibold text-stone-600">{title}</CardTitle>
          {description && (
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="text-sm">{description}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto max-w-full">
          {canRender ? (
            <RadarChart
              height={250}
              series={[{ data, fillArea: true, color: "hsl(var(--chart-5))" }]}
              radar={{ metrics: labels, max: 5 }}
            />
          ) : (
            <div className="h-[250px] grid place-items-center text-sm text-muted-foreground">
              データがありません
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm" />
    </div>
  )
}
