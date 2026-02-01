import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";
import LogoIcon from "./LogoIcon"; // Corrected import path
import {
  LayoutDashboard,
  PenTool,
  History,
  User,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";

export function MobileHeader({ currentView, onViewChange }) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
    { id: "editor", icon: PenTool, label: "新規作成" },
    { id: "history", icon: History, label: "履歴" },
    { id: "account", icon: User, label: "アカウント" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-50 lg:hidden">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7"
          style={{
            "--fill-0": "#2C5067",
            "--stroke-0": "#2C5067",
          }}
        >
          <LogoIcon />
        </div>
        <h1 className="text-[#0f172a] text-base">LOGIPO</h1>
      </div>

      {/* Menu Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#0f172a]">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 border-b border-[#e5e9ed]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10"
                  style={{
                    "--fill-0": "#2C5067",
                    "--stroke-0": "#2C5067",
                  }}
                >
                  <LogoIcon />
                </div>
                <div>
                  <SheetTitle className="text-[#0f172a] text-left">
                    LOGIPO
                  </SheetTitle>
                  <SheetDescription className="text-xs text-slate-600 mt-0.5 text-left">
                    論理的思考力トレーニング
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                        ${
                          isActive
                            ? "text-[#0f172a] bg-slate-100"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabMobile"
                          className="absolute inset-0 bg-slate-100 rounded-xl border border-slate-200"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <Icon
                        className={`w-5 h-5 relative z-10 ${isActive ? "stroke-[2.5]" : ""}`}
                      />
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#e5e9ed]">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#0f172a] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#0f172a]">トレーニングのコツ</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      各メソッドの構造を意識して文章を作成しましょう
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
