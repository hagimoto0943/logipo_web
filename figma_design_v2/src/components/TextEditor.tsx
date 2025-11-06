import { useState } from 'react';
import { Tabs } from './ui/tabs';
import { Button } from './ui/button';
import { BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileFeedbackSheet } from './MobileFeedbackSheet';
import type { MethodType, Analysis, Highlight } from '../App';

interface TextEditorProps {
  onAnalysisComplete: (analysis: Analysis) => void;
  currentAnalysis: Analysis | null;
  selectedHighlight: Highlight | null;
  onHighlightSelect: (highlight: Highlight | null) => void;
}

export function TextEditor({
  onAnalysisComplete,
  currentAnalysis,
  selectedHighlight,
  onHighlightSelect,
}: TextEditorProps) {
  const [text, setText] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<MethodType>('PREP');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMobileFeedbackOpen, setIsMobileFeedbackOpen] = useState(false);

  const methods: { value: MethodType; label: string }[] = [
    { value: 'PREP', label: 'PREP' },
    { value: 'SDS', label: 'SDS' },
    { value: 'DESC', label: 'DESC' },
    { value: 'FTBE', label: 'FTBE' },
  ];

  const analyzeText = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // シミュレーション: 実際のAI分析に置き換え
    setTimeout(() => {
      const analysis = performAnalysis(text, selectedMethod);
      onAnalysisComplete(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const performAnalysis = (inputText: string, method: MethodType): Analysis => {
    // PREP法の例: 文章を自動的に分類
    const sentences = inputText.split('。').filter(s => s.trim());
    
    if (method === 'PREP') {
      const highlights: Highlight[] = [];
      let currentIndex = 0;

      sentences.forEach((sentence, i) => {
        const type = i === 0 ? 'Point' : i === 1 ? 'Reason' : i === 2 ? 'Example' : 'Point';
        const score = Math.random() * 3 + 2; // 2-5点
        const text = sentence + '。';
        
        highlights.push({
          type,
          text,
          score: Math.round(score * 10) / 10,
          feedback: getFeedback(type, score),
          startIndex: currentIndex,
          endIndex: currentIndex + text.length,
        });
        
        currentIndex += text.length;
      });

      return {
        method,
        highlights,
        overallScore: {
          Point: 4.2,
          Reason: 3.8,
          Example: 4.5,
        },
        timestamp: Date.now(),
        originalText: inputText,
      };
    }

    // 他のメソッドも同様に実装
    return {
      method,
      highlights: [],
      overallScore: {},
      timestamp: Date.now(),
      originalText: inputText,
    };
  };

  const getFeedback = (type: string, score: number): string => {
    if (score >= 4.5) {
      return `${type}が明確に表現されています。論理的な構成で優れています。`;
    } else if (score >= 3.5) {
      return `${type}は理解できますが、もう少し具体性を持たせると良いでしょう。`;
    } else {
      return `${type}の表現が不明瞭です。より明確に述べることを意識しましょう。`;
    }
  };

  const getHighlightColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Point: 'bg-blue-50 hover:bg-blue-100 border-b-2 border-blue-200',
      Reason: 'bg-emerald-50 hover:bg-emerald-100 border-b-2 border-emerald-200',
      Example: 'bg-amber-50 hover:bg-amber-100 border-b-2 border-amber-200',
    };
    return colors[type] || 'bg-slate-50 hover:bg-slate-100 border-b-2 border-slate-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-[#34A853]';
    if (score >= 3.5) return 'text-[#4285F4]';
    return 'text-[#FBBC04]';
  };

  const renderTextWithHighlights = () => {
    if (!currentAnalysis || currentAnalysis.highlights.length === 0) {
      return <span className="text-slate-400">{text || 'ここにテキストを入力してください...'}</span>;
    }

    return currentAnalysis.highlights.map((highlight, index) => (
      <span key={index} className="inline-block">
        <span
          className={`
            ${getHighlightColor(highlight.type)}
            cursor-pointer transition-colors duration-150
            ${selectedHighlight === highlight ? 'bg-blue-100 border-blue-400' : ''}
          `}
          onClick={() => onHighlightSelect(selectedHighlight === highlight ? null : highlight)}
        >
          {highlight.text}
        </span>
        
        {/* Inline Detail Card */}
        <AnimatePresence>
          {selectedHighlight === highlight && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="block mt-4 mb-6 mx-0"
            >
              <div className="bg-white rounded-xl p-5 border-2 border-[#4285F4] shadow-lg max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 bg-[#4285F4] text-white rounded-md">
                      {highlight.type}
                    </span>
                    <span className={`text-xl ${getScoreColor(highlight.score)}`}>
                      {highlight.score.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHighlightSelect(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "{highlight.text}"
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#4285F4] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {highlight.feedback}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    ));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Text Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 lg:px-16 py-12 lg:py-20">
          {/* Method Selector */}
          {!currentAnalysis && (
            <div className="mb-8">
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as MethodType)}
                className="text-sm text-slate-500 bg-transparent border-none outline-none cursor-pointer hover:text-slate-700 transition-colors"
              >
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}法
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Editor */}
          {!currentAnalysis ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="文章を入力してください..."
              className="w-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none text-slate-800 placeholder:text-slate-300"
              autoFocus
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[500px]"
            >
              <div className="leading-relaxed text-slate-800">
                {renderTextWithHighlights()}
              </div>
            </motion.div>
          )}

          {/* Action Bar - Inline at bottom */}
          <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {text.length} 文字
            </div>
            
            <div className="flex gap-2">
              {!currentAnalysis ? (
                <Button
                  onClick={analyzeText}
                  disabled={!text.trim() || isAnalyzing}
                  className="bg-[#4285F4] hover:bg-[#3367d6] text-white px-5 py-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm shadow-sm hover:shadow-md"
                >
                  {isAnalyzing ? '分析中...' : '分析'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setText('');
                      onAnalysisComplete(null as any);
                      onHighlightSelect(null);
                    }}
                    variant="ghost"
                    className="px-4 py-1.5 rounded-md text-sm text-slate-600"
                  >
                    リセット
                  </Button>
                  {/* Mobile Feedback Button */}
                  <Button
                    onClick={() => setIsMobileFeedbackOpen(true)}
                    className="lg:hidden bg-[#4285F4] hover:bg-[#3367d6] text-white px-5 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md"
                  >
                    結果を見る
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Feedback Sheet */}
      <MobileFeedbackSheet
        analysis={currentAnalysis}
        selectedHighlight={selectedHighlight}
        onHighlightSelect={onHighlightSelect}
        isOpen={isMobileFeedbackOpen}
        onClose={() => setIsMobileFeedbackOpen(false)}
      />
    </div>
  );
}
