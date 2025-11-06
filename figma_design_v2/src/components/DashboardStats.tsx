import { motion } from 'motion/react';
import { TrendingUp, Target, Flame, FileText, Award, ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, trend, trendLabel, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300"
    >
      <div className="p-6">
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center"
            style={{ borderColor: color, color: color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              trend >= 0 ? 'bg-green-50 text-[#34A853]' : 'bg-red-50 text-[#EA4335]'
            }`}>
              {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl mb-1" style={{ color }}>{value}</div>
          <div className="text-sm text-slate-500">{label}</div>
        </div>

        {/* Trend Label */}
        {trendLabel && (
          <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
            {trendLabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      icon: Target,
      label: '総合スコア',
      value: '4.2',
      trend: 8.3,
      trendLabel: '先週比',
      color: '#4285F4',
    },
    {
      icon: Flame,
      label: '連続記録',
      value: '12日',
      trend: undefined,
      trendLabel: '最高記録: 28日',
      color: '#EA4335',
    },
    {
      icon: FileText,
      label: '総文章数',
      value: '47',
      trend: 15,
      trendLabel: '今月: 12件',
      color: '#34A853',
    },
    {
      icon: Award,
      label: '獲得バッジ',
      value: '8/20',
      trend: undefined,
      trendLabel: '次のバッジまで2件',
      color: '#FBBC04',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
