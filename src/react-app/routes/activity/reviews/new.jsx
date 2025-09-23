import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCreateForm from "@components/app/ReviewCreateForm";

export default function ReviewNew() {
  const navigate = useNavigate()

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-stone-700">新規添削</h1>
          <p className="text-sm text-muted-foreground">文章を入力して添削を開始します。作成後は詳細ページで結果を確認できます。</p>
        </div>
        <ReviewCreateForm onCreated={(created)=>navigate(`/app/reviews/${created.id}`)} />
      </div>
    </div>
  );
}
