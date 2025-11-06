import { motion } from 'motion/react';
import { Clock, TrendingUp, FileText, ChevronRight } from 'lucide-react';
import type { Analysis } from '../App';

interface HistoryViewProps {
  analyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
}

export function HistoryView({ analyses, onSelectAnalysis }: HistoryViewProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageScore = (analysis: Analysis) => {
    const scores = Object.values(analysis.overallScore);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="hidden lg:block bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 sticky top-0 z-10">
        <h2 className="text-[#0f172a] text-lg tracking-tight">学習履歴</h2>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {analyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-[#0f172a] mb-2">まだ履歴がありません</h3>
              <p className="text-sm text-slate-500">
                文章を分析すると、ここに履歴が表示されます
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis, index) => (
                <motion.button
                  key={analysis.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectAnalysis(analysis)}
                  className="w-full text-left bg-white hover:bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-[#4285F4] transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-50 text-[#4285F4] rounded-full text-sm">
                          {analysis.method}法
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(analysis.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">
                        {analysis.originalText}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#4285F4] transition-colors flex-shrink-0 ml-4" />
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#34A853]" />
                      <span className="text-sm text-slate-600">
                        平均スコア: <strong className="text-[#0f172a]">{getAverageScore(analysis).toFixed(1)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {analysis.highlights.length}つの要素
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
