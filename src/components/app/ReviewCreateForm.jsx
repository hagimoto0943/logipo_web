import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@components/ui/button"
import { AlertCircle, Send } from "lucide-react"
import ReviewApi from "@api/base/review"
import { cn } from "@lib/utils"

const STRUCTURE_OPTIONS = [
  { value: "prep", label: "PREP" },
  { value: "sds", label: "SDS" },
  { value: "desc", label: "DESC" },
  { value: "free", label: "FREE" },
]

export default function ReviewCreateForm({
  onCreated,
  onSubmit,
  structureOptions = STRUCTURE_OPTIONS,
  defaultStructure,
  placeholder = "メッセージを入力...",
  submitLabel = "送信",
  className = "",
  hideStructure = false,
  showFooterButton = false,
}) {
  const fallbackStructure = useMemo(() => {
    if (defaultStructure) return defaultStructure
    return structureOptions?.[0]?.value ?? "sds"
  }, [defaultStructure, structureOptions])

  const [structureKind, setStructureKind] = useState(fallbackStructure)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setStructureKind(fallbackStructure)
  }, [fallbackStructure])

  const canSubmit = text.trim().length > 0 && !submitting

  const submitReview = async () => {
    if (submitting || text.trim().length === 0) return
    setSubmitting(true)
    setError("")
    try {
      const payload = {
        structure: structureKind,
        original_text: text,
      }
      const handler = onSubmit || (async (body) => {
        const api = new ReviewApi()
        const response = await api.post(body)
        return response?.data || response
      })

      const result = await handler({
        structure: payload.structure,
        text: text,
        original_text: text,
      })

      const created = result?.data || result
      if (onCreated && created?.id) onCreated(created)
      if (!onCreated || created?.id) {
        setText("")
      }
      setError("")
    } catch (err) {
      setError(err?.message || "作成に失敗しました")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await submitReview()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-[28px] border-2 border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_32px_60px_-40px_rgba(30,64,175,0.35)]"
      >
        <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl" aria-hidden />

        <div className="relative flex flex-col gap-6 px-6 py-6 sm:px-10 sm:py-8">
          {!hideStructure && structureOptions?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-2 shadow-sm">
              {structureOptions.map((opt) => {
                const isActive = structureKind === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStructureKind(opt.value)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "bg-white/80 text-slate-600 hover:bg-slate-100"
                    )}
                    aria-pressed={isActive}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}

          <div className="relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/85 shadow-inner">
            <textarea
              id="text"
              className="min-h-[320px] w-full resize-none bg-transparent px-5 pb-20 pt-5 text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none"
              value={text}
              onChange={(event) => {
                setError("")
                setText(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
                  event.preventDefault()
                  submitReview()
                }
              }}
              placeholder={placeholder}
            />
            <div className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-primary/5 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-amber-100/30 blur-3xl" aria-hidden />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">{text.length}文字</span>
                <span className="hidden sm:inline">Enter で送信 / Shift + Enter で改行</span>
              </div>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary/90 disabled:opacity-40"
                aria-label={submitLabel}
              >
                <Send className="size-4" />
                <span>{submitting ? "送信中…" : submitLabel}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">ヒント</span>
            <span>構造に沿って段落を分けると、フィードバックがより具体的になります。</span>
            <span>送信後は自動で添削が開始されます。</span>
          </div>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive" role="alert" aria-live="polite">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {showFooterButton && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canSubmit}
            className="rounded-full"
            onClick={handleSubmit}
          >
            {submitting ? "送信中…" : submitLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
