import { motion } from 'motion/react';
import { Award, Lock, Trophy, Target, Flame, Zap, Star, TrendingUp } from 'lucide-react';

export function BadgeSystem() {
  const badges = [
    {
      id: 'first-analysis',
      name: '初めの一歩',
      description: '初めての文章分析を完了',
      icon: Star,
      unlocked: true,
      color: '#FBBC04',
    },
    {
      id: 'streak-7',
      name: '継続は力なり',
      description: '7日連続で学習',
      icon: Flame,
      unlocked: true,
      color: '#EA4335',
    },
    {
      id: 'perfect-prep',
      name: 'PREP マスター',
      description: 'PREP法で5.0満点を獲得',
      icon: Trophy,
      unlocked: true,
      color: '#8B5CF6',
    },
    {
      id: 'count-10',
      name: '練習の達人',
      description: '10件の文章を作成',
      icon: Target,
      unlocked: true,
      color: '#34A853',
    },
    {
      id: 'all-methods',
      name: 'オールラウンダー',
      description: '全てのメソッドを使用',
      icon: Award,
      unlocked: false,
      progress: 3,
      total: 4,
      color: '#4285F4',
    },
    {
      id: 'count-50',
      name: '熟練者',
      description: '50件の文章を作成',
      icon: Zap,
      unlocked: false,
      progress: 47,
      total: 50,
      color: '#06B6D4',
    },
    {
      id: 'streak-30',
      name: '不屈の継続',
      description: '30日連続で学習',
      icon: Flame,
      unlocked: false,
      progress: 12,
      total: 30,
      color: '#EA4335',
    },
    {
      id: 'high-avg',
      name: 'エクセレンス',
      description: '平均スコア4.5以上を維持',
      icon: TrendingUp,
      unlocked: false,
      progress: 4.2,
      total: 4.5,
      color: '#EC4899',
    },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0f172a] flex items-center gap-2">
            <Award className="w-5 h-5" />
            バッジコレクション
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {unlockedCount} / {badges.length} 獲得
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#FBBC04]">
          <Trophy className="w-4 h-4 text-[#FBBC04]" />
          <span className="text-sm text-[#FBBC04]">レベル 3</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${badge.unlocked 
                  ? 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
                }
              `}
              whileHover={badge.unlocked ? { y: -4 } : {}}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div 
                  className={`
                    w-16 h-16 rounded-2xl border-2 flex items-center justify-center
                    ${badge.unlocked ? '' : 'bg-slate-100 border-slate-200'}
                  `}
                  style={badge.unlocked ? { borderColor: badge.color, color: badge.color } : {}}
                >
                  {badge.unlocked ? (
                    <Icon className="w-8 h-8" />
                  ) : (
                    <Lock className="w-8 h-8 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Name & Description */}
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: badge.unlocked ? badge.color : '#94a3b8' }}>
                  {badge.name}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {badge.description}
                </div>
              </div>

              {/* Progress */}
              {!badge.unlocked && badge.progress !== undefined && badge.total !== undefined && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>進捗</span>
                    <span>{badge.progress} / {badge.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(badge.progress / badge.total) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                      className="h-full"
                      style={{ backgroundColor: badge.color }}
                    />
                  </div>
                </div>
              )}

              {/* Unlocked Badge */}
              {badge.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
