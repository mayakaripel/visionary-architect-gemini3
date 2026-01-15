import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeImagery } from './services/geminiService';
import { AnalysisResult } from './types';
import { ScanEye, BrainCircuit, ShieldCheck, ChevronRight, LayoutDashboard } from 'lucide-react';

const App = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("Initializing System...");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalysisStart = () => {
    setResult(null);
    setIsAnalyzing(true);
    setAnalysisStatus("Initializing Gemini 3...");
  };

  const handleAnalysisComplete = async (frames: string[]) => {
    try {
      const data = await analyzeImagery(frames, (status) => {
        setAnalysisStatus(status);
      });
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-900/20">
               <ScanEye className="text-white w-5 h-5" />
             </div>
             <div>
               <h1 className="text-lg font-bold tracking-tight text-white leading-none">Visionary Architect</h1>
               <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Civic Intelligence System</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-mono border border-zinc-800 px-3 py-1.5 rounded-full bg-zinc-900/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            <button 
               onClick={() => window.location.reload()}
               className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero / Intro */}
        {!result && !isAnalyzing && (
          <div className="text-center space-y-6 py-12">
             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
               Next-Gen <span className="text-indigo-500">Structural Safety</span> Analysis
             </h2>
             <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
               Leveraging Gemini 3 Deep Reasoning to identify hazards, assess structural integrity, and generate tactical response plans from drone imagery in real-time.
             </p>
             
             <div className="flex flex-wrap justify-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  <span>Deep Reasoning</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                  <span>Spatial Planning</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Risk Assessment</span>
                </div>
             </div>
          </div>
        )}

        {/* Input Section */}
        <div className="max-w-3xl mx-auto">
          {!result && (
             <UploadZone 
               onAnalysisStart={handleAnalysisStart} 
               onAnalysisComplete={handleAnalysisComplete} 
             />
          )}

          {isAnalyzing && (
            <div className="mt-8 space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-mono text-zinc-400 uppercase">
                    <span className="animate-pulse text-indigo-400">{analysisStatus}</span>
                    <span>Gemini 3 Processing</span>
                 </div>
                 <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-1/2 animate-[shimmer_2s_infinite] relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide"></div>
                    </div>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-zinc-900 rounded border border-zinc-800 animate-pulse"></div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <AnalysisResults data={result} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-zinc-600 text-sm font-mono">
             Visionary Architect &copy; {new Date().getFullYear()} • Powered by Google Gemini 3
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;