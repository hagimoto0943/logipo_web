import { motion } from 'motion/react';
import { User, Mail, Key, Bell, Palette, LogOut, Shield, CheckCircle, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { StatsOverview } from './StatsOverview';
import { Progress } from './ui/progress';

export function AccountView() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-[#f0f4f7]">
      {/* Header */}
      <div className="hidden lg:block bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 sticky top-0 z-10">
        <h2 className="text-[#0f172a] text-lg tracking-tight">アカウント</h2>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Overview */}
          <StatsOverview />
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-[#2C5067] flex items-center justify-center">
                  <User className="w-10 h-10 text-[#2C5067]" />
                </div>
                <div>
                  <h3 className="text-[#0f172a]">hagi.san.09275571さん</h3>
                  <p className="text-sm text-slate-500 mt-1">プレミアム会員</p>
                </div>
              </div>

              {/* Level Progress */}
              <div className="flex-1 lg:ml-auto">
                <div className="bg-white rounded-xl p-4 border-2 border-[#FBBC04]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#FBBC04]" />
                      <span className="text-sm text-[#0f172a]">レベル 3</span>
                    </div>
                    <span className="text-xs text-slate-600">次のレベルまで 230 XP</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">メールアドレス</p>
                  <p className="text-[#0f172a]">hagi.san.09275571@gmail.com</p>
                </div>
                <div className="ml-auto">
                  <span className="flex items-center gap-1 text-xs text-white bg-[#34A853] px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    確認済み
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Key className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">ユーザーID</p>
                  <p className="text-[#0f172a]">110</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200"
          >
            <h3 className="text-[#0f172a] mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              環境設定
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-[#0f172a]">通知を受け取る</p>
                    <p className="text-xs text-slate-500 mt-0.5">新しい機能やヒントをお知らせします</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-[#0f172a]">自動保存</p>
                    <p className="text-xs text-slate-500 mt-0.5">分析結果を自動的に保存します</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200"
          >
            <h3 className="text-[#0f172a] mb-4">アカウント操作</h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl py-6"
              >
                <Mail className="w-4 h-4 mr-3" />
                メールアドレスを変更
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-xl py-6"
              >
                <Key className="w-4 h-4 mr-3" />
                パスワードを変更
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl py-6"
              >
                <LogOut className="w-4 h-4 mr-3" />
                ログアウト
              </Button>
            </div>
          </motion.div>

          {/* Achievement Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#2C5067]/5 to-blue-50 rounded-2xl p-6 border border-[#2C5067]/20"
          >
            <h3 className="text-[#2C5067] mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              達成サマリー
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-1">🏆</div>
                <div className="text-2xl text-[#2C5067] mb-1">8</div>
                <div className="text-xs text-slate-500">獲得バッジ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl text-amber-600 mb-1">12</div>
                <div className="text-xs text-slate-500">連続日数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">📝</div>
                <div className="text-2xl text-emerald-600 mb-1">47</div>
                <div className="text-xs text-slate-500">総文章数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl text-blue-600 mb-1">4.2</div>
                <div className="text-xs text-slate-500">平均スコア</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
