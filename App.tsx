import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScoreCard } from './components/ScoreCard';
import { DiagnosticTable } from './components/DiagnosticTable';
import { RewriteView } from './components/RewriteView';
import { analyzeText } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { Wand2, AlertCircle, Loader2, Download } from 'lucide-react';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await analyzeText(text);
      setResult(data);
      setState(AppState.RESULTS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setResult(null);
    setText('');
    setError(null);
  };

  const handleDownloadReport = () => {
    // 1. Extract Styles from document.styleSheets
    let styles = '';
    // Explicitly add the font imports as they might not be in cssRules if loaded via link
    styles += `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');\n`;

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        // Accessing cssRules can throw SecurityError for cross-origin sheets
        const rules = Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('\n');
        styles += rules + '\n';
      } catch (e) {
        console.warn('Could not extract styles from sheet:', sheet.href);
      }
    });

    // 2. Clone the DOM elements we want to preserve
    // We want the Header and the Main content (specifically the results part)
    const headerElement = document.querySelector('header');
    const mainElement = document.querySelector('main');
    
    // We create a clone of the main element to safely manipulate it if needed (though innerHTML is enough)
    // We want to capture the current state of the DOM (WYSIWYG)
    const headerHTML = headerElement?.outerHTML || '';
    const mainHTML = mainElement?.innerHTML || ''; // Use innerHTML to preserve current React render state
    const bodyClass = document.body.className;

    // 3. Construct the HTML Blob
    const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Humanize AI Report - ${new Date().toLocaleDateString()}</title>
    <style>
        ${styles}
        /* Ensure background color is applied */
        body { background-color: #f9fafb; }
    </style>
</head>
<body class="${bodyClass}">
    ${headerHTML}
    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        ${mainHTML}
    </main>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Humanize_AI_Report_${new Date().toISOString().replace(/[:.]/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Input Section */}
        <section className={`transition-all duration-500 ease-in-out ${state === AppState.RESULTS ? 'hidden' : 'block'}`}>
          <div className="text-center mb-10 space-y-3">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">
               Is your text <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">pre-cooked?</span>
             </h2>
             <p className="text-gray-500 max-w-2xl mx-auto">
               Paste your content below. Our engine will detect "AI flavor", diagnose structural rigidity, and infuse it with human warmth.
             </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here (e.g., generated emails, articles, reports)..."
              className="w-full h-64 p-6 text-lg text-gray-700 placeholder-gray-300 border-none outline-none resize-none rounded-xl focus:ring-0 font-serif leading-relaxed"
              spellCheck={false}
            />
            <div className="flex justify-between items-center px-4 pb-2">
              <span className="text-xs text-gray-400 font-medium">
                {text.length} chars
              </span>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || state === AppState.ANALYZING}
                className="flex items-center gap-2 bg-ink hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
              >
                {state === AppState.ANALYZING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    De-Artificialize
                  </>
                )}
              </button>
            </div>
          </div>
          
          {state === AppState.ERROR && (
            <div className="mt-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        {state === AppState.RESULTS && result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-red-500 rounded-md shadow-sm hover:from-orange-500 hover:to-red-600 transition-all hover:shadow-md"
                    title="Download offline HTML report"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button 
                    onClick={handleReset}
                    className="text-sm font-medium text-gray-500 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                  >
                    Analyze New Text
                  </button>
                </div>
             </div>

             <ScoreCard result={result} />
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-10">
                 <RewriteView result={result} />
               </div>
               <div className="lg:col-span-1">
                 <div className="sticky top-8">
                   <DiagnosticTable diagnostics={result.diagnostics} />
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;