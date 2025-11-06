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

export default function Form({
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
    <div>
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 lg:px-16 py-12 lg:py-20">
          {/* Method Selector */}
          {!currentAnalysis && (
            <div className="mb-8">
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="text-sm text-slate-500 bg-transparent border-none outline-none cursor-pointer hover:text-slate-700 transition-colors"
              >
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}法
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Editor */}
          {!currentAnalysis ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="文章を入力してください..."
              className="w-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none text-slate-800 placeholder:text-slate-300"
              autoFocus
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[500px]"
            >
              <div className="leading-relaxed text-slate-800">
                {renderTextWithHighlights()}
              </div>
            </motion.div>
          )}

          {/* Action Bar - Inline at bottom */}
          <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {text.length} 文字
            </div>
            
            <div className="flex gap-2">
              {!currentAnalysis ? (
                <Button
                  onClick={analyzeText}
                  disabled={!text.trim() || isAnalyzing}
                  className="bg-[#4285F4] hover:bg-[#3367d6] text-white px-5 py-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm shadow-sm hover:shadow-md"
                >
                  {isAnalyzing ? '分析中...' : '分析'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setText('');
                      onAnalysisComplete(null);
                      onHighlightSelect(null);
                    }}
                    variant="ghost"
                    className="px-4 py-1.5 rounded-md text-sm text-slate-600"
                  >
                    リセット
                  </Button>
                  {/* Mobile Feedback Button */}
                  <Button
                    onClick={() => setIsMobileFeedbackOpen(true)}
                    className="lg:hidden bg-[#4285F4] hover:bg-[#3367d6] text-white px-5 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md"
                  >
                    結果を見る
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Feedback Sheet */}
      <MobileFeedbackSheet
        analysis={currentAnalysis}
        selectedHighlight={selectedHighlight}
        onHighlightSelect={onHighlightSelect}
        isOpen={isMobileFeedbackOpen}
        onClose={() => setIsMobileFeedbackOpen(false)}
      />
    </div>
  )
}
