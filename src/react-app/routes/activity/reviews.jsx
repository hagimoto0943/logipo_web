import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, NotepadText, RefreshCw } from "lucide-react";

import ReviewApi from "@api/base/review";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import { Button } from "@components/ui/button";

const PAGE_LIMIT = 12;

export default function Reviews() {
  const reviewApi = useMemo(() => new ReviewApi(), []);
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasMore = total == null || offset < total;

  const load = useCallback(
    async ({ reset = false } = {}) => {
      if (loading) return;
      if (!reset && total != null && offset >= total) return;

      setLoading(true);
      setErrorMessage("");
      const currentOffset = reset ? 0 : offset;
      try {
        const res = await reviewApi.getList({ limit: PAGE_LIMIT, offset: currentOffset });
        const list = Array.isArray(res?.data) ? res.data : [];
        const nextOffset = currentOffset + list.length;

        setItems((prev) => (reset ? list : [...prev, ...list]));
        setOffset(nextOffset);

        if (typeof res?.total === "number") {
          setTotal(res.total);
        } else if (list.length < PAGE_LIMIT) {
          setTotal(nextOffset);
        } else if (reset) {
          setTotal(null);
        }
      } catch (error) {
        if (reset) {
          setItems([]);
          setOffset(0);
          setTotal(null);
        }
        setErrorMessage(
          error?.message || "履歴の読み込みに失敗しました。時間をおいて再度お試しください。"
        );
      } finally {
        setInitialLoaded(true);
        setLoading(false);
      }
    },
    [loading, offset, reviewApi, total]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    load({ reset: true });
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-secondary/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Records
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              添削履歴
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              これまでに行った添削が並びます。クリックすると詳細を確認できます。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="shadow-sm">
              <Link to="/app/reviews/new">新規添削を依頼</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="mr-2 size-4" />
              更新
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}

          {!loading && initialLoaded && items.length === 0 && !errorMessage && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white/80 px-10 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <NotepadText className="size-8 text-slate-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">まだ添削履歴がありません</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  新しい文章を添削すると、ここに履歴が表示されます。
                </p>
              </div>
              <Button asChild>
                <Link to="/app/reviews/new">最初の添削を依頼する</Link>
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <Link
                to={`/app/reviews/${item.id}`}
                key={item.id}
                className="group block rounded-2xl border-2 border-slate-200 bg-white/80 px-5 py-4 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StructureKindBadge structureKind={item?.structure_kind} />
                      <span className="text-xs text-muted-foreground">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "日時不明"}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                      {item.title || `レビュー #${item.id}`}
                    </p>
                    {item.original_text && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {String(item.original_text).replace(/\s+/g, " ")}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="mt-1 size-5 text-slate-300 transition group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            {hasMore ? (
              <Button
                variant="outline"
                onClick={() => load()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-2 text-sm shadow-sm"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? "読み込み中…" : "さらに読み込む"}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">すべて表示しました</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
