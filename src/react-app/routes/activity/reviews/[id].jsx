import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewApi from "@api/base/review";
import { TextEditor } from "@components/app/TextEditor";
import { FeedbackPanel } from "@components/app/FeedbackPanel";

const STRUCTURE_LABELS = {
  prep: {
    point: "Point（主張）",
    reason: "Reason（理由）",
    example: "Example（具体例）",
    repoint: "Repoint（再主張）",
  },
  sds: {
    summary1: "Summary（要点）",
    details: "Details（詳細）",
    summary2: "Summary（要点）",
  },
  desc: {
    describe: "Describe（描写）",
    express: "Express（説明）",
    suggest: "Suggest（提案）",
    choose: "Choose（選択）",
  },
};

const normalizeStructureAnalysis = (rawStructure) => {
  if (!rawStructure) return {};
  const entries = Array.isArray(rawStructure)
    ? rawStructure.map((value, index) => [
        value?.key || value?.type?.toLowerCase?.() || `segment-${index}`,
        value,
      ])
    : Object.entries(rawStructure);

  return entries.reduce((acc, [rawKey, value], index) => {
    if (!value) return acc;

    const key =
      rawKey ||
      value?.key ||
      value?.type?.toLowerCase?.() ||
      `segment-${index}`;

    const startIndex = Number.isFinite(value.startIndex)
      ? value.startIndex
      : Number.isFinite(value.start_index)
        ? value.start_index
        : undefined;
    const endIndex = Number.isFinite(value.endIndex)
      ? value.endIndex
      : Number.isFinite(value.end_index)
        ? value.end_index
        : undefined;

    acc[key] = {
      ...value,
      text: value.text || "",
      score: value.score ?? null,
      comment: value.comment ?? value.feedback ?? "",
      startIndex,
      endIndex,
    };

    return acc;
  }, {});
};

const buildHighlightsFromStructure = (structure, method) => {
  if (!structure) return [];
  const labels = STRUCTURE_LABELS[method] || {};
  return Object.entries(structure)
    .map(([key, value]) => ({
      key,
      type: labels[key] || value.label || key,
      text: value.text,
      score: value.score,
      comment: value.comment,
      startIndex: value.startIndex,
      endIndex: value.endIndex,
    }))
    .sort((a, b) => {
      if (Number.isFinite(a.startIndex) && Number.isFinite(b.startIndex)) {
        return a.startIndex - b.startIndex;
      }
      return 0;
    });
};

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const reviewApi = new ReviewApi();

  useEffect(() => {
    reviewApi.getById(id).then(res => {
      const item = res.data;
      const method = item.structure_kind?.toLowerCase?.() || "prep";
      const structureAnalysis = normalizeStructureAnalysis(item.result?.structure_analysis);
      const highlights = buildHighlightsFromStructure(structureAnalysis, method);

      const formatted = {
        id: item.id,
        timestamp: new Date(item.created_at).getTime(),
        method,
        originalText: item.original_text,
        overallScore: item.result?.score_analysis?.score || {},
        structureAnalysis,
        originalFeedback: item.result?.feedback,
        highlights,
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
        selectedHighlight={selectedHighlight}
        onHighlightSelect={setSelectedHighlight}
      />
      {review && (
        <FeedbackPanel
          analysis={review}
          selectedHighlight={selectedHighlight}
          onHighlightSelect={setSelectedHighlight}
        />
      )}
    </div>
  );
}
