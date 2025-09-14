import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { ContentListSidebar } from "@components/app/ContentListSidebar";
import { SidebarProvider } from "@components/ui/sidebar"
import ReviewApi from "@api/base/review";
import InteractiveTextHighlight from "@components/app/InteractiveTextHighlight";

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
      <div className="flex flex-row">
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {review.structure_kind?.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">原文</h2>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(review.result.score_analysis.score).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded text-center">
                          <div className="text-sm text-gray-600 capitalize">{key}</div>
                          <div className="text-2xl font-bold text-blue-600">{value}/5</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <ContentListSidebar side={"right"} />
      </div>
    </SidebarProvider>
  );
}
