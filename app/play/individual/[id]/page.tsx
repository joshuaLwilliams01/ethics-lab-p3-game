'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadLevel } from '@/lib/content';
import type { LevelPack, ChoiceKey } from '@/lib/types';
import ScenarioCard from '@/components/ScenarioCard';
import { scoreDecision } from '@/lib/scoring';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { playButtonClick } from '@/lib/sounds';
import { loadProgress } from '@/lib/save';

type StepResult = {
  scenario_id: string;
  choice: ChoiceKey;
  toolkitOut: any;
  p3Out: any;
  score: ReturnType<typeof scoreDecision>;
};

export default function IndividualLevel({ params }:{ params:{ id:string } }) {
  const levelIndex = Number(params.id || '1');
  const [pack, setPack] = useState<LevelPack | null>(null);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const router = useRouter();

  useEffect(() => { 
    loadLevel(levelIndex).then(setPack).catch(console.error);
    // Try to load saved progress for this level
    const saved = loadProgress();
    if (saved && saved.level === levelIndex) {
      setIdx(saved.idx);
    }
  }, [levelIndex]);

  const scenario = useMemo(() => pack?.scenarios[idx], [pack, idx]);
  const progress = useMemo(() => pack ? `${idx+1} / ${pack.scenarios.length}` : '—', [pack, idx]);

  if (!pack) return <div>Loading level…</div>;
  if (!scenario) return <div>No scenarios found in this level.</div>;

  const onSubmit = (payload: any) => {
    const score = scoreDecision({
      scenario,
      choice: payload.choice,
      toolkitFilled: {
        promptsDone: payload.toolkitOut?.prompts?.filter((p:string)=>p?.trim()).length ?? 0,
        actionsDone: payload.toolkitOut?.actions?.filter(Boolean).length ?? 0,
        totalPrompts: scenario.toolkit_flow.prompts.length,
        totalActions: scenario.toolkit_flow.quick_actions.length,
      },
      p3: {
        people: false,
        planet: false,
        parity: false,
        specifics: 0
      },
      reflectionChars: 200, // no free-text now; give small credit
      priorVector: 0.5
    });

    const step: StepResult = { scenario_id: scenario.scenario_id, ...payload, score };
    const next = [...results]; next[idx] = step; setResults(next);
    
    // Check if this is the last scenario of level 7 (completion)
    if (isLast && levelIndex === 7) {
      // Save completion status
      try {
        const completedLevels = new Set<number>();
        completedLevels.add(7);
        // Store in sessionStorage for completion check
        sessionStorage.setItem('COMPLETED_LEVELS', JSON.stringify(Array.from(completedLevels)));
      } catch (e) {
        console.error('Error saving completion:', e);
      }
    }
  };

  const isLast = idx === pack.scenarios.length - 1;

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Level {pack.level}: {pack.title}</h2>
        <div className="text-sm text-gray-600">Progress: {progress}</div>
      </div>

      <ScenarioCard scenario={scenario} level={levelIndex} index={idx} onSubmit={onSubmit} />

      <div className="flex gap-2 pt-2">
        <button onClick={()=> {
          playButtonClick();
          setIdx(i=>Math.max(0, i-1));
        }} disabled={idx===0} className="btn-ghost px-4 py-2 text-sm font-semibold disabled:opacity-50">Prev</button>
        {!isLast && <button onClick={()=> {
          playButtonClick();
          setIdx(i=>Math.min(pack.scenarios.length-1, i+1));
        }} className="btn-ghost px-4 py-2 text-sm font-semibold">Next</button>}
        {isLast && <Link href={`/results/local-${Date.now()}`} onClick={() => playButtonClick()} className="btn px-6 py-3 text-base font-semibold">See Level Results</Link>}
        <Link href="/" onClick={() => playButtonClick()} className="ml-auto btn-ghost px-4 py-2 text-sm font-semibold">Back Home</Link>
      </div>

      {/* Disclaimer at bottom */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-[#53565A]">
        <p>
          This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
        </p>
      </div>
    </div>
  );
}
