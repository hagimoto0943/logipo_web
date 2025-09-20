"use client"

import { RadarChart } from "@mui/x-charts/RadarChart"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { HelpCircle } from "lucide-react"

export function StructureAnalysisChart({ structure, scores, title, description }) {
  // Prefer new "structure" shape: { point, reason, example, repoint }
  // Fallback to legacy "scores" shape to avoid breaking existing usage.
  const usingNewShape = Boolean(structure)

  const labels = usingNewShape
    ? ["Point(主張)", "Reason(理由)", "Example(具体例)", "Repoint(再主張)"]
    : ["構成力", "論理性", "具体性", "わかりやすさ"]

  const data = usingNewShape
    ? [
        structure?.point?.score ?? 0,
        structure?.reason?.score ?? 0,
        structure?.example?.score ?? 0,
        structure?.repoint?.score ?? 0,
      ]
    : [
        scores?.structure ?? 0,
        scores?.logic ?? 0,
        scores?.concreteness ?? 0,
        scores?.clarity ?? 0,
      ]

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
          <RadarChart
            height={250}
            series={[
              { data, fillArea: true, color: "hsl(var(--chart-5))" },
            ]}
            radar={{ metrics: labels, max: 5 }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm" />
    </div>
  )
}
