'use client';
import { useMemo, useState, useEffect } from 'react';
import type { Scenario, ChoiceKey } from '@/lib/types';
import ToolkitCard from './ToolkitCard';
import { describeResult } from '@/lib/results';
import Link from 'next/link';
import { saveProgress } from '@/lib/save';
import ResultsModal from './ResultsModal';

function CheatCodeButton({ scenario }: { scenario: Scenario }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full text-left flex items-center justify-between px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-300 overflow-hidden group"
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, #8C1515 0%, #C41E3A 100%)' 
            : 'linear-gradient(135deg, rgba(140,21,21,0.1) 0%, rgba(196,30,58,0.1) 100%)',
          border: '2px solid #8C1515',
          color: isOpen ? '#FFFFFF' : '#8C1515',
          animation: 'shake 2s ease-in-out infinite',
          boxShadow: isOpen 
            ? '0 8px 16px rgba(140,21,21,0.4), 0 0 20px rgba(140,21,21,0.3)' 
            : '0 4px 8px rgba(140,21,21,0.2)'
        }}
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🎮</span>
          <div className="flex flex-col">
            <span className="font-bold">Cheat Code</span>
            <span className="text-xs opacity-90 italic">(Psssttt...Click Me)</span>
          </div>
        </span>
        <span className="text-lg relative z-10 transform transition-transform duration-300" style={{ 
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' 
        }}>
          {isOpen ? '▼' : '▶'}
        </span>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      </button>
      {isOpen && (
        <div className="mt-3 text-sm text-gray-700 card border-2 border-[#8C1515] bg-gradient-to-br from-white to-[#F7F6F3] shadow-lg">
          <div>
            <strong className="text-[#8C1515]">Stanford Ethics Toolkit Cue(s):</strong> <span className="text-[#2E2D29]">{scenario.toolkit_cues}</span>
          </div>
          {scenario.toolkit_references && (
            <div className="mt-3 p-3 bg-white/50 rounded border border-[#8C1515]/20">
              <strong className="text-[#8C1515]">Stanford Ethics Toolkit Reference(s):</strong>{' '}
              <a
                href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline text-xs font-medium"
              >
                https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit
              </a>
              <ol className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2E2D29] font-medium list-decimal list-inside">
                {scenario.toolkit_references.split(',').map((ref, idx) => {
                  const trimmedRef = ref.trim();
                  return (
                    <li key={idx} className="leading-relaxed">
                      {trimmedRef}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
          <div className="mt-3 p-3 bg-white/50 rounded border border-[#8C1515]/20">
            <strong className="text-[#8C1515]">People + Planet + Parity Cues:</strong> <span className="text-[#2E2D29]">{scenario.p3_cues}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScenarioCard({
  scenario,
  level,
  index,
  onSubmit
}:{
  scenario: Scenario;
  level: number;
  index: number;
  onSubmit: (payload: {
    choice: ChoiceKey;
    toolkitOut: any;
    p3Out: any;
  }) => void
}) {
  const [choice, setChoice] = useState<ChoiceKey | null>(null);
  const [toolkit, setToolkit] = useState<any>({ isComplete:false });
  const [resultBlock, setResultBlock] = useState<null | {summary:string; benefits:string[]; harms:string[]}>(null);

  // Reset all state when scenario changes (scenario_id changes)
  useEffect(() => {
    setChoice(null);
    setToolkit({ isComplete: false });
    setResultBlock(null);
  }, [scenario.scenario_id]);

  const canSubmit = useMemo(() => {
    if (!choice) return false;
    if (!toolkit || toolkit.isComplete !== true) return false;
    return true;
  }, [choice, toolkit]);

  const doSave = () => {
    saveProgress({ level, idx:index, timestamp:Date.now(), payload:{ choice, toolkit } });
    alert("Progress saved locally.");
  };

  const handleSubmit = () => {
    if (!choice) return;
    const res = describeResult({ scenario, choice, p3: { people: false, planet: false, parity: false } });
    setResultBlock(res);
    onSubmit({ choice, toolkitOut: toolkit, p3Out: { people: false, planet: false, parity: false } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{scenario.title}</h3>
          <p className="text-gray-700 mt-1">{scenario.prompt}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={doSave} className="btn-ghost px-4 py-2 text-sm font-semibold">Save Your Progress</button>
          <Link href="/" className="btn-ghost px-4 py-2 text-sm font-semibold">Back Home</Link>
        </div>
      </div>

      <CheatCodeButton scenario={scenario} />

      <fieldset className="card space-y-2">
        <div className="font-medium">Choose From Below:</div>
        {(['A','B','C'] as ChoiceKey[]).map(key => (
          <label key={key} className="flex items-center gap-2">
            <input type="radio" name={`choice-${scenario.scenario_id}`} checked={choice===key} onChange={()=>setChoice(key)} />
            <span><strong>{key}:</strong> {scenario.choices[key]}</span>
          </label>
        ))}
      </fieldset>

      <ToolkitCard flow={scenario.toolkit_flow} choice={choice} onComplete={setToolkit} />

      <div className="flex flex-wrap gap-2">
        <button 
          disabled={!canSubmit} 
          onClick={handleSubmit}
          className={`btn px-6 py-3 text-base font-semibold ${!canSubmit ? 'opacity-60 cursor-not-allowed' : ''}`} 
          aria-disabled={!canSubmit}
        >
          Submit Decision
        </button>
      </div>

      {/* Results Modal */}
      <ResultsModal 
        isOpen={resultBlock !== null} 
        onClose={() => setResultBlock(null)} 
        results={resultBlock}
      />
    </div>
  );
}
