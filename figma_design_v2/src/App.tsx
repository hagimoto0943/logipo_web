import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { DashboardView } from './components/DashboardView';
import { TextEditor } from './components/TextEditor';
import { FeedbackPanel } from './components/FeedbackPanel';
import { HistoryView } from './components/HistoryView';
import { AccountView } from './components/AccountView';

export type MethodType = 'PREP' | 'SDS' | 'DESC' | 'FTBE';

export interface Highlight {
  type: string;
  text: string;
  score: number;
  feedback: string;
  startIndex: number;
  endIndex: number;
}

export interface Analysis {
  method: MethodType;
  highlights: Highlight[];
  overallScore: {
    [key: string]: number;
  };
  timestamp: number;
  originalText: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'history' | 'account'>('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<Analysis[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleAnalysisComplete = (analysis: Analysis) => {
    setCurrentAnalysis(analysis);
    setSavedAnalyses([analysis, ...savedAnalyses]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      {/* Desktop Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'dashboard' && (
          <DashboardView
            savedAnalyses={savedAnalyses}
            onSelectAnalysis={(analysis) => {
              setCurrentAnalysis(analysis);
              setCurrentView('editor');
            }}
          />
        )}

        {currentView === 'editor' && (
          <>
            <TextEditor
              onAnalysisComplete={handleAnalysisComplete}
              currentAnalysis={currentAnalysis}
              selectedHighlight={selectedHighlight}
              onHighlightSelect={setSelectedHighlight}
            />
            {currentAnalysis && (
              <FeedbackPanel
                analysis={currentAnalysis}
                selectedHighlight={selectedHighlight}
                onHighlightSelect={setSelectedHighlight}
              />
            )}
          </>
        )}
        
        {currentView === 'history' && (
          <HistoryView
            analyses={savedAnalyses}
            onSelectAnalysis={(analysis) => {
              setCurrentAnalysis(analysis);
              setCurrentView('editor');
            }}
          />
        )}
        
        {currentView === 'account' && (
          <AccountView />
        )}
      </div>
    </div>
  );
}
