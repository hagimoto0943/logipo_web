import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Award,
  CalendarDays,
  ChevronRight,
  FileText,
  Flame,
  PenLine,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import ReviewApi from "@api/base/review";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card.jsx";
import { StructureKindBadge } from "@components/app/StructureKindBadge";

const statsConfig = [
  {
    key: "score",
    label: "総合スコア",
    value: "4.2",
    trend: 8.3,
    trendLabel: "先週比",
    icon: Target,
    color: "hsl(var(--tone-1))",
  },
  {
    key: "streak",
    label: "連続記録",
    value: "12日",
    trendLabel: "最高記録: 28日",
    icon: Flame,
    color: "hsl(var(--tone-4))",
  },
  {
    key: "total",
    label: "文章解析数",
    value: "47件",
    trend: 15,
    trendLabel: "今月: 12件",
    icon: FileText,
    color: "hsl(var(--tone-2))",
  },
  {
    key: "badges",
    label: "獲得バッジ",
    value: "8 / 20",
    trendLabel: "次のバッジまで 2件",
    icon: Award,
    color: "hsl(var(--tone-3))",
  },
];

const progressAreas = [
  { key: "prep", label: "PREP（構造化）", percent: 78, tone: "--tone-1" },
  { key: "logic", label: "論理的推論", percent: 72, tone: "--tone-2" },
  { key: "writing", label: "表現力", percent: 65, tone: "--tone-3" },
  { key: "delivery", label: "伝達力", percent: 58, tone: "--tone-4" },
];

const nextActions = [
  {
    title: "図表読解リライト",
    description: "先週添削した文章の改善版を仕上げましょう。",
    accent: "bg-blue-50 border-blue-200 text-blue-700",
    link: "/app/reviews",
  },
  {
    title: "PREP構造 3分ドリル",
    description: "各要素を 120 文字以内で整理する練習です。",
    accent: "bg-emerald-50 border-emerald-200 text-emerald-700",
    link: "/app/training",
  },
];

const badgeProgress = [
  {
    title: "構造化マスター",
    description: "PREP 構造でスコア 4.0 以上を 5 回達成",
    done: 4,
    total: 5,
    tone: "--tone-1",
  },
  {
    title: "継続学習",
    description: "7 日連続で添削を実施",
    done: 5,
    total: 7,
    tone: "--tone-2",
  },
  {
    title: "改善サイクル",
    description: "改善版の提出を 10 回達成",
    done: 6,
    total: 10,
    tone: "--tone-3",
  },
];

