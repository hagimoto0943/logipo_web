import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { RadarChartComponent } from './RadarChartComponent';

export function FeedbackPanel({
  analysis,
  selectedHighlight,
  onHighlightSelect,
}) {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-[#34A853]';  // Google Green
    if (score >= 3.5) return 'text-[#4285F4]';  // Google Blue
    return 'text-[#FBBC04]';                     // Google Yellow
  };

  const getScoreBarColor = (score) => {
    if (score >= 4.5) return 'bg-[#34A853]';
    if (score >= 3.5) return 'bg-[#4285F4]';
    return 'bg-[#FBBC04]';
  };

  const overallAverage = Object.values(analysis.overallScore).reduce((a, b) => a + b, 0) / Object.values(analysis.overallScore).length;

  return (
    <div className="hidden lg:block w-[360px] bg-white border-l border-slate-200/80 overflow-y-auto pb-16">
      {/* Header */}
      <div className="sticky top-0 bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-5 py-3.5 z-10">
        <h3 className="text-[#0f172a] text-base tracking-tight">フィードバック</h3>
      </div>

      {/* Overall Score Card */}
      <div className="p-5 border-b border-slate-200/80">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-slate-600">総合スコア</span>
            <span className={`text-xl ${getScoreColor(overallAverage)}`}>
              {overallAverage.toFixed(1)}
            </span>
          </div>
          
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(overallAverage / 5) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={getScoreBarColor(overallAverage)}
            />
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-5 border-b border-slate-200/80">
        <h4 className="text-[#0f172a] text-sm mb-3">バランス分析</h4>
        <RadarChartComponent data={analysis.overallScore} />
      </div>

      {/* Individual Scores */}
      <div className="p-5 border-b border-slate-200/80">
        <h4 className="text-[#0f172a] text-sm mb-3">各要素のスコア</h4>
        <div className="space-y-2.5">
          {Object.entries(analysis.overallScore).map(([key, score], index) => (
            <div
              key={key}
              className="bg-slate-50 rounded-md p-3 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] text-slate-600">{key}</span>
                <span className={`text-base ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / 5) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={getScoreBarColor(score)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights Quick Reference */}
      <div className="p-5">
        <h4 className="text-[#0f172a] text-sm mb-3 flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          ハイライト一覧
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          文中のハイライトをクリックすると詳細が表示されます
        </p>
        
        <div className="space-y-2">
          {analysis.highlights.map((highlight, index) => (
            <div
              key={index}
              className={`
                w-full text-left rounded-lg p-3 border-2 transition-all
                ${selectedHighlight === highlight 
                  ? 'bg-blue-50 border-[#4285F4]' 
                  : 'bg-slate-50 border-slate-200'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`
                  text-xs px-2 py-0.5 rounded
                  ${selectedHighlight === highlight 
                    ? 'bg-[#4285F4] text-white' 
                    : 'bg-slate-700 text-white'
                  }
                `}>
                  {highlight.type}
                </span>
                <span className={`text-sm ${getScoreColor(highlight.score)}`}>
                  {highlight.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                {highlight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
