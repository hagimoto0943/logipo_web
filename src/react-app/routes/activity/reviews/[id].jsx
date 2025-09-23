import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import ReviewApi from "@api/base/review";
import InteractiveTextHighlight from "@components/app/InteractiveTextHighlight";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import { StructureAnalysisChart } from "@components/app/StructureAnalysisChart";
import FeedbackScorePanel from "@components/app/FeedbackScorePanel";

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [recent, setRecent] = useState([]);
  const reviewApi = new ReviewApi();

  useEffect(() => {
    reviewApi.getById(id).then(res => {
      setReview(res.data);
      console.log(res);
    });
    // recent links (exclude current id)
    reviewApi.getList({ offset: 0, limit: 5 }).then(res => {
      const items = Array.isArray(res.data) ? res.data : []
      setRecent(items.filter(r => String(r.id) !== String(id)))
    }).catch(() => {})
  }, [id]);

  if (!review) {
    return (
      <div className="w-full px-4 py-8">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-stone-700">{review.title || '無題'}</h1>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <StructureKindBadge structureKind={review?.structure_kind} size="text-xs" />
          <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleString()}</span>
        </div>
        {(review.result?.score_analysis || review.result?.feedback) && (
          <div className="mb-6">
            <FeedbackScorePanel
              feedback={review.result?.feedback}
              scores={review.result?.score_analysis?.score}
            />
          </div>
        )}

        <Grid container spacing={2}>
          <Grid item size={12}>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-md font-semibold text-stone-600 mb-4">添削した文章</h2>
              <InteractiveTextHighlight
                originalText={review.original_text}
                structureAnalysis={review.result?.structure_analysis}
                structureKind={review?.structure_kind}
                originalFeedback={review.result?.original_feedback}
              />
            </div>
          </Grid>
          <Grid item size={12}>
            {review.result && (
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-md font-semibold mb-4">改善版</h2>
                <p className="text-sm text-gray-800 leading-relaxed bg-green-50 p-4 rounded whitespace-pre-wrap">
                  {review.result.model_text}
                </p>
              </div>
            )}
          </Grid>
        </Grid>

        {recent.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-medium text-stone-600 mb-2">直近の履歴</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {recent.map(r => (
                <li key={r.id}>
                  <Link className="hover:underline" to={`/app/reviews/${r.id}`}>{r.title || `レビュー #${r.id}`}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
