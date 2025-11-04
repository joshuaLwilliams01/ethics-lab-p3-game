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
