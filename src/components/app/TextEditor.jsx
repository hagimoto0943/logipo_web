import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Button } from '@components/ui/button';
import { motion } from 'motion/react';
import { MobileFeedbackSheet } from '@components/app/MobileFeedbackSheet';
import ReviewApi from '@api/base/review';

const STRUCTURE_CONFIG = {
  prep: [
    { key: 'point', label: 'P', description: '文章の主張（Point）にあたる部分です。', colorVar: '--tone-1' },
    { key: 'reason', label: 'R', description: '理由（Reason）を示す部分です。', colorVar: '--tone-2' },
    { key: 'example', label: 'E', description: '具体例（Example）を示す部分です。', colorVar: '--tone-3' },
    { key: 'repoint', label: 'P', description: '再主張（Re:point）を示す部分です。', colorVar: '--tone-4' },
  ],
  sds: [
    { key: 'summary1', label: 'S', description: '要点（Summary）を示す部分です。', colorVar: '--chart-2' },
    { key: 'details', label: 'D', description: '詳細（Details）を示す部分です。', colorVar: '--chart-3' },
    { key: 'summary2', label: 'S', description: '要点（Summary）を示す部分です。', colorVar: '--chart-4' },
  ],
  desc: [
    { key: 'describe', label: 'D', description: '描写（Describe）を示す部分です。', colorVar: '--chart-1' },
    { key: 'express', label: 'E', description: '説明（Express）を示す部分です。', colorVar: '--chart-5' },
    { key: 'suggest', label: 'S', description: '提案（Suggest）を示す部分です。', colorVar: '--chart-2' },
    { key: 'choose', label: 'C', description: '選択（Choose）を示す部分です。', colorVar: '--chart-3' },
  ],
  free: [
    { key: 'overall', label: 'O', description: '全体（Overall）の評価です。', colorVar: '--chart-1' },
    { key: 'clarity', label: 'C', description: '明確性（Clarity）を示す部分です。', colorVar: '--chart-2' },
    { key: 'impression', label: 'I', description: '印象（Impression）を示す部分です。', colorVar: '--chart-3' },
  ],
};

const METHODS = [
  { value: 'prep', label: 'PREP' },
  { value: 'sds', label: 'SDS' },
  { value: 'desc', label: 'DESC' },
  { value: 'free', label: 'FREE' },
];

const getKindMeta = (key, inferKind) => {
  const kinds = STRUCTURE_CONFIG[inferKind?.toLowerCase()] || [];
  return kinds.find((k) => k.key === key) || { colorVar: '--tone-1', label: key, description: '' };
};

const colorFromVar = (varName, alpha = 1) => {
  if (!varName) return `hsl(var(--muted-foreground) / ${alpha})`;
  if (varName.startsWith('--')) {
    return `hsl(var(${varName})${alpha < 1 ? ` / ${alpha}` : ''})`;
  }
  return varName;
};

const getQuality = (score) => {
  if (score == null) return { colorVar: '--muted-foreground', label: '未評価' };
  if (score >= 4.5) return { colorVar: '--chart-2', label: 'とても良い' };
  if (score >= 4) return { colorVar: '--chart-2', label: '良い' };
  if (score >= 3) return { colorVar: '--chart-4', label: '普通' };
  if (score >= 2) return { colorVar: '--chart-5', label: '要改善' };
  return { colorVar: '--destructive', label: '改善が必要' };
};

