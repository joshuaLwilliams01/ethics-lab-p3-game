'use client';
import { useMemo, useState, useEffect } from 'react';
import type { Scenario, ChoiceKey } from '@/lib/types';
import ToolkitCard from './ToolkitCard';
import { describeResult } from '@/lib/results';
import Link from 'next/link';
import { saveProgress } from '@/lib/save';

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
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{scenario.title}</h3>
          <p className="text-gray-700 mt-1">{scenario.prompt}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={doSave} className="btn-ghost px-4 py-2 text-sm font-semibold">Save Your Progress</button>
          <Link href="/" className="btn-ghost px-4 py-2 text-sm font-semibold">Back Home</Link>
        </div>
      </div>

      <fieldset className="card space-y-2">
        <div className="font-medium">Choose From Below:</div>
        {(['A','B','C'] as ChoiceKey[]).map(key => (
          <label key={key} className="flex items-center gap-2">
            <input type="radio" name={`choice-${scenario.scenario_id}`} checked={choice===key} onChange={()=>setChoice(key)} />
            <span><strong>{key}:</strong> {scenario.choices[key]}</span>
          </label>
        ))}
      </fieldset>

      <div className="text-sm text-gray-700 card">
        <div>
          <strong>Stanford Ethics Toolkit Cue(s):</strong> {scenario.toolkit_cues}
          {scenario.toolkit_flow.order.length > 0 && (
            <span className="ml-2 text-xs text-gray-600">
              ({scenario.toolkit_flow.order.map(t => {
                const names: Record<string, string> = {
                  'T1': 'Impacts Explorer',
                  'T2': 'Values Clarifier',
                  'T3': 'Risks Anticipator',
                  'T4': 'Alternatives Generator',
                  'T5': 'Accountability Builder'
                };
                return names[t] || t;
              }).join(', ')})
            </span>
          )}
        </div>
        {scenario.toolkit_flow.order.length > 0 && (
          <div className="mt-2">
            <strong>Stanford Ethics Toolkit Reference(s):</strong>
            <div className="mt-1 flex flex-wrap gap-2">
              {scenario.toolkit_flow.order.map(t => {
                const names: Record<string, string> = {
                  'T1': 'Impacts Explorer',
                  'T2': 'Values Clarifier',
                  'T3': 'Risks Anticipator',
                  'T4': 'Alternatives Generator',
                  'T5': 'Accountability Builder'
                };
                const toolName = names[t] || t;
                return (
                  <a
                    key={t}
                    href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8C1515] hover:text-[#820f0f] underline text-xs"
                  >
                    {toolName}
                  </a>
                );
              })}
              <span className="text-gray-500">|</span>
              <a
                href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline text-xs font-medium"
              >
                Ethics Toolkit Website
              </a>
            </div>
          </div>
        )}
        <div className="mt-2"><strong>People + Planet + Parity Cues:</strong> {scenario.p3_cues}</div>
      </div>

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

      {resultBlock && (
        <div className="card">
          <div className="font-semibold mb-1">Result(s) of your decision</div>
          <p className="mb-2">{resultBlock.summary}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="kicker mb-1">Benefits</div>
              <ul className="list-disc ml-5">{resultBlock.benefits.map((b,i)=><li key={i}>{b}</li>)}</ul>
            </div>
            <div>
              <div className="kicker mb-1">Harms</div>
              <ul className="list-disc ml-5">{resultBlock.harms.map((h,i)=><li key={i}>{h}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
