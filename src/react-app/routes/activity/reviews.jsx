import React, {useState, useEffect} from "react";
import { SidebarProvider } from "@components/ui/sidebar"
import ReviewApi from "@api/base/review";

export default function Reviews() {
  const [reviews, setReviews] = useState(null);
  const reviewApi = new ReviewApi();

  return (
    <SidebarProvider>
      <div className="flex flex-row">
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">テストコンポーネント</h1>
          <p className="text-muted-foreground">テスト用のコンポーネントです</p>
        </div>
      </div>
    </div>
    </SidebarProvider>
  );
}
