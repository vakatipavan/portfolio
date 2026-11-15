import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function Toast({ message, type = 'success', isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform animate-in fade-in slide-in-from-bottom-2">
      <div className={`px-4 py-2.5 rounded shadow-lg text-xs font-medium flex items-center space-x-2 border ${
        type === 'error'
          ? 'bg-red-900 text-white border-red-800'
          : 'bg-zinc-900 text-white border-zinc-800'
      }`}>
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-300" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-zinc-300" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
