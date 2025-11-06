import { motion } from 'motion/react';
import { TrendingUp, Award, Zap, Target } from 'lucide-react';

export function StatsOverview() {
  const stats = [
    {
      label: '総合ランク',
      value: 'A',
      subtext: '上位15%',
      icon: Award,
      color: '#8B5CF6',
    },
    {
      label: '総学習時間',
      value: '24.5',
      subtext: '時間',
      icon: Zap,
      color: '#FBBC04',
    },
    {
      label: '完了率',
      value: '87',
      subtext: '%',
      icon: Target,
      color: '#34A853',
    },
    {
      label: '改善度',
      value: '+23',
      subtext: '%',
      icon: TrendingUp,
      color: '#4285F4',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 border-2 border-slate-200"
          >
            <div 
              className="w-10 h-10 rounded-xl border-2 flex items-center justify-center mb-3"
              style={{ borderColor: stat.color, color: stat.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-sm text-slate-400">{stat.subtext}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
