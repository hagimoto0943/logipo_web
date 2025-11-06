import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, TrendingUp, Target, Lightbulb, Award, X } from 'lucide-react';
import { RadarChartComponent } from '@components/app/RadarChartComponent';
import { Button } from '@components/ui/button';

export function MobileFeedbackSheet({
  analysis,
  selectedHighlight,
  onHighlightSelect,
  isOpen,
  onClose,
}) {
  if (!analysis) return null;

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 lg:hidden max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex items-center justify-center py-3 border-b border-[#e5e9ed]">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-4 border-b border-[#e5e9ed] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2C5067] rounded-xl flex items-center justify-center shadow-lg shadow-[#2C5067]/30">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#2C5067]">総合フィードバック</h3>
                  <p className="text-xs text-[#2C5067]/60">各要素の分析結果</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Overall Score */}
              <div className="p-4 border-b border-[#e5e9ed]">
                <div className="bg-[#2C5067]/5 rounded-2xl p-4 border border-[#2C5067]/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#2C5067]" />
                      <span className="text-sm text-[#2C5067]/80">総合スコア</span>
                    </div>
                    <span className={`text-xl ${getScoreColor(overallAverage)}`}>
                      {overallAverage.toFixed(1)} / 5.0
                    </span>
                  </div>
                  
                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(overallAverage / 5) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={getScoreBarColor(overallAverage)}
                    />
                  </div>
                </div>
              </div>

              {/* Individual Scores */}
              <div className="p-4 border-b border-[#e5e9ed]">
                <h4 className="text-[#2C5067] mb-3">各要素のスコア</h4>
                <div className="space-y-3">
                  {Object.entries(analysis.overallScore).map(([key, score], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#2C5067]/80">{key}</span>
                        <span className={getScoreColor(score)}>
                          {score.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / 5) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={getScoreBarColor(score)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="p-4">
                <h4 className="text-[#2C5067] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  詳細フィードバック
                </h4>
                
                <div className="space-y-3">
                  {analysis.highlights.map((highlight, index) => (
                    <button
                      key={index}
                      onClick={() => onHighlightSelect(highlight)}
                      className="w-full text-left bg-slate-50 hover:bg-[#2C5067]/5 rounded-xl p-3 border border-slate-200 hover:border-[#2C5067]/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-1 bg-slate-200 rounded-full">
                          {highlight.type}
                        </span>
                        <span className={`text-sm ${getScoreColor(highlight.score)}`}>
                          {highlight.score.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-[#2C5067]/70 line-clamp-2">
                        {highlight.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
