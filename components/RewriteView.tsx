import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface RewriteViewProps {
  result: AnalysisResult;
}

export const RewriteView: React.FC<RewriteViewProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'full' | 'diff'>('full');

  const handleCopy = () => {
    navigator.clipboard.writeText(result.fullRewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Humanized Reconstruction
        </h3>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('full')}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
              activeTab === 'full' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Full Text
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
              activeTab === 'diff' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Detailed Changes
          </button>
        </div>
      </div>

      {activeTab === 'full' ? (
        <div className="bg-paper border border-orange-100 rounded-xl p-8 relative shadow-sm">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-accent hover:bg-orange-50 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <div className="prose prose-lg prose-orange max-w-none font-serif leading-relaxed whitespace-pre-wrap text-gray-800">
            {result.fullRewrittenText}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {result.rewrites.map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
               <div className="flex-1 space-y-2">
                 <div className="text-xs font-bold text-red-500 uppercase tracking-wide">AI Original</div>
                 <p className="text-gray-500 text-sm line-through decoration-red-200">{item.original}</p>
               </div>
               
               <div className="hidden md:flex flex-col items-center justify-center text-gray-300 pt-6">
                 <ArrowRight className="w-5 h-5" />
               </div>

               <div className="flex-1 space-y-2">
                 <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-green-600 uppercase tracking-wide">Humanized</div>
                    <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                        {item.strategy}
                    </span>
                 </div>
                 <p className="text-ink font-serif text-lg">{item.rewritten}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};