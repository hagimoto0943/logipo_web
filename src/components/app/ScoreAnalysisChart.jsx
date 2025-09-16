"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarRadiusAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { HelpCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@components/ui/chart"

export const description = "A radar chart with dots"


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hcl(--chart-2)",
  },
}

export function ScoreAnalysisChart({ scores, title, description }) {
  const chartData = scores ? [
    { name: "構成力", score: scores.structure || 0 },
    { name: "論理性", score: scores.logic || 0 },
    { name: "具体性", score: scores.concreteness || 0 },
    { name: "わかりやすさ", score: scores.clarity || 0 },
  ] : [];

  return (
    <Card>
      <CardHeader className="items-center">
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
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
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 14 }} tickFormatter={(value) => value}  />
            <PolarGrid />
            <PolarRadiusAxis domain={[0, 5]} tick={false} tickCount={6} axisLine={false} angle={90} />
            <Radar
              dataKey="score"
              fill="hsl(var(--chart-5))"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
