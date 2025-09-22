import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { ContentListSidebar } from "@components/app/ContentListSidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@components/ui/sidebar"
import { Button } from "@components/ui/button"
import { PanelLeft } from "lucide-react"
import ReviewApi from "@api/base/review";
import InteractiveTextHighlight from "@components/app/InteractiveTextHighlight";
import { StructureKindBadge } from "@components/app/StructureKindBadge";
import { StructureAnalysisChart } from "@components/app/StructureAnalysisChart";
import FeedbackScorePanel from "@components/app/FeedbackScorePanel";

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

  const HeaderToggle = () => {
    const { open, toggleSidebar } = useSidebar()
    // Keep layout stable: render placeholder when open (invisible button keeps size)
    return (
      <Button
        onClick={open ? undefined : toggleSidebar}
        variant="outline"
        size="sm"
        className={`hidden md:inline-flex items-center gap-2 text-stone-700 ${open ? 'invisible pointer-events-none' : ''}`}
        title="履歴を開く"
        aria-label="履歴を開く"
      >
        <PanelLeft className="h-4 w-4" />
        <span>履歴</span>
      </Button>
    )
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-row w-full">
        <div className="container lg:mx-8 px-4 py-4 flex-1">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold text-stone-700">{review.title}</h1>
              <HeaderToggle />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <StructureKindBadge structureKind={review?.structure_kind} size="text-xs" />
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </span>
            </div>
            {/* Analysis summary: integrated feedback + radar (7:3) */}
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
                  />
                </div>
              </Grid>
              <Grid item size={12}>
                {review.result?.structure_analysis && (
                  <div>
                    <StructureAnalysisChart 
                      structure={review.result.structure_analysis} title="構造分析" 
                      description="このチャートは、文章の各構成要素（主張、理由、具体例、再主張）を分析し、スコア化したものです。
                                    各要素がバランスよく配置されているかを視覚的に把握できます。
                                    チャートを活用することで、説得力のある文章構成を目指す際の参考になります。" 
                    />
                  </div>
                )}
              </Grid>
              <Grid item size={12}>
                {review.result && (
                  <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">添削結果</h2>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">改善版</h3>
                      <p className="text-gray-800 leading-relaxed bg-green-50 p-4 rounded">
                        {review.result.model_text}
                      </p>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>

          </div>
        </div>
        <div className="flex-shrink-0">
          <ContentListSidebar side={"right"} collapsible="offcanvas" width="clamp(260px, 24vw, 380px)" dense overlay />
        </div>
      </div>
      {/* Floating toggle for easy access */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <SidebarTrigger className="inline-flex h-12 w-12 rounded-full border bg-white shadow-lg text-stone-700 hover:bg-stone-50" title="履歴" aria-label="履歴" />
      </div>
    </SidebarProvider>
  );
}