export default function Dashboard() {
  const reviewApi = useMemo(() => new ReviewApi(), []);
  const [recentReviews, setRecentReviews] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    setIsLoadingRecent(true);
    setHasError(false);
    reviewApi
      .getList({ limit: 5, offset: 0 })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setRecentReviews(list);
      })
      .catch(() => {
        if (!active) return;
        setHasError(true);
        setRecentReviews([]);
      })
      .finally(() => {
        if (active) setIsLoadingRecent(false);
      });

    return () => {
      active = false;
    };
  }, [reviewApi]);

  const renderTrend = (trend) => {
    if (typeof trend !== "number") return null;
    const isPositive = trend >= 0;
    const TrendIcon = isPositive ? ArrowUp : ArrowDown;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}
      >
        <TrendIcon className="size-3.5" />
        {Math.abs(trend)}%
      </span>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-secondary/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Overview
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              ダッシュボード
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              最近の添削やトレーニングの状況を俯瞰できます。継続記録を伸ばしましょう。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild className="shadow-md">
              <Link to="/app/reviews/new">
                <PenLine className="mr-2 size-4" />
                新規添削を依頼
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/70 backdrop-blur">
              <Link to="/app/reviews">
                <CalendarDays className="mr-2 size-4" />
                履歴を確認
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="rounded-2xl border-2 border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/40 transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl border-2"
                    style={{ borderColor: stat.color, color: stat.color }}
                  >
                    <Icon className="size-6" strokeWidth={1.8} />
                  </div>
                  {renderTrend(stat.trend)}
                </div>
                <div className="mt-6">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                {stat.trendLabel && (
                  <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    {stat.trendLabel}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Progress & streak */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card className="border-2 border-slate-200 bg-white/90 shadow-sm shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">学習バランス</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    添削結果とトレーニングから算出した重点スコアです。
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  <TrendingUp className="size-4" />
                  推移良好
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {progressAreas.map((area) => (
                  <div key={area.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{area.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{area.percent}%</span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-200/70">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${area.percent}%`,
                          background: `linear-gradient(90deg, hsl(var(${area.tone}) / 0.85), hsl(var(${area.tone})))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 bg-white/90 shadow-sm shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">継続記録</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    12 日連続で添削を行っています。あと 3 日で新しいバッジを獲得できます。
                  </p>
                </div>
                <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600">
                  <Flame className="mr-1 inline size-4" />
                  12 日継続中
                </div>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
                {Array.from({ length: 21 }).map((_, index) => {
                  const isFilled = index >= 21 - 12;
                  return (
                    <span
                      key={index}
                      className={`h-10 rounded-lg border ${
                        isFilled
                          ? "border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200/70"
                          : "border-slate-200 bg-slate-100/60"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <Sparkles className="mr-2 inline size-4" />
                3 日後に「継続学習」バッジを獲得予定です。
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Activity + suggestions */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <Card className="border-2 border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">最近の添削履歴</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    直近 5 件の添削結果を確認できます。
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/reviews">一覧へ</Link>
                </Button>
              </div>
              <div className="divide-y divide-slate-200">
                {isLoadingRecent && (
                  <div className="px-6 py-6 text-sm text-muted-foreground">読み込み中...</div>
                )}
                {!isLoadingRecent && hasError && (
                  <div className="px-6 py-6 text-sm text-rose-500">
                    履歴を取得できませんでした。時間をおいて再度お試しください。
                  </div>
                )}
                {!isLoadingRecent && !hasError && recentReviews.length === 0 && (
                  <div className="px-6 py-6 text-sm text-muted-foreground">
                    まだ添削履歴がありません。最初の文章を投稿してみましょう。
                  </div>
                )}
                {recentReviews.map((review) => (
                  <Link
                    key={review.id}
                    to={`/app/reviews/${review.id}`}
                    className="group block px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StructureKindBadge structureKind={review?.structure_kind} />
                          <span className="text-xs text-muted-foreground">
                            {review.created_at
                              ? new Date(review.created_at).toLocaleString()
                              : "日時不明"}
                          </span>
                        </div>
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {review.title || `レビュー #${review.id}`}
                        </p>
                        {review.original_text && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {String(review.original_text).replace(/\s+/g, " ")}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="mt-1 size-4 text-slate-300 transition group-hover:text-slate-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">次のアクション</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    苦手分野からおすすめのトレーニングを提案します。
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {nextActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className={`block rounded-2xl border px-5 py-4 transition hover:translate-x-1 hover:shadow ${action.accent}`}
                  >
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="mt-2 text-xs leading-relaxed opacity-90">{action.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="mt-6">
          <Card className="border-2 border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">バッジ進捗</h2>
                  <p className="text-sm text-muted-foreground">
                    目標達成でバッジを獲得し、継続のモチベーションに繋げましょう。
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/app/account">詳細を確認</Link>
                </Button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {badgeProgress.map((badge) => {
                  const rate = Math.min(100, Math.round((badge.done / badge.total) * 100));
                  return (
                    <div
                      key={badge.title}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                      <div className="mt-4 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${rate}%`,
                            background: `linear-gradient(90deg, hsl(var(${badge.tone}) / 0.85) 0%, hsl(var(${badge.tone})) 100%)`,
                          }}
                        />
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-600">
                        {badge.done} / {badge.total} 達成
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
