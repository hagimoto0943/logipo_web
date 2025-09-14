import React, { useState } from 'react';

export default function InteractiveTextHighlight({ originalText, structureAnalysis }) {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getScoreColor = (score) => {
    if (score >= 5) return 'bg-green-200 border-green-400 hover:bg-green-300';
    if (score >= 4) return 'bg-yellow-200 border-yellow-400 hover:bg-yellow-300';
    return 'bg-red-200 border-red-400 hover:bg-red-300';
  };

  const handleSegmentClick = (segment, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setSelectedSegment(selectedSegment === segment ? null : segment);
  };

  const renderHighlightedText = () => {
    if (!structureAnalysis) return originalText;

    const segments = [
      { key: 'point', ...structureAnalysis.point },
      { key: 'reason', ...structureAnalysis.reason },
      { key: 'example', ...structureAnalysis.example },
      { key: 'repoint', ...structureAnalysis.repoint }
    ].filter(segment => segment.text);

    // テキストを解析してハイライト位置を特定
    const highlightSegments = segments.map(segment => {
      const index = originalText.indexOf(segment.text);
      return {
        ...segment,
        start: index,
        end: index + segment.text.length,
        found: index !== -1
      };
    }).filter(segment => segment.found);

    // 位置でソート
    highlightSegments.sort((a, b) => a.start - b.start);

    // JSXを構築
    const elements = [];
    let currentIndex = 0;

    highlightSegments.forEach((segment, i) => {
      // ハイライト前のテキスト
      if (currentIndex < segment.start) {
        elements.push(originalText.substring(currentIndex, segment.start));
      }

      // ハイライトされるテキスト
      elements.push(
        <span
          key={segment.key}
          className={`cursor-pointer border-b-2 px-1 rounded transition-colors duration-200 ${getScoreColor(segment.score)}`}
          onClick={(e) => handleSegmentClick(segment, e)}
          title={`${segment.key.toUpperCase()}: スコア ${segment.score}/5`}
        >
          {segment.text}
        </span>
      );

      currentIndex = segment.end;
    });

    // 残りのテキスト
    if (currentIndex < originalText.length) {
      elements.push(originalText.substring(currentIndex));
    }

    return elements;
  };

  return (
    <div className="relative">
      <div className="text-lg leading-relaxed whitespace-pre-wrap">
        {renderHighlightedText()}
      </div>
      
      {selectedSegment && (
        <div 
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <div className="text-sm font-semibold mb-2 text-gray-700">
            {selectedSegment.key.toUpperCase()}部分の評価
          </div>
          <div className="text-sm text-gray-600 mb-2">
            スコア: {selectedSegment.score}/5
          </div>
          <div className="text-sm text-gray-800">
            {selectedSegment.comment}
          </div>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={() => setSelectedSegment(null)}
          >
            ×
          </button>
        </div>
      )}
      
      {selectedSegment && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setSelectedSegment(null)}
        />
      )}
    </div>
  );
}