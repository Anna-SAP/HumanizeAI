import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, Fingerprint } from 'lucide-react';

interface ScoreCardProps {
  result: AnalysisResult;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ result }) => {
  const { score, coreIssue } = result;
  
  // Determine color and icon based on score
  let colorClass = "text-green-600 bg-green-50 border-green-200";
  let Icon = CheckCircle;
  let label = "Human-Like";

  if (score > 40 && score <= 70) {
    colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
    Icon = AlertTriangle;
    label = "Mixed Signals";
  } else if (score > 70) {
    colorClass = "text-red-600 bg-red-50 border-red-200";
    Icon = Fingerprint;
    label = "High AI Probability";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={score > 70 ? "text-red-500" : score > 40 ? "text-yellow-500" : "text-green-500"}
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-ink">{score}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Index</span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">AI Flavor Detection</h3>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border w-fit mt-1 ${colorClass}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full md:w-auto border-l-0 md:border-l border-gray-100 md:pl-6">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Core Diagnosis</p>
        <p className="text-gray-800 text-lg font-serif italic">"{coreIssue}"</p>
      </div>
    </div>
  );
};