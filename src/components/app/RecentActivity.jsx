import { motion } from 'motion/react';
import { FileText, Clock, TrendingUp, ChevronRight } from 'lucide-react';

export function RecentActivity({ analyses, onSelectAnalysis }) {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-[#34A853] bg-green-50';
    if (score >= 4.0) return 'text-[#4285F4] bg-blue-50';
    if (score >= 3.5) return 'text-[#4285F4] bg-blue-50';
    return 'text-[#FBBC04] bg-yellow-50';
  };

  const getMethodColor = (method) => {
    const colors = {
      'PREP': 'bg-purple-100 text-purple-700',
      'SDS': 'bg-blue-100 text-blue-700',
      'DESC': 'bg-emerald-100 text-emerald-700',
      'FTBE': 'bg-amber-100 text-amber-700',
    };
    return colors[method] || 'bg-slate-100 text-slate-700';
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  const recentAnalyses = analyses.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0f172a] flex items-center gap-2">
            <Clock className="w-5 h-5" />
            最近のアクティビティ
          </h3>
          <p className="text-sm text-slate-500 mt-1">直近の分析結果</p>
        </div>
      </div>

      {recentAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">まだアクティビティがありません</p>
          <p className="text-sm text-slate-400 mt-1">文章を分析して記録を開始しましょう</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAnalyses.map((analysis, index) => {
            const avgScore = Object.values(analysis.overallScore).reduce((a, b) => a + b, 0) / Object.values(analysis.overallScore).length;
            
            return (
              <motion.button
                key={analysis.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectAnalysis(analysis)}
                className="w-full group bg-white hover:bg-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-[#4285F4] transition-all duration-200 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getMethodColor(analysis.method)}`}>
                        {analysis.method}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTime(analysis.timestamp)}
                      </span>
                    </div>

                    {/* Text Preview */}
                    <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                      {analysis.originalText}
                    </p>

                    {/* Scores */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getScoreColor(avgScore)}`}>
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs">
                          {avgScore.toFixed(1)}
                        </span>
                      </div>
                      {Object.entries(analysis.overallScore).slice(0, 3).map(([key, score]) => (
                        <div key={key} className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">{key}:</span>
                          <span className="text-xs text-[#2C5067]">{score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#2C5067] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {recentAnalyses.length > 0 && (
        <button className="w-full mt-4 py-3 text-sm text-[#2C5067] hover:bg-[#2C5067]/5 rounded-xl transition-all duration-200">
          すべてのアクティビティを見る
        </button>
      )}
    </div>
  );
}
