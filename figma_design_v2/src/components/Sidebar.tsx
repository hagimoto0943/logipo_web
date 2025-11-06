import { LayoutDashboard, PenTool, History, BookOpen, User, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import LogoIcon from '../imports/Container-6-242';

interface SidebarProps {
  currentView: 'dashboard' | 'editor' | 'history' | 'account';
  onViewChange: (view: 'dashboard' | 'editor' | 'history' | 'account') => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ currentView, onViewChange, isCollapsed: externalIsCollapsed, onToggleCollapse }: SidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalIsCollapsed(!isCollapsed);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'ダッシュボード' },
    { id: 'editor' as const, icon: PenTool, label: '新規作成' },
    { id: 'history' as const, icon: History, label: '履歴' },
    { id: 'account' as const, icon: User, label: 'アカウント' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 64 : 224 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex bg-[#fafafa] border-r border-slate-200/80 flex-col"
    >
      {/* Header */}
      <div className="px-4 py-6 border-b border-slate-200/80">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-7 h-7 flex-shrink-0" style={{ 
            '--fill-0': '#2C5067',
            '--stroke-0': '#2C5067',
          } as React.CSSProperties}>
            <LogoIcon />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#0f172a] text-base whitespace-nowrap overflow-hidden"
              >
                LOGIPO
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-2.5 px-3'} py-2 rounded-md transition-colors text-sm relative group
                  ${isActive 
                    ? 'text-[#0f172a] bg-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.5]" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[13px] whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer with Collapse Button */}
      <div className="px-2 pb-3 pt-3 border-t border-slate-200/80">
        <button
          onClick={handleToggleCollapse}
          className={`
            w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-2.5 px-3'} py-2 rounded-md transition-colors text-sm group
            text-slate-500 hover:text-slate-700 hover:bg-white/50
          `}
          title={isCollapsed ? (isCollapsed ? '展開' : '折りたたむ') : undefined}
        >
          {isCollapsed ? (
            <PanelLeft className="w-[18px] h-[18px] flex-shrink-0" />
          ) : (
            <PanelLeftClose className="w-[18px] h-[18px] flex-shrink-0" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] whitespace-nowrap overflow-hidden"
              >
                折りたたむ
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              展開
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
