import { motion } from 'motion/react';
import { Flame, Trophy } from 'lucide-react';

interface DayActivity {
  date: string;
  count: number;
  score?: number;
}

export function StreakCalendar() {
  // Mock data - 過去12週間分のデータ
  const generateMockData = (): DayActivity[] => {
    const data: DayActivity[] = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // ランダムにアクティビティを生成
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      const score = count > 0 ? 3.5 + Math.random() * 1.5 : undefined;
      
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        score,
      });
    }
    
    return data;
  };

  const activityData = generateMockData();
  
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-slate-100';
    if (count === 1) return 'bg-[#4285F4]/20';
    if (count === 2) return 'bg-[#4285F4]/40';
    if (count === 3) return 'bg-[#4285F4]/60';
    return 'bg-[#4285F4]';
  };

  const currentStreak = 12;
  const bestStreak = 28;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0f172a] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EA4335]" />
            アクティビティ
          </h3>
          <p className="text-sm text-slate-500 mt-1">過去12週間の学習記録</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-500">現在</div>
            <div className="text-2xl text-[#EA4335]">{currentStreak}日</div>
          </div>
          <div className="w-px bg-slate-200" />
          <div className="text-right">
            <div className="text-sm text-slate-500 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              最高
            </div>
            <div className="text-2xl text-[#FBBC04]">{bestStreak}日</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-2 min-w-max">
          {/* Week labels */}
          <div className="flex gap-1 mb-1">
            <div className="w-8" /> {/* Spacer for day labels */}
            {Array.from({ length: 12 }).map((_, weekIndex) => (
              <div key={weekIndex} className="text-xs text-slate-400 w-[52px] text-center">
                {weekIndex % 4 === 0 && `${12 - weekIndex}週前`}
              </div>
            ))}
          </div>

          {/* Days grid */}
          {['月', '火', '水', '木', '金', '土', '日'].map((day, dayIndex) => (
            <div key={day} className="flex gap-1 items-center">
              <div className="w-8 text-xs text-slate-400">{dayIndex % 2 === 0 ? day : ''}</div>
              <div className="flex gap-1">
                {Array.from({ length: 12 }).map((_, weekIndex) => {
                  const dataIndex = weekIndex * 7 + dayIndex;
                  const dayData = activityData[dataIndex];
                  
                  if (!dayData) return <div key={weekIndex} className="w-3 h-3" />;
                  
                  return (
                    <motion.div
                      key={weekIndex}
                      className={`w-3 h-3 rounded-sm ${getIntensityColor(dayData.count)} cursor-pointer hover:ring-2 hover:ring-[#2C5067]/50 transition-all`}
                      whileHover={{ scale: 1.2 }}
                      title={`${dayData.date}: ${dayData.count}件${dayData.score ? ` (平均${dayData.score.toFixed(1)})` : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100">
        <span className="text-xs text-slate-400">少ない</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400">多い</span>
      </div>
    </div>
  );
}
