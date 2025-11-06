import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BrainCircuit,
  Clock3,
  Compass,
  Flame,
  Infinity,
  ListChecks,
  LockKeyhole,
  Target,
} from "lucide-react";

import { Button } from "@components/ui/button";

const CATEGORY_CONFIG = [
  {
    id: "prep-drill",
    title: "PREP 構造ドリル",
    description: "主張・理由・具体例・再主張をテンポ良く書き分ける練習です。",
    duration: "12分",
    problems: 6,
    difficulty: "intermediate",
    accent: "from-blue-100 via-white to-blue-50",
    icon: Target,
  },
  {
    id: "logic",
    title: "論理的推論",
    description: "論理展開と因果関係の整理にフォーカスしたトレーニング。",
    duration: "18分",
    problems: 8,
    difficulty: "advanced",
    accent: "from-violet-100 via-white to-violet-50",
    icon: BrainCircuit,
  },
  {
    id: "numerical",
    title: "数的処理",
    description: "データを読み解く力と数的ロジックを同時に鍛えます。",
    duration: "15分",
    problems: 5,
    difficulty: "intermediate",
    accent: "from-emerald-100 via-white to-emerald-50",
    icon: Compass,
  },
  {
    id: "review",
    title: "改善リライト",
    description: "添削結果を踏まえて改善文を素早く組み立てる練習です。",
    duration: "10分",
    problems: 4,
    difficulty: "beginner",
    accent: "from-amber-100 via-white to-amber-50",
    icon: ListChecks,
  },
];

const difficultyMeta = {
  beginner: { label: "初級", classes: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  intermediate: { label: "中級", classes: "bg-amber-50 text-amber-600 border-amber-200" },
  advanced: { label: "上級", classes: "bg-rose-50 text-rose-600 border-rose-200" },
};

const recommendedFocus = [
  {
    id: "streak",
    title: "継続チャレンジ",
    description: "連続記録を更新しましょう！ PREP 構造ドリルを 3 回実施するとバッジが解放されます。",
    icon: Flame,
    action: "今すぐ着手",
    tone: "--tone-1",
  },
  {
    id: "consistency",
    title: "構造チェック",
    description: "過去 3 件の添削で「理由」パートが弱い傾向。理由→具体例の接続を強化する課題に挑戦しましょう。",
    icon: BookMarked,
    action: "推奨メニューを表示",
    tone: "--tone-2",
  },
  {
    id: "speed",
    title: "制限時間トレーニング",
    description: "時間内に構造を整える練習で瞬発力を向上させましょう。8 分のタイムアタック課題です。",
    icon: Clock3,
    action: "タイマーを起動",
    tone: "--tone-3",
  },
];

export default function Training() {
  const [selected, setSelected] = useState(null);

  const activeCategory = useMemo(
    () => CATEGORY_CONFIG.find((category) => category.id === selected) ?? null,
    [selected]
  );

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-secondary/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Training
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              トレーニングセンター
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              添削で指摘されたポイントを補強するための短時間メニューを用意しました。
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs text-muted-foreground shadow-sm">
            <Infinity className="size-4 text-primary" />
            学習記録は自動的に分析に反映されます
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="grid gap-5 md:grid-cols-2">
            {CATEGORY_CONFIG.map((category) => {
              const MetaIcon = category.icon;
              const meta = difficultyMeta[category.difficulty];
              const isActive = activeCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelected(isActive ? null : category.id)}
                  className={`relative h-full rounded-3xl border-2 border-slate-200 bg-gradient-to-br ${category.accent} p-6 text-left shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow">
                        <MetaIcon className="size-6" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{category.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${meta?.classes}`}
                    >
                      {meta?.label ?? "設定なし"}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ListChecks className="size-4 text-primary" />
                      全 {category.problems} 問
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-4 text-primary" />
                      目安 {category.duration}
                    </span>
                  </div>
                  <ArrowRight
                    className={`absolute bottom-5 right-5 size-5 text-slate-400 transition ${
                      isActive ? "translate-x-1 text-primary" : "group-hover:translate-x-1"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 -z-10 rounded-3xl border-2 border-primary/40 shadow-inner shadow-primary/20" />
                  )}
                </button>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">今日のおすすめ</h2>
                  <p className="text-sm text-muted-foreground">
                    最近の添削傾向をもとに優先度の高いメニューをピックアップしました。
                  </p>
                </div>
                <Link
                  to="/app/reviews"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs text-slate-700 shadow-sm"
                >
                  添削履歴を開く
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {recommendedFocus.map((item) => {
                  const MetaIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex size-10 items-center justify-center rounded-2xl text-slate-700 shadow"
                          style={{ background: `hsl(var(${item.tone}) / 0.18)` }}
                        >
                          <MetaIcon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full rounded-full border-slate-300">
                        {item.action}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/70 p-6 shadow-sm shadow-blue-200/60">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-white/90 text-blue-600 shadow">
                    <BrainCircuit className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">トレーニングのヒント</h3>
                    <p className="text-xs text-muted-foreground">
                      添削で指摘された構造的な課題をトレーニングで補強します。
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li>・ 1 日 2 メニューを目標に取り組みましょう。</li>
                  <li>・ メニュー完了後は振り返りメモを残すと効果的です。</li>
                  <li>・ 苦手分野は 48 時間以内に再挑戦すると定着しやすくなります。</li>
                </ul>
              </div>

              <div className="rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <LockKeyhole className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">近日追加予定</h3>
                    <p className="text-xs text-muted-foreground">
                      「モデル文章との比較」「制限時間モード」のアップデートを準備中です。
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-700">
                  新しいコンテンツが公開される際はメールでお知らせします。得たいスキルがあればフィードバックからお気軽にお知らせください。
                </p>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
