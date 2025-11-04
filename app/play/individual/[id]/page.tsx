'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadLevel } from '@/lib/content';
import type { LevelPack, ChoiceKey } from '@/lib/types';
import ScenarioCard from '@/components/ScenarioCard';
import ScorePanel from '@/components/ScorePanel';
import { scoreDecision } from '@/lib/scoring';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type StepResult = {
  scenario_id: string;
  choice: ChoiceKey;
  toolkitOut: any;
  p3Out: any;
  reflection: string;
  score: ReturnType<typeof scoreDecision>;
};

export default function IndividualLevel({ params }:{ params:{ id:string } }) {
  const levelIndex = Number(params.id || '1');
  const [pack, setPack] = useState<LevelPack | null>(null);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const router = useRouter();

  useEffect(() => { loadLevel(levelIndex).then(setPack).catch(console.error); }, [levelIndex]);

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
        people: payload.p3Out?.people,
        planet: payload.p3Out?.planet,
        parity: payload.p3Out?.parity,
        specifics: payload.p3Out?.specifics ?? 0
      },
      reflectionChars: payload.reflection?.trim().length ?? 0,
      priorVector: 0.5
    });

    const step: StepResult = { scenario_id: scenario.scenario_id, ...payload, score };
    const next = [...results]; next[idx] = step; setResults(next);

    const last = idx === pack.scenarios.length - 1;
    if (last) {
      sessionStorage.setItem('LATEST_RUN', JSON.stringify({ level: levelIndex, steps: next }));
      router.push(`/results/local-${Date.now()}`);
    } else {
      setIdx(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Level {pack.level}: {pack.title}</h2>
        <div className="text-sm text-gray-600">Progress: {progress}</div>
      </div>

      <ScenarioCard scenario={scenario} onSubmit={onSubmit} />

      {results[idx]?.score && (
        <div>
          <h4 className="mt-6 mb-2 font-semibold">Your score for this scenario</h4>
          <ScorePanel breakdown={{ ...results[idx].score, total: results[idx].score.total }} />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button onClick={()=> setIdx(i=>Math.max(0, i-1))} disabled={idx===0} className="px-3 py-2 rounded border disabled:opacity-50">Prev</button>
        <button onClick={()=> setIdx(i=>Math.min(pack.scenarios.length-1, i+1))} disabled={idx===pack.scenarios.length-1} className="px-3 py-2 rounded border disabled:opacity-50">Next</button>
        <Link href="/play" className="ml-auto px-3 py-2 rounded border">Back to Modes</Link>
      </div>
    </div>
  );
}
