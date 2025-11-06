import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpenCheck, ChevronRight, Sparkles, Wand2 } from "lucide-react";

import ReviewCreateForm from "@components/app/ReviewCreateForm";

export default function ReviewNew() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#f3f6ff] via-white to-[#f5fbff]">
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
              Ai Compose
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                添削リクエストを作成
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                文章を入力すると、AI が構造を分析してフィードバックを返します。構造テンプレートを選んで書き始めてください。
              </p>
            </div>
          </div>
          <Link
            to="/app/reviews"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            履歴を見る
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <section className="space-y-6 rounded-3xl border-2 border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60 lg:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-slate-900">添削フォーム</h2>
              <p className="text-xs text-muted-foreground">
                PREP / SDS / DESC / FREE の構造テンプレートから選んで、文章を入力してください。Enter で送信、Shift + Enter で改行できます。
              </p>
            </div>

            <ReviewCreateForm
              onCreated={(created) => navigate(`/app/reviews/${created.id}`)}
              submitLabel="添削を依頼"
              placeholder="例：PREP 構造に沿って、主張→理由→具体例→再主張の順で文章を入力してください。"
            />
          </section>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 p-6 shadow-sm shadow-blue-200/60">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/80 text-blue-600 shadow">
                  <Wand2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">構造のコツ</h3>
                  <p className="text-xs text-muted-foreground">
                    段落ごとに役割を決め、キーフレーズで始めると構造が明確になります。
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-xs text-slate-700">
                <li className="leading-relaxed">
                  <span className="font-semibold text-blue-600">PREP</span> : Point → Reason → Example → Point の順でメリハリを付ける。
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold text-blue-600">SDS</span> : Summary で結論を先に述べ、Details で情報を補強する。
                </li>
                <li className="leading-relaxed">
                  <span className="font-semibold text-blue-600">DESC</span> : Describe で状況を整理し、Solution で次の行動を示す。
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <BookOpenCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">送信前チェック</h3>
                  <p className="text-xs text-muted-foreground">
                    以下を確認してから送信すると、フィードバックの精度が高まります。
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li>・ 300〜600 文字程度を目安にまとめましょう。</li>
                <li>・ 各段落の役割がひと目で分かるように書き出しを工夫します。</li>
                <li>・ 具体的な数値や事例を入れると改善ポイントが明確になります。</li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/80 p-6 text-sm leading-relaxed text-emerald-900 shadow-sm shadow-emerald-100">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4" />
                添削後の流れ
              </div>
              <p className="mt-3 text-xs text-emerald-800">
                送信すると AI が文章を解析し、構造ハイライトとスコアを生成します。ハイライトをクリックした際の詳細表示は、既存のプロジェクト仕様どおり本文下部に表示されます。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
