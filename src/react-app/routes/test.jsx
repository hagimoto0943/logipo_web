import { ContentListSidebar } from "@components/app/ContentListSidebar";
import { SidebarProvider } from "@components/ui/sidebar"
import { ScoreAnalysisChart } from "@components/app/ScoreAnalysisChart";

export default function Test() {
  return (
    <SidebarProvider>
      <div className="flex flex-row w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">テストコンポーネント</h1>
            <p className="text-muted-foreground">テスト用のコンポーネントです</p>
            <ScoreAnalysisChart />
          </div>
        </div>
        <ContentListSidebar side={"right"} />
      </div>
    </SidebarProvider>
  );
}
