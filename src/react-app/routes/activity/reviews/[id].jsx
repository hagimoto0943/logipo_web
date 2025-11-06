import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  Loader2,
  PenSquare,
  RefreshCw,
} from "lucide-react";

import ReviewApi from "@api/base/review";
import InteractiveTextHighlight from "@components/app/InteractiveTextHighlight";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import FeedbackScorePanel from "@components/app/FeedbackScorePanel";

export default function ReviewDetail() {
  const { id } = useParams();
  const reviewApi = useMemo(() => new ReviewApi(), []);
  const [review, setReview] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErrorMessage("");

    reviewApi
      .getById(id)
      .then((res) => {
        if (!active) return;
        setReview(res?.data || null);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(error?.message || "添削の取得に失敗しました。時間をおいて再度お試しください。");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    reviewApi
      .getList({ offset: 0, limit: 6 })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setRecent(list.filter((item) => String(item.id) !== String(id)));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [id, reviewApi]);

  const handleRetry = () => {
    setReview(null);
    setRecent([]);
    setErrorMessage("");
    setLoading(true);
    reviewApi
      .getById(id)
      .then((res) => setReview(res?.data || null))
      .catch((error) => setErrorMessage(error?.message || "再読み込みに失敗しました。"))
      .finally(() => setLoading(false));
  };

  const renderHeaderMeta = () => {
    if (!review) return null;
    return (
      <div className="flex flex-col gap-2 text-sm text-muted-foreground lg:flex-row lg:items-center lg:gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700">
          <CalendarClock className="size-4" />
          {review.created_at ? new Date(review.created_at).toLocaleString() : "日時不明"}
        </div>
        <StructureKindBadge structureKind={review?.structure_kind} />
        {review?.result?.score_analysis?.score && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            スコア平均 {averageScore(review.result.score_analysis.score).toFixed(1)} / 5
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            読み込み中です…
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md rounded-3xl border border-rose-200 bg-white/80 p-8 text-center shadow-lg shadow-rose-100">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <RefreshCw className="size-6" />
            </div>
            <h1 className="mt-4 text-lg font-semibold text-slate-900">読み込みに失敗しました</h1>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/app/reviews"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 shadow-sm"
              >
                <ArrowLeft className="size-4" />
                履歴に戻る
              </Link>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm"
              >
                <RefreshCw className="size-4" />
                再読み込み
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-secondary/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              to="/app/reviews"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              履歴一覧に戻る
            </Link>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Review #{review.id}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {review.title || "無題の添削"}
              </h1>
            </div>
            {renderHeaderMeta()}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              to="/app/reviews/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm"
            >
              <PenSquare className="size-4" />
              新しい添削を依頼
            </Link>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-sm text-slate-700 shadow-sm"
            >
              <RefreshCw className="size-4" />
              再読み込み
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          {(review.result?.score_analysis?.score || review.result?.feedback) && (
            <div className="rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <FeedbackScorePanel
                feedback={review.result?.feedback}
                scores={review.result?.score_analysis?.score}
                title="総合フィードバック"
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <h2 className="text-lg font-semibold text-slate-900">添削文</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                ハイライトをクリックすると詳細が表示されます（従来通り本文下部で詳細を確認できます）。
              </p>
              <div className="mt-6">
                <InteractiveTextHighlight
                  originalText={review.original_text}
                  structureAnalysis={review.result?.structure_analysis}
                  structureKind={review?.structure_kind}
                  originalFeedback={review.result?.original_feedback}
                />
              </div>
            </div>

            {review.result?.model_text && (
              <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/60 p-6 shadow-sm shadow-blue-200/60">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  改善版
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  AI が提案した改善案です。表現の参考やリライトにご活用ください。
                </p>
                <div className="mt-4 rounded-2xl border border-blue-200 bg-white/90 p-4 text-sm leading-relaxed text-slate-800 shadow-inner">
                  <pre className="whitespace-pre-wrap font-sans">{review.result.model_text}</pre>
                </div>
              </div>
            )}
          </div>

          {recent.length > 0 && (
            <section className="rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">直近の添削</h2>
                  <p className="text-sm text-muted-foreground">類似の添削を振り返りましょう。</p>
                </div>
                <Link
                  to="/app/reviews"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  一覧を見る
                  <ChevronRight className="size-4" />
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {recent.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/app/reviews/${entry.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 transition hover:border-primary/60 hover:bg-primary/5"
                >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {entry.title || `レビュー #${entry.id}`}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.created_at
                          ? new Date(entry.created_at).toLocaleString()
                          : "日時不明"}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-slate-300 transition group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function averageScore(score) {
  if (!score) return 0;
  const values = Object.values(score).map((value) => Number(value) || 0);
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}
