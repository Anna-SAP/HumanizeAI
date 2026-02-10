import React from 'react';
import { AnalysisResult } from '../types';
import { Search } from 'lucide-react';

interface DiagnosticTableProps {
  diagnostics: AnalysisResult['diagnostics'];
}

export const DiagnosticTable: React.FC<DiagnosticTableProps> = ({ diagnostics }) => {
  if (!diagnostics || diagnostics.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <h3 className="font-semibold text-gray-700">Diagnostic Report</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3 w-1/3">Detected Fragment</th>
              <th className="px-6 py-3 w-1/4">Violation Type</th>
              <th className="px-6 py-3">Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {diagnostics.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-600 bg-gray-50/30">"{item.original}"</td>
                <td className="px-6 py-4 text-red-600 font-medium">{item.violation}</td>
                <td className="px-6 py-4 text-gray-600 italic">{item.diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};