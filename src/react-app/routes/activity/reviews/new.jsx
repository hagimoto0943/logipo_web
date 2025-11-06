import React from "react";
import { useNavigate } from "react-router-dom";
import { TextEditor } from "@components/app/TextEditor";
import ReviewApi from "@api/base/review";

export default function ReviewNew() {
  const navigate = useNavigate();
  const reviewApi = new ReviewApi();

  const handleAnalysisComplete = async (analysis) => {
    const payload = {
      structure_kind: analysis.method,
      original_text: analysis.originalText,
      title: `レビュー ${new Date().toLocaleString()}`,
      result: {
        structure_analysis: analysis.highlights,
        score_analysis: {
          score: analysis.overallScore,
        },
      },
    };

    try {
      const res = await reviewApi.post(payload);
      const created = res?.data || res;
      if (created?.id) {
        navigate(`/app/reviews/${created.id}`);
      }
    } catch (error) {
      console.error("Failed to save the review:", error);
    }
  };

  return (
    <div className="w-full">
      <TextEditor onAnalysisComplete={handleAnalysisComplete} />
    </div>
  );
}