const buildHighlightsFromStructure = (structure, inferKind) => {
  if (!structure) return [];
  return Object.entries(structure)
    .map(([key, value]) => {
      if (!value?.text) return null;
      const startIndex = Number.isFinite(value.startIndex)
        ? value.startIndex
        : Number.isFinite(value.start_index)
          ? value.start_index
          : undefined;
      const endIndex = Number.isFinite(value.endIndex)
        ? value.endIndex
        : Number.isFinite(value.end_index)
          ? value.end_index
          : undefined;
      const label = getKindMeta(key, inferKind)?.label || key;
      return {
        key,
        type: label,
        text: value.text,
        score: value.score,
        comment: value.comment ?? value.feedback ?? '',
        startIndex,
        endIndex,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (Number.isFinite(a.startIndex) && Number.isFinite(b.startIndex)) {
        return a.startIndex - b.startIndex;
      }
      return 0;
    });
};

// APIレスポンスをTextEditor用のフォーマットに変換
const normalizeApiResponse = (apiResponse) => {
  if (!apiResponse) return null;
  
  const result = apiResponse.result || {};
  const structureKind = apiResponse.structure_kind || result.structure_kind || 'prep';
  const structureAnalysis = result.structure_analysis || {};
  
  return {
    id: apiResponse.id,
    method: structureKind,
    originalText: apiResponse.original_text,
    structureAnalysis: structureAnalysis,
    scoreAnalysis: result.score_analysis,
    feedback: result.feedback,
    originalFeedback: result.original_feedback,
    modelText: result.model_text,
    highlights: buildHighlightsFromStructure(structureAnalysis, structureKind),
  };
};

export function TextEditor({
  onAnalysisComplete = () => {},
  currentAnalysis,
  selectedHighlight,
  onHighlightSelect = () => {},
}) {
  const [text, setText] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('prep');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileFeedbackOpen, setIsMobileFeedbackOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const markRefs = useRef({});
  const suppressScrollRef = useRef(false);
  const [showHighlightGuide, setShowHighlightGuide] = useState(false);

  useEffect(() => {
    if (currentAnalysis && currentAnalysis.structureAnalysis) {
      const availableKeys = Object.keys(currentAnalysis.structureAnalysis);
      if (availableKeys.length > 0 && (!activeKey || !availableKeys.includes(activeKey))) {
        setActiveKey(availableKeys[0]);
      } else if (availableKeys.length === 0) {
        setActiveKey(null);
      }
    } else {
      setActiveKey(null);
    }
  }, [currentAnalysis]);

  useEffect(() => {
    if (currentAnalysis && typeof window !== 'undefined') {
      const seen = window.localStorage.getItem('logipop-highlight-guide');
      if (!seen) {
        setShowHighlightGuide(true);
      }
    }
  }, [currentAnalysis]);

  useEffect(() => {
    if (selectedHighlight?.key) {
      setActiveKey(selectedHighlight.key);
      if (!suppressScrollRef.current) {
        scrollToHighlight(selectedHighlight.key);
      }
    } else if (selectedHighlight === null) {
      setActiveKey(null);
    }
    suppressScrollRef.current = false;
  }, [selectedHighlight]);


  const highlightSegments = useMemo(() => {
    if (!currentAnalysis) return [];
    const inferKind = currentAnalysis.method?.toLowerCase();
    const baseText = currentAnalysis.originalText || '';
    const base = currentAnalysis.highlights && currentAnalysis.highlights.length > 0
      ? currentAnalysis.highlights
      : buildHighlightsFromStructure(currentAnalysis.structureAnalysis, inferKind);
    if (!base?.length) return [];

    const normalized = [];
    let searchIndex = 0;

    base.forEach((seg, index) => {
      if (!seg?.text) return;
      const key = seg.key || (typeof seg.type === 'string' ? seg.type.toLowerCase() : `segment-${index}`);
      const fallbackStart = baseText.indexOf(seg.text, Math.max(0, searchIndex));
      const start = Number.isFinite(seg.startIndex) ? seg.startIndex : fallbackStart;
      const safeStart = start >= 0 ? start : searchIndex;
      const textLength = seg.text.length;
      const end = Number.isFinite(seg.endIndex) ? seg.endIndex : safeStart + textLength;
      searchIndex = end > searchIndex ? end : searchIndex;

      normalized.push({
        key,
        type: seg.type || getKindMeta(key, inferKind).label || key,
        text: seg.text,
        score: seg.score,
        comment: seg.comment ?? seg.feedback ?? '',
        startIndex: safeStart,
        endIndex: end,
      });
    });

    return normalized.sort((a, b) => a.startIndex - b.startIndex);
  }, [currentAnalysis]);

  useEffect(() => {
    markRefs.current = {};
  }, [highlightSegments]);

  const scrollToHighlight = useCallback((key) => {
    const el = markRefs.current[key];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, []);

  const dismissHighlightGuide = useCallback(() => {
    setShowHighlightGuide(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('logipop-highlight-guide', 'seen');
    }
  }, []);

  const selectSegment = useCallback((key, { scroll = false } = {}) => {
    suppressScrollRef.current = true;
    if (showHighlightGuide) {
      dismissHighlightGuide();
    }

    if (!key) {
      setActiveKey(null);
      if (selectedHighlight) {
        onHighlightSelect(null);
      }
      return;
    }

    const seg = highlightSegments.find((segment) => segment.key === key);
    if (!seg) {
      suppressScrollRef.current = false;
      return;
    }

    setActiveKey(key);
    if (!selectedHighlight || selectedHighlight.key !== key) {
      onHighlightSelect(seg);
    }

    if (scroll) {
      scrollToHighlight(key);
    }
  }, [dismissHighlightGuide, highlightSegments, onHighlightSelect, scrollToHighlight, selectedHighlight, showHighlightGuide]);

  const activeSegment = currentAnalysis && activeKey
    ? currentAnalysis.structureAnalysis?.[activeKey]
    : null;
  const activeQuality = activeSegment ? getQuality(activeSegment.score) : null;
  const accentColor = activeQuality ? colorFromVar(activeQuality.colorVar) : 'hsl(var(--chart-2))';
  const accentSoft = activeQuality ? colorFromVar(activeQuality.colorVar, 0.12) : 'hsl(var(--chart-2) / 0.12)';
  const accentBorder = activeQuality ? colorFromVar(activeQuality.colorVar, 0.75) : 'hsl(var(--border))';

  const analyzeText = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const reviewApi = new ReviewApi();
      const response = await reviewApi.post({
        original_text: trimmed,
        structure: selectedMethod,
      });
      
      const apiData = response?.data || response;
      const normalizedAnalysis = normalizeApiResponse(apiData);
      
      if (normalizedAnalysis) {
        onAnalysisComplete(normalizedAnalysis);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err?.message || '分析に失敗しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete, selectedMethod, text]);

  const renderedText = useMemo(() => {
    if (!currentAnalysis) {
      return <span className="text-slate-400">{text || 'ここにテキストを入力してください...'}</span>;
    }

    const baseText = currentAnalysis.originalText || text;
    if (!baseText) {
      return <span className="text-slate-400">ここにテキストを入力してください...</span>;
    }

    if (!highlightSegments.length) {
      return <span className="text-slate-600 whitespace-pre-wrap">{baseText}</span>;
    }

    const inferKind = currentAnalysis.method;
    const parts = [];
    let cursor = 0;

    highlightSegments.forEach((seg, idx) => {
      const start = Number.isFinite(seg.startIndex) ? seg.startIndex : cursor;
      const end = Number.isFinite(seg.endIndex) ? seg.endIndex : start + (seg.text?.length ?? 0);

      if (cursor < start) {
        parts.push(
          <span key={`plain-${cursor}-${idx}`} className="whitespace-pre-wrap">
            {baseText.slice(cursor, start)}
          </span>
        );
      }

      const isSelected = selectedHighlight?.key === seg.key;
      const quality = getQuality(seg.score);
      const bg = colorFromVar(quality.colorVar, isSelected ? 0.38 : 0.22);

      parts.push(
        <mark
          key={`highlight-${seg.key}-${start}`}
          ref={(el) => {
            if (el) {
              markRefs.current[seg.key] = el;
            }
          }}
          onClick={() => selectSegment(isSelected ? null : seg.key)}
          className="cursor-pointer rounded-sm px-0.5 transition-colors text-[1.15em]"
          style={{
            backgroundColor: bg,
            color: 'inherit',
            boxShadow: isSelected ? '0 0 0 2px hsl(var(--ring))' : 'none',
          }}
        >
          {seg.text}
        </mark>
      );

      cursor = end > cursor ? end : cursor;
    });

    if (cursor < baseText.length) {
      parts.push(
        <span key={`plain-tail-${cursor}`} className="whitespace-pre-wrap">
          {baseText.slice(cursor)}
        </span>
      );
    }

    return parts;
  }, [currentAnalysis, highlightSegments, selectSegment, selectedHighlight, text]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Text Area */}
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
                {METHODS.map((method) => (
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
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
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
                {currentAnalysis && showHighlightGuide && (
                  <div className="mb-6 rounded-2xl border border-dashed border-[#E0E6FF] bg-[#F5F7FF] px-4 py-3 flex items-start gap-3 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-[#4285F4] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 4.93a10 10 0 1114.14 14.14 10 10 0 01-14.14-14.14z" />
                    </svg>
                    <div className="flex-1">
                      文章内のハイライトをクリックすると、下の詳細カードでスコアやコメントを確認できます。
                    </div>
                    <button
                      type="button"
                      onClick={dismissHighlightGuide}
                      className="text-xs font-semibold text-[#4285F4] px-2 py-1 rounded-full border border-[#c8d9ff] hover:bg-[#eaf0ff] transition-colors"
                      aria-label="閉じる"
                    >
                      OK
                    </button>
                  </div>
                )}
                {renderedText}
              </div>

              {/* Detail panel below with switcher */}
              {currentAnalysis && activeKey && (
                <div className="mt-8">
                  <div
                    className="rounded-[26px] border-2 border-slate-200/50"
                    style={{ backgroundColor: 'white' }}
                  >
                    <div
                      className="flex gap-2 px-4 pt-2 pb-1"
                      role="tablist"
                      aria-label="構造のタブ"
                      style={{ borderColor: accentBorder }}
                    >
                      {Object.entries(currentAnalysis.structureAnalysis).map(([key, seg]) => {
                        if (!seg?.text) return null;
                        const meta = getKindMeta(key, currentAnalysis.method);
                        const isActive = activeKey === key;
                        const quality = getQuality(seg.score);
                        const tabColor = colorFromVar(quality.colorVar, 0.75);
                        return (
                          <button
                            key={`tab-${key}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${key}`}
                            id={`tab-${key}`}
                            className={`relative group flex-1 border-2 border-b-0 min-w-0 text-md font-semibold text-center px-4 pt-2 pb-2 rounded-t-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-100 ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => selectSegment(key, { scroll: true })}
                            style={{
                              color: isActive ? tabColor : undefined,
                              backgroundColor: isActive ? '#fff' : 'transparent',
                              borderColor: isActive ? tabColor : 'transparent',
                              borderBottomColor: isActive ? tabColor : 'transparent',
                              marginBottom: isActive ? '-5.5px' : 0,
                            }}
                          >
                            {meta.label}
                            {meta.description && (
                              <span
                                className="pointer-events-none fixed left-1/2 top-auto bottom-6 z-30 hidden max-w-[90vw] -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2 text-left text-sm font-normal leading-snug text-white opacity-0 shadow-lg ring-1 ring-black/10 transition duration-150 ease-out group-hover:block group-hover:opacity-90 group-focus-visible:block group-focus-visible:opacity-90 md:absolute md:bottom-auto md:left-1/2 md:top-0 md:w-max md:-translate-y-full md:-translate-x-1/2 md:whitespace-normal md:px-3 md:py-1 md:text-xs"
                                role="tooltip"
                              >
                                {meta.description}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div
                      className="px-6 py-5 rounded-b-[22px]"
                      style={{backgroundColor: '#fff', borderColor: accentBorder, borderTopWidth: '2px'}}
                    >
                      {(() => {
                        const seg = currentAnalysis.structureAnalysis[activeKey];
                        if (!seg) return null;
                        const meta = getKindMeta(activeKey, currentAnalysis.method);
                        const quality = getQuality(seg.score);
                        const color = colorFromVar(quality.colorVar);
                        return (
                          <div
                            className="space-y-5 rounded-[22px] p-6 bg-white"
                            style={{ borderColor: accentBorder}}
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-lg font-semibold text-slate-900">
                                スコア <span>{seg.score ?? '-'}</span> / 5
                              </span>
                              <span className="text-sm font-medium" style={{ color: accentColor }}>
                                {quality.label}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full rounded-full bg-[#F6E2D5] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${Math.max(0, Math.min(5, seg.score ?? 0)) / 5 * 100}%`, backgroundColor: color }}
                                />
                              </div>
                              <div className="text-[11px] text-muted-foreground">スコアの目安（0〜5）</div>
                            </div>
                            {seg.comment && (
                              <div className="rounded-2xl border border-[#E0E6FF] bg-[#F5F7FF] p-4">
                                <div className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-[#4285F4] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {seg.comment}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="rounded-2xl border border-dashed border-[#F9DCC8] bg-[#FFF8F2] p-4">
                              <div className="text-xs text-muted-foreground mb-1.5">該当文</div>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                "{seg.text}"
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
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
                  {isAnalyzing ? '分析中...' : '分析する'}
                </Button>
              ) : (
                <>
                  {/* Mobile Feedback Button */}
                  <Button
                    onClick={() => setIsMobileFeedbackOpen(true)}
                    className="lg:hidden bg-[#4285F4] hover:bg-[#3367d6] text-white px-5 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md"
                  >
                    詳細
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
  );
}
