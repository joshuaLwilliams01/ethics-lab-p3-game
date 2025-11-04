import React from 'react';
export default function ScorePanel({ breakdown }:{ breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown);
  return (
    <div className="border rounded p-3 space-y-2 bg-white/70">
      <div className="font-semibold">Score</div>
      {entries.map(([k,v]) => (
        <div key={k} className="flex items-center gap-3">
          <div className="w-48 capitalize">{k.replace(/([A-Z])/g,' $1')}</div>
          <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
            <div className="bg-black h-2" style={{ width: `${Math.min(100, (v/30)*100)}%` }} />
          </div>
          <div className="w-12 text-right tabular-nums">{v}</div>
        </div>
      ))}
    </div>
  );
}

