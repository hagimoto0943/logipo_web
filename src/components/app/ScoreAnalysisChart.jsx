"use client"

import { RadarChart } from "@mui/x-charts/RadarChart"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { HelpCircle } from "lucide-react"

export function ScoreAnalysisChart({ scores, title, description }) {
  const labels = ["構成力", "論理性", "具体性", "わかりやすさ"]
  const data = [
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
