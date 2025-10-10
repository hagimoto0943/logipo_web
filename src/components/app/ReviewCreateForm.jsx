import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@components/ui/button"
import { AlertCircle, Send } from "lucide-react"
import ReviewApi from "@api/base/review"

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
    <form className={`space-y-3 ${className}`} onSubmit={handleSubmit}>
      <div className="group rounded-3xl border border-border/60 bg-background/90 shadow-sm transition-all focus-within:border-primary/50 focus-within:shadow-lg focus-within:ring-1 focus-within:ring-primary/20">
        {!hideStructure && structureOptions?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 px-4 py-3">
            {structureOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStructureKind(opt.value)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition ${
                  structureKind === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                aria-pressed={structureKind === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <textarea
            id="text"
            className="h-40 w-full resize-none border-0 bg-transparent px-4 pb-12 pt-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
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
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              size="icon"
              className="rounded-full shadow-lg transition hover:scale-105"
              disabled={!canSubmit}
              aria-label={submitLabel}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive" role="alert" aria-live="polite">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {showFooterButton && (
        <div className="flex justify-end">
          <Button type="submit" variant="outline" size="sm" disabled={!canSubmit} className="rounded-full">
            {submitting ? "送信中…" : submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}
