import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextEditor } from "@components/app/TextEditor";

export default function ReviewNew() {
  const navigate = useNavigate();
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const handleAnalysisComplete = (analysis) => {
    if (!analysis) return;
    
    // 分析結果をセット（TextEditorで表示）
    setCurrentAnalysis(analysis);
    
    // IDがあれば詳細ページに遷移可能（オプション）
    // navigate(`/app/reviews/${analysis.id}`);
  };

  return (
    <div className="w-full h-full">
      <TextEditor 
        onAnalysisComplete={handleAnalysisComplete}
        currentAnalysis={currentAnalysis}
        selectedHighlight={selectedHighlight}
        onHighlightSelect={setSelectedHighlight}
      />
    </div>
  );
}
