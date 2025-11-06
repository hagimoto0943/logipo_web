import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewApi from "@api/base/review";
import { TextEditor } from "@components/app/TextEditor";
import { FeedbackPanel } from "@components/app/FeedbackPanel";

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const reviewApi = new ReviewApi();

  useEffect(() => {
    reviewApi.getById(id).then(res => {
      const item = res.data;
      const formatted = {
        id: item.id,
        timestamp: new Date(item.created_at).getTime(),
        method: item.structure_kind,
        originalText: item.original_text,
        overallScore: item.result?.score_analysis?.score || {},
        highlights: Array.isArray(item.result?.structure_analysis) ? item.result.structure_analysis : Object.values(item.result?.structure_analysis || {}),
      };
      setReview(formatted);
    });
  }, [id]);

  if (!review) {
    return (
      <div className="w-full px-4 py-8">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <TextEditor
        currentAnalysis={review}
        onAnalysisComplete={() => {}}
        selectedHighlight={null}
        onHighlightSelect={() => {}}
      />
      {review && (
        <FeedbackPanel
          analysis={review}
          selectedHighlight={null}
          onHighlightSelect={() => {}}
        />
      )}
    </div>
  );
}