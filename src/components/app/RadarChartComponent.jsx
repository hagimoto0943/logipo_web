import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

export function RadarChartComponent({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    subject: key,
    value: value,
    fullMark: 5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200"
    >
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#0f172a', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: '#64748b', fontSize: 11, opacity: 0.8 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#4285F4"
            fill="transparent"
            strokeWidth={3}
            dot={{ fill: '#4285F4', strokeWidth: 2, r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}