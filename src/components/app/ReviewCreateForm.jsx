import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Label } from "@components/ui/label"
import { Button } from "@components/ui/button"
import ReviewApi from "@api/base/review"

const STRUCTURE_OPTIONS = [
  { value: "prep", label: "PREP" },
  { value: "sds", label: "SDS" },
  { value: "desc", label: "DESC" },
  { value: "free", label: "FREE" },
]

export default function ReviewCreateForm({ onCreated }) {
  const reviewApi = new ReviewApi()
  const [structureKind, setStructureKind] = useState("sds")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = text.trim().length > 0 && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError("")
    try {
      const payload = {
        structure: structureKind,
        original_text: text,
      }
      const res = await reviewApi.post(payload)
      const created = res?.data || res
      if (onCreated && created?.id) onCreated(created)
    } catch (err) {
      setError(err?.message || "作成に失敗しました")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-md">新規添削</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label>構成</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              {STRUCTURE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={()=>setStructureKind(opt.value)}
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors ${structureKind===opt.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground hover:bg-muted border-border'}`}
                  aria-pressed={structureKind===opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="text">本文</Label>
            <textarea
              id="text"
              className="min-h-[180px] w-full rounded-md border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder="ここに文章を入力してください"
            />
            <div className="text-xs text-muted-foreground text-right">{text.length} 文字</div>
          </div>

          {error && (<div className="text-sm text-red-600">{error}</div>)}

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit}>{submitting ? '作成中…' : '添削を依頼'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
