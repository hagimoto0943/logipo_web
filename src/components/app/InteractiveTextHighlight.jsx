import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export default function InteractiveTextHighlight({ originalText, structureAnalysis, structureKind }) {
  const [activeKey, setActiveKey] = useState(null);
  const [flashKey, setFlashKey] = useState(null);
  const markRefs = useRef({});
  const STRUCTURE_CONFIG = useMemo(() => ({
    prep: [
      { key: 'point', label: '主張', colorVar: '--chart-1' },
      { key: 'reason', label: '理由', colorVar: '--chart-2' },
      { key: 'example', label: '具体例', colorVar: '--chart-3' },
      { key: 'repoint', label: '再主張', colorVar: '--chart-4' },
    ],
    sds: [
      { key: 'summary1', label: '要約', colorVar: '--chart-1' },
      { key: 'details', label: '詳細', colorVar: '--chart-2' },
      { key: 'summary2', label: '結論', colorVar: '--chart-3' },
    ],
    desc: [
      { key: 'describe', label: 'Describe', colorVar: '--chart-1' },
      { key: 'express', label: 'Express', colorVar: '--chart-2' },
      { key: 'suggest', label: 'Suggest', colorVar: '--chart-3' },
      { key: 'choose', label: 'Choose', colorVar: '--chart-4' },
    ],
  }), []);

  const inferKind = useMemo(() => {
    if (structureKind) return structureKind;
    const keys = structureAnalysis ? Object.keys(structureAnalysis) : [];
    const hasAll = (arr) => arr.every(k => keys.includes(k));
    if (hasAll(['point','reason','example','repoint'])) return 'prep';
    if (hasAll(['summary1','details','summary2'])) return 'sds';
    if (hasAll(['describe','express','suggest','choose'])) return 'desc';
    return 'free';
  }, [structureKind, structureAnalysis]);

  const kinds = useMemo(() => {
    const preset = STRUCTURE_CONFIG[inferKind];
    if (preset) return preset;
    // free or unknown: pick common keys if exist, else empty
    const generic = [
      { key: 'overall', label: '全体', colorVar: '--chart-1' },
      { key: 'clarity', label: '明瞭性', colorVar: '--chart-2' },
      { key: 'impression', label: '印象', colorVar: '--chart-3' },
    ];
    return generic;
  }, [STRUCTURE_CONFIG, inferKind]);

  const segments = useMemo(() => {
    if (!structureAnalysis) return [];
    return kinds
      .map(k => (structureAnalysis[k.key]?.text ? { key: k.key, ...structureAnalysis[k.key] } : null))
      .filter(Boolean);
  }, [structureAnalysis, kinds]);

  const highlights = useMemo(() => {
    if (!originalText || segments.length === 0) return [];
    const mapped = segments.map(seg => {
      const start = originalText.indexOf(seg.text);
      return start >= 0
        ? { ...seg, start, end: start + seg.text.length }
        : null;
    }).filter(Boolean);
    return mapped.sort((a, b) => a.start - b.start);
  }, [originalText, segments]);

  const getKindMeta = (key) => kinds.find(k => k.key === key) || { colorVar: '--chart-5', label: key };

  const getQuality = (score) => {
    if (score == null) return { color: '#9CA3AF', label: '未評価' }; // gray-400
    if (score >= 4.5) return { color: '#16a34a', label: 'とても良い' }; // green-600
    if (score >= 4) return { color: '#22c55e', label: '良い' }; // green-500
    if (score >= 3) return { color: '#f59e0b', label: '普通' }; // amber-500
    if (score >= 2) return { color: '#f97316', label: '要改善' }; // orange-500
    return { color: '#ef4444', label: '改善が必要' }; // red-500
  };

  // Map score -> background alpha (low score darker, high score lighter)
  const bgAlphaFromScore = (score) => {
    const s = Math.max(0, Math.min(5, score ?? 0));
    const minA = 0.14; // best
    const maxA = 0.30; // worst
    return maxA - (s / 5) * (maxA - minA);
  };

  const handleSelectKind = (key, { scroll = true } = {}) => {
    setActiveKey(key);
    if (scroll) {
      const el = markRefs.current[key];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
      setFlashKey(key);
      window.setTimeout(() => setFlashKey(null), 900);
    }
  };

  // Initialize or fix active key on data/kind change
  useEffect(() => {
    const availableKeys = kinds
      .filter(k => structureAnalysis?.[k.key]?.text)
      .map(k => k.key);

    // Reset refs when kind or original changes
    markRefs.current = {};

    if (availableKeys.length === 0) {
      setActiveKey(null);
      return;
    }

    // If current activeKey is not valid for the new kind/data, choose a sensible default
    if (!activeKey || !availableKeys.includes(activeKey)) {
      const firstFromHighlights = highlights[0]?.key;
      setActiveKey(firstFromHighlights ?? availableKeys[0]);
    }
  }, [inferKind, kinds, structureAnalysis, originalText, highlights]);

  const renderHighlightedText = () => {
    // For free structure, don't inline-highlight to avoid repeating the same text
    if (inferKind === 'free') return originalText;
    if (!structureAnalysis || highlights.length === 0) return originalText;
    const parts = [];
    let idx = 0;
    for (const seg of highlights) {
      if (idx < seg.start) parts.push(originalText.slice(idx, seg.start));
      const meta = getKindMeta(seg.key);
      const color = `hsl(var(${meta.colorVar}))`;
      const baseA = bgAlphaFromScore(seg.score);
      const bg = `hsl(var(${meta.colorVar}) / ${activeKey === seg.key ? Math.min(0.4, baseA + 0.06) : baseA})`;
      const { color: qualityColor } = getQuality(seg.score);
      parts.push(
        <mark
          key={`${seg.key}-${seg.start}`}
          ref={el => { if (el) markRefs.current[seg.key] = el; }}
          onClick={() => handleSelectKind(seg.key, { scroll: false })}
          className="cursor-pointer rounded-sm px-0.5 py-0.5 transition-colors"
          style={{
            backgroundColor: bg,
            color: 'inherit',
            boxShadow: `inset 0 -2px 0 0 ${qualityColor}${flashKey === seg.key ? `, 0 0 0 2px hsl(var(--ring))` : ''}`,
          }}
        >
          {seg.text}
        </mark>
      );
      idx = seg.end;
    }
    if (idx < originalText.length) parts.push(originalText.slice(idx));
    return parts;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      {segments.length > 0 && inferKind !== 'free' && (
        <div className="flex flex-wrap gap-2 text-xs">
          {segments.map(seg => {
            const meta = getKindMeta(seg.key);
            const color = `hsl(var(${meta.colorVar}))`;
            const bg = `hsl(var(${meta.colorVar}) / 0.15)`;
            return (
              <span key={`legend-${seg.key}`} className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 border" style={{ backgroundColor: bg, borderColor: color }}>
                <span className="font-medium" style={{ color }}>{meta.label}</span>
                <span className="text-muted-foreground">{seg.score ?? '-'}/5</span>
              </span>
            );
          })}
        </div>
      )}

      {segments.length > 0 && inferKind !== 'free' && (
        <div className="text-xs text-muted-foreground">ハイライトの下線色は評価の強弱（良=緑/弱=赤）を示します</div>
      )}

      {/* Text with highlights */}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {renderHighlightedText()}
      </div>

      {/* Detail panel below with switcher */}
      {segments.length > 0 && (
        <Card className="border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">{inferKind === 'free' ? '全体の詳細' : '構造の詳細'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="構造のタブ">
              {kinds.map(k => {
                const seg = structureAnalysis?.[k.key];
                if (!seg?.text) return null;
                const isActive = (activeKey ?? highlights[0]?.key) === k.key;
                const color = `hsl(var(${k.colorVar}))`;
                return (
                  <Button
                    key={`tab-${k.key}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${k.key}`}
                    id={`tab-${k.key}`}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleSelectKind(k.key)}
                    className={isActive ? '' : ''}
                    style={isActive ? { backgroundColor: color } : undefined}
                  >
                    {k.label}
                  </Button>
                );
              })}
            </div>
            {(() => {
              const key = activeKey ?? highlights[0]?.key;
              const seg = key ? structureAnalysis?.[key] : null;
              const meta = key ? getKindMeta(key) : null;
              if (!seg || !meta) return null;
              const color = `hsl(var(${meta.colorVar}))`;
              const bg = `hsl(var(${meta.colorVar}) / 0.08)`;
              const quality = getQuality(seg.score);
              return (
                <div
                  role="tabpanel"
                  id={`panel-${key}`}
                  aria-labelledby={`tab-${key}`}
                  className="space-y-3 rounded-md p-4 border"
                  style={{ borderColor: color, backgroundColor: bg }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color }}>{meta.label}</span>
                    <Badge variant="secondary">Score {seg.score ?? '-'} / 5</Badge>
                    <span className="text-xs" style={{ color: quality.color }}>{quality.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                      <div
                        className="h-2 rounded"
                        style={{ width: `${Math.max(0, Math.min(5, seg.score ?? 0)) / 5 * 100}%`, backgroundColor: quality.color }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground">スコアの目安（0〜5）</div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{seg.comment}</div>
                  {inferKind !== 'free' && (
                    <div className="text-sm whitespace-pre-wrap">
                      <span className="text-xs text-muted-foreground mr-2">該当文</span>
                      <mark className="rounded-sm px-1" style={{ backgroundColor: `hsl(var(${meta.colorVar}) / 0.18)` }}>{seg.text}</mark>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
