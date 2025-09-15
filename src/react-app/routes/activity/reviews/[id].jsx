import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { ContentListSidebar } from "@components/app/ContentListSidebar";
import { SidebarProvider } from "@components/ui/sidebar"
import ReviewApi from "@api/base/review";
import InteractiveTextHighlight from "@components/app/InteractiveTextHighlight";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import { ScoreAnalysisChart } from "@components/app/ScoreAnalysisChart";

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const reviewApi = new ReviewApi();

  useEffect(() => {
    reviewApi.getById(id).then(res => {
      setReview(res.data);
      console.log(res);
    });
  }, [id]);

  if (!review) {
    return (
      <SidebarProvider>
        <div className="flex flex-row">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          </div>
          <ContentListSidebar side={"right"} />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-row w-full">
        <div className="container lg:mx-8 px-4 py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-stone-700 mb-4">{review.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <StructureKindBadge structureKind={review?.structure_kind} size="text-xs" />
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-md font-semibold text-stone-600 mb-4">添削した文章</h2>
              <InteractiveTextHighlight 
                originalText={review.original_text}
                structureAnalysis={review.result?.structure_analysis}
              />
            </div>

            {review.result && (
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">添削結果</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">改善版</h3>
                  <p className="text-gray-800 leading-relaxed bg-green-50 p-4 rounded">
                    {review.result.model_text}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">総合フィードバック</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {review.result.feedback}
                  </p>
                </div>

                {review.result.score_analysis && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">スコア分析</h3>
                    <ScoreAnalysisChart scores={review.result.score_analysis?.score} title="文章力総合分析 (Comprehensive Writing Analysis)" description="このチャートは、文章を「構成力」「論理性」「具体性」「明瞭性」の4つの観点から分析し、スコア化したものです。
各観点は、読者に伝わりやすく、説得力のある文章を書くために重要な要素です。
チャートを活用することで、自分の文章の強みや改善点を直感的に把握できます。" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <ContentListSidebar side={"right"} />
        </div>
      </div>
    </SidebarProvider>
  );
}
