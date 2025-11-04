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
