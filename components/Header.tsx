import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-6 border-b border-gray-200 bg-paper">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <BrainCircuit className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-ink">Humanize AI</h1>
            <p className="text-sm text-gray-500 font-sans">Text Architect & De-Artificializer</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Powered by Gemini 3 Pro</span>
        </div>
      </div>
    </header>
  );
};