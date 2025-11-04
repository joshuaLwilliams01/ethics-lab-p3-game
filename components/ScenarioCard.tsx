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

