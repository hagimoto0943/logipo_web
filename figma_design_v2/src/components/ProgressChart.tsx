import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function ProgressChart() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data
  const generateData = () => {
    const data = [];
    const points = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12;
    const baseScore = 3.5;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      if (timeRange === 'week') {
        date.setDate(date.getDate() - (points - i - 1));
      } else if (timeRange === 'month') {
        date.setDate(date.getDate() - (points - i - 1));
      } else {
        date.setMonth(date.getMonth() - (points - i - 1));
      }
      
      const trend = i * 0.02;
      const variance = (Math.random() - 0.5) * 0.3;
      const score = Math.min(5, Math.max(3, baseScore + trend + variance));
      
      data.push({
        date: timeRange === 'year' 
          ? date.toLocaleDateString('ja-JP', { month: 'short' })
          : date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
        score: parseFloat(score.toFixed(2)),
        count: Math.floor(Math.random() * 3) + 1,
      });
    }
    
    return data;
  };

  const data = generateData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">{payload[0].payload.date}</p>
          <p className="text-lg text-[#4285F4]">
            スコア: {payload[0].value}
          </p>
          <p className="text-xs text-slate-500">
            文章数: {payload[0].payload.count}件
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0f172a] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            スコア推移
          </h3>
          <p className="text-sm text-slate-500 mt-1">論理的思考力の成長記録</p>
        </div>

        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg text-sm transition-all duration-200
                ${timeRange === range
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              {range === 'week' ? '週間' : range === 'month' ? '月間' : '年間'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              domain={[0, 5]}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4285F4"
              strokeWidth={3}
              dot={{ fill: '#4285F4', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="text-center">
          <div className="text-2xl text-[#4285F4] mb-1">
            {data.length > 0 ? data[data.length - 1].score : '-'}
          </div>
          <div className="text-xs text-slate-500">最新スコア</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-[#34A853] mb-1">
            {data.length > 0 ? Math.max(...data.map(d => d.score)).toFixed(1) : '-'}
          </div>
          <div className="text-xs text-slate-500">最高スコア</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-[#FBBC04] mb-1">
            {data.length > 0 ? (data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(1) : '-'}
          </div>
          <div className="text-xs text-slate-500">平均���コア</div>
        </div>
      </div>
    </div>
  );
}
