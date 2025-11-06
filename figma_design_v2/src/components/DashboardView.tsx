import { DashboardStats } from './DashboardStats';
import { ProgressChart } from './ProgressChart';
import { StreakCalendar } from './StreakCalendar';
import { BadgeSystem } from './BadgeSystem';
import { RecentActivity } from './RecentActivity';
import { motion } from 'motion/react';
import type { Analysis } from '../App';

interface DashboardViewProps {
  savedAnalyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
}

export function DashboardView({ savedAnalyses, onSelectAnalysis }: DashboardViewProps) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-[#f0f4f7]">
      {/* Header */}
      <div className="hidden lg:block bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-[#0f172a] text-lg tracking-tight">ダッシュボード</h1>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-4 py-3.5 sticky top-0 z-10">
        <h2 className="text-[#0f172a] text-base tracking-tight">ダッシュボード</h2>
      </div>

      <div className="p-4 lg:p-8 space-y-6">
        {/* Stats Cards */}
        <DashboardStats />

        {/* Progress Chart */}
        <ProgressChart />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Streak Calendar */}
          <StreakCalendar />

          {/* Recent Activity */}
          <RecentActivity 
            analyses={savedAnalyses} 
            onSelectAnalysis={onSelectAnalysis}
          />
        </div>

        {/* Badge System */}
        <BadgeSystem />
      </div>
    </div>
  );
}
