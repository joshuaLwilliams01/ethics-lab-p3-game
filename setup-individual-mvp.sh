#!/usr/bin/env bash
set -euo pipefail

note(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok(){  printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn(){printf "\033[1;33m! %s\033[0m\n" "$*"; }

# sanity
[ -f package.json ] || { echo "Run this in your project root (package.json not found)."; exit 1; }
mkdir -p components app/play/individual app/results data/levels lib

note "Installing missing deps (pdf-lib)…"
if ! grep -q '"pdf-lib"' package.json; then
  npm i pdf-lib >/dev/null 2>&1 || yarn add pdf-lib >/dev/null 2>&1 || pnpm add pdf-lib >/dev/null 2>&1 || true
fi
ok "Deps checked"

note "Writing components (ToolkitCard, P3Strip, ScorePanel, ScenarioCard)"
cat > components/ToolkitCard.tsx <<'EOF'
'use client';
import { useMemo, useState } from 'react';
import type { ToolkitFlow } from '@/lib/types';

type Props = {
  flow: ToolkitFlow;
  onComplete: (out: {
    prompts: string[];
    actions: boolean[];
    metrics: string[];
    owner?: string;
    reviewDays: number;
    isComplete: boolean;
  }) => void;
};

export default function ToolkitCard({ flow, onComplete }: Props) {
  const [answers, setAnswers] = useState<string[]>(() => flow.prompts.map(()=>''));
  const [checks, setChecks] = useState<boolean[]>(() => flow.quick_actions.map(() => false));
  const [owner, setOwner] = useState('');
  const [days, setDays] = useState(flow.review_default_days ?? 90);

  const complete = () => {
    const isComplete =
      checks.every(Boolean) &&
      answers.filter(a => a.trim().length >= 2).length === flow.prompts.length &&
      (!flow.owner_required || owner.trim().length > 1);

    onComplete({
      prompts: answers,
      actions: checks,
      metrics: flow.metrics ?? [],
      owner: flow.owner_required ? owner : undefined,
      reviewDays: days,
      isComplete
    });
  };

  useMemo(complete, [answers, checks, owner, days]); // keep parent updated

  return (
    <div className="border rounded p-4 space-y-4 bg-white/70">
      <div className="text-sm text-gray-600">Toolkit order: <strong>{flow.order.join(' → ')}</strong></div>
      {flow.prompts.map((p, i) => (
        <div key={i}>
          <label className="block font-medium mb-1">{p}</label>
          <textarea
            className="w-full border rounded p-2 min-h-[84px]"
            value={answers[i]}
            onChange={e => { const next = answers.slice(); next[i] = e.target.value; setAnswers(next); }}
            aria-label={`Toolkit prompt ${i + 1}`}
          />
        </div>
      ))}
      <div>
        <div className="font-medium mb-2">Quick actions</div>
        {flow.quick_actions.map((a, i) => (
          <label key={i} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={e => { const next = checks.slice(); next[i] = e.target.checked; setChecks(next); }}
              aria-label={`Quick action ${i + 1}`}
            />
            <span>{a}</span>
          </label>
        ))}
      </div>
      {flow.owner_required && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Decision owner</label>
            <input className="w-full border rounded p-2" value={owner} onChange={e => setOwner(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Review (days)</label>
            <input type="number" className="w-full border rounded p-2" value={days} min={1}
              onChange={e => setDays(parseInt(e.target.value || '0', 10))} />
          </div>
        </div>
      )}
    </div>
  );
}
EOF

cat > components/P3Strip.tsx <<'EOF'
'use client';
import { useEffect, useState } from 'react';
export type P3State = { people: boolean; planet: boolean; parity: boolean; specifics: number; };
export default function P3Strip({ onUpdate }:{ onUpdate:(v:P3State)=>void }) {
  const [state, setState] = useState<P3State>({ people:false, planet:false, parity:false, specifics:0 });
  useEffect(()=>onUpdate(state), [state, onUpdate]);
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-2"><input type="checkbox" checked={state.people} onChange={e=>setState(s=>({...s, people:e.target.checked}))}/>People</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={state.planet} onChange={e=>setState(s=>({...s, planet:e.target.checked}))}/>Planet</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={state.parity} onChange={e=>setState(s=>({...s, parity:e.target.checked}))}/>Parity</label>
      <label className="flex items-center gap-2">Specifics (0–3)
        <input type="number" min={0} max={3} value={state.specifics}
          onChange={e=>setState(s=>({...s, specifics: Math.max(0, Math.min(3, Number(e.target.value)||0))}))}
          className="w-16 border rounded p-1"/>
      </label>
    </div>
  );
}
EOF

cat > components/ScorePanel.tsx <<'EOF'
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
EOF

cat > components/ScenarioCard.tsx <<'EOF'
'use client';
import { useMemo, useState } from 'react';
import type { Scenario, ChoiceKey } from '@/lib/types';
import ToolkitCard from './ToolkitCard';
import P3Strip, { P3State } from './P3Strip';

export default function ScenarioCard({
  scenario,
  onSubmit
}:{
  scenario: Scenario;
  onSubmit: (payload: {
    choice: ChoiceKey;
    toolkitOut: any;
    p3Out: P3State;
    reflection: string;
  }) => void
}) {
  const [choice, setChoice] = useState<ChoiceKey | null>(null);
  const [toolkit, setToolkit] = useState<any>({ isComplete:false });
  const [p3, setP3] = useState<P3State>({ people:false, planet:false, parity:false, specifics:0 });
  const [reflection, setReflection] = useState('');

  const canSubmit = useMemo(() => {
    return Boolean(choice) && toolkit?.isComplete && reflection.trim().length >= 180;
  }, [choice, toolkit, reflection]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold">{scenario.title}</h3>
        <p className="text-gray-700 mt-1">{scenario.prompt}</p>
      </div>

      <fieldset className="space-y-2">
        {(['A','B','C'] as ChoiceKey[]).map(key => (
          <label key={key} className="flex items-center gap-2">
            <input type="radio" name={`choice-${scenario.scenario_id}`} checked={choice===key} onChange={()=>setChoice(key)} />
            <span><strong>{key}:</strong> {scenario.choices[key]}</span>
          </label>
        ))}
      </fieldset>

      <div className="text-sm text-gray-600">
        <div><strong>Toolkit cues:</strong> {scenario.toolkit_cues}</div>
        <div><strong>P3 cues:</strong> {scenario.p3_cues}</div>
      </div>

      <ToolkitCard flow={scenario.toolkit_flow} onComplete={setToolkit} />
      <P3Strip onUpdate={setP3} />

      <div>
        <label className="block font-medium mb-1">Reflection (min ~180 chars)</label>
        <textarea className="w-full border rounded p-2 min-h-[120px]" value={reflection} onChange={e=>setReflection(e.target.value)} />
        <div className="text-xs text-gray-500 mt-1">{reflection.trim().length} / 180</div>
      </div>

      <button
        disabled={!canSubmit}
        onClick={()=> onSubmit({ choice: choice!, toolkitOut: toolkit, p3Out: p3, reflection })}
        className={`px-4 py-2 rounded ${canSubmit ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
        aria-disabled={!canSubmit}
      >
        Submit decision
      </button>
    </div>
  );
}
EOF
ok "Components written"

note "Writing scoring engine"
cat > lib/scoring.ts <<'EOF'
import type { Scenario, ChoiceKey } from './types';

export type ScoreBreakdown = {
  decisionQuality: number;
  toolkitCompleteness: number;
  p3Coverage: number;
  reflectionDepth: number;
  consistency: number;
  total: number;
};

export function scoreDecision(input: {
  scenario: Scenario;
  choice: ChoiceKey;
  toolkitFilled: { promptsDone: number; actionsDone: number; totalPrompts: number; totalActions: number; };
  p3: { people: boolean; planet: boolean; parity: boolean; specifics: number; };
  reflectionChars: number;
  priorVector: number; // 0..1
}): ScoreBreakdown {
  const decisionQuality = 10 + Math.round(10 * input.priorVector);
  const toolkitRatio = (
    (input.toolkitFilled.promptsDone / Math.max(1,input.toolkitFilled.totalPrompts)) * 0.6 +
    (input.toolkitFilled.actionsDone / Math.max(1,input.toolkitFilled.totalActions)) * 0.4
  );
  const toolkitCompleteness = Math.round(30 * Math.min(1, Math.max(0, toolkitRatio)));
  const p3Base = (input.p3.people?1:0)+(input.p3.planet?1:0)+(input.p3.parity?1:0);
  const p3Coverage = Math.min(30, (p3Base*7) + (input.p3.specifics*3));
  const reflectionDepth = Math.min(10, Math.floor((input.reflectionChars||0)/180));
  const consistency = Math.round(10 * input.priorVector);
  const total = decisionQuality + toolkitCompleteness + p3Coverage + reflectionDepth + consistency;
  return { decisionQuality, toolkitCompleteness, p3Coverage, reflectionDepth, consistency, total };
}
EOF
ok "Scoring written"

note "Wiring Individual runner page"
cat > app/play/individual/[id]/page.tsx <<'EOF'
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
EOF
ok "Individual runner ready"

note "Writing Results page with certificate"
cat > app/results/[runId]/page.tsx <<'EOF'
'use client';
import { useEffect, useMemo, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Link from 'next/link';

export default function Results({ params }:{ params:{ runId:string } }) {
  const [run, setRun] = useState<any>(null);
  useEffect(() => { const raw = sessionStorage.getItem('LATEST_RUN'); if (raw) setRun(JSON.parse(raw)); }, []);
  const totals = useMemo(() => {
    if (!run?.steps?.length) return { total:0, count:0 };
    const total = run.steps.reduce((acc:number, s:any)=> acc + (s.score?.total||0), 0);
    return { total, count: run.steps.length, avg: Math.round(total/run.steps.length) };
  }, [run]);

  const generateCertificate = async () => {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 396]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    page.drawText('Ethics+Tech Simulator — Certificate of Completion', { x: 40, y: 320, size: 16, font: bold, color: rgb(0.2,0.2,0.2) });
    page.drawText(`Awarded to: ${'Player'}`, { x: 40, y: 270, size: 14, font: bold });
    page.drawText(`Completed: ${new Date().toLocaleDateString()}`, { x: 40, y: 245, size: 12, font });
    page.drawText(`Average Score: ${totals.avg ?? 0}`, { x: 40, y: 225, size: 12, font });
    page.drawText('People · Planet · Parity', { x: 40, y: 200, size: 12, font: bold, color: rgb(0.55,0,0) });
    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'certificate.pdf'; a.click();
  };

  if (!run) return <div>No local run found.</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Results</h2>
      <div className="border rounded p-3 bg-white/70">
        <div>Total steps: {totals.count}</div>
        <div>Average score: <strong>{totals.avg ?? 0}</strong></div>
      </div>
      <div className="space-y-3">
        {run.steps.map((s:any, i:number)=>(
          <div key={i} className="border rounded p-3">
            <div className="font-medium">{s.scenario_id}</div>
            <div className="text-sm text-gray-600">Choice: {s.choice}</div>
            <div className="text-sm">Total: {s.score.total}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={generateCertificate} className="px-4 py-2 rounded bg-black text-white">Generate Certificate</button>
        <Link href="/play" className="px-4 py-2 rounded border">Back to Modes</Link>
      </div>
    </div>
  );
}
EOF
ok "Results page written"

note "Seeding a playable Level 1 scenario (Hidden Server)"
cat > data/levels/level1.json <<'EOF'
{
  "level": 1,
  "title": "Moral Foundations & Complicity",
  "scenarios": [
    {
      "scenario_id": "L1-S1",
      "title": "The Hidden Server",
      "prompt": "City AI runs on a shadow data center tied to labor abuse. Shutting it down risks hospital and transit outages.",
      "choices": {
        "A": "Keep running; 6-month transition with public oversight.",
        "B": "Immediate shutdown; emergency notice; mutual-aid compute.",
        "C": "Keep running with penalties; divert savings to remediation + audits."
      },
      "toolkit_cues": "Non-negotiable duties; acceptable interim harm.",
      "p3_cues": "People (coercion), Planet (energy mix), Parity (who suffers outages).",
      "toolkit_flow": {
        "order": ["T2","T1","T3","T4","T5"],
        "prompts": [
          "T2 Clarify Values: Which duties are inviolable here and why?",
          "T1 Map Impacts: Who is harmed by shutdown vs. continuation? Sketch outage map.",
          "T3 Anticipate Risks: Rate health, safety, legal, reputational risks (L/M/H).",
          "T4 Alternatives: Pick A/B/C and add two safeguards for the chosen path.",
          "T5 Accountability: Who owns this decision? What will you review in 90 days?"
        ],
        "quick_actions": [
          "Publish a 6-month transition plan",
          "Define hospital/transit continuity plan",
          "Trigger supplier labor audit"
        ],
        "metrics": ["Continuity incidents", "Audit completion %"],
        "owner_required": true,
        "review_default_days": 90
      }
    }
  ]
}
EOF
ok "Level 1 sample ready"

# ensure imports exist
note "Ensuring lib/content.ts has loaders and zod schema"
mkdir -p lib
cat > lib/content.ts <<'EOF'
import { z } from "zod";
import type { LevelPack } from "./types";

const scenarioSchema = z.object({
  scenario_id: z.string(),
  title: z.string(),
  prompt: z.string(),
  choices: z.object({ A:z.string(), B:z.string(), C:z.string() }),
  toolkit_cues: z.string().optional(),
  p3_cues: z.string().optional(),
  toolkit_flow: z.object({
    order: z.array(z.enum(['T1','T2','T3','T4','T5'])),
    prompts: z.array(z.string()),
    quick_actions: z.array(z.string()),
    metrics: z.array(z.string()).optional(),
    owner_required: z.boolean().optional(),
    review_default_days: z.number().optional()
  }),
  tags: z.array(z.string()).optional()
});

const levelSchema = z.object({
  level: z.number(),
  title: z.string(),
  scenarios: z.array(scenarioSchema)
});

export async function loadLevel(n:number):Promise<LevelPack>{
  const mod = await import(`../data/levels/level${n}.json`);
  const parsed = levelSchema.parse(mod);
  return parsed as LevelPack;
}
export async function loadAllLevels():Promise<LevelPack[]>{
  const packs: LevelPack[] = [];
  for (let i=1;i<=6;i++) packs.push(await loadLevel(i));
  return packs;
}
EOF
ok "Content loader ensured"

note "Ensuring lib/types.ts exists"
cat > lib/types.ts <<'EOF'
export type ChoiceKey = 'A'|'B'|'C';
export type ToolkitFlow = {
  order: ('T1'|'T2'|'T3'|'T4'|'T5')[];
  prompts: string[];
  quick_actions: string[];
  metrics?: string[];
  owner_required?: boolean;
  review_default_days?: number;
};
export type Scenario = {
  scenario_id: string;
  title: string;
  prompt: string;
  choices: Record<ChoiceKey,string>;
  toolkit_cues?: string;
  p3_cues?: string;
  toolkit_flow: ToolkitFlow;
  tags?: string[];
};
export type LevelPack = { level:number; title:string; scenarios:Scenario[]; };
EOF
ok "Types ensured"

note "Git commit"
git add -A
git commit -m "feat: Individual mode MVP (components, runner, scoring, results, sample Level 1)" >/dev/null || warn "Nothing to commit"

ok "All set! Next steps:"
echo "1) npm run dev"
echo "2) Open http://localhost:3000/play/individual/1"
echo "3) Play the sample scenario, submit, view score, generate certificate"
echo "4) Add the rest of your Level 1–6 scenarios into /data/levels/*.json"

