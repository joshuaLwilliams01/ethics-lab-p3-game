'use client';
import { useEffect, useState, useMemo } from 'react';
import type { ToolkitFlow, ChoiceKey } from '@/lib/types';

export default function ToolkitCard({ flow, choice, onComplete }:{
  flow: ToolkitFlow;
  choice: ChoiceKey | null;
  onComplete: (out:{prompts:string[]; actions:boolean[]; metrics:string[]; isComplete:boolean;})=>void;
}) {
  // Get actions based on choice (if choice-specific) or use static array
  const actions = useMemo(() => {
    if (Array.isArray(flow.quick_actions)) {
      return flow.quick_actions; // Static actions
    } else if (choice && flow.quick_actions[choice]) {
      return flow.quick_actions[choice]; // Choice-specific actions
    }
    return []; // No actions if no choice selected and actions are choice-specific
  }, [flow.quick_actions, choice]);

  const [answers, setAnswers] = useState<string[]>(() => flow.prompts.map(()=>''));
  const [checks, setChecks] = useState<boolean[]>(() => actions.map(() => false));

  // Reset all state when flow prompts/actions change or when actions array changes
  useEffect(() => {
    setAnswers(flow.prompts.map(() => ''));
    setChecks(actions.map(() => false));
  }, [flow.prompts.length, actions.length, JSON.stringify(flow.prompts), JSON.stringify(actions)]);

  useEffect(() => {
    // Check if prompts are complete
    const noPrompts = flow.prompts.length === 0;
    const promptsComplete = noPrompts || 
      (answers.length === flow.prompts.length && answers.filter(a => a.trim().length >= 2).length === flow.prompts.length);
    
    // Check if actions are complete
    const noActions = actions.length === 0;
    const allActionsChecked = checks.length === actions.length && checks.every(c => c === true);
    const actionsComplete = noActions || allActionsChecked;
    
    const isComplete = promptsComplete && actionsComplete;
    
    // Always call onComplete to update parent state
    onComplete({ prompts:answers, actions:checks, metrics:flow.metrics ?? [], isComplete });
  }, [answers, checks, flow.prompts.length, actions.length, flow.metrics, choice]);

  return (
    <div className="card space-y-4">
      {/* Title changed by parent; prompts only */}
      {flow.prompts.map((p, i) => (
        <div key={i}>
          <label className="block font-medium mb-1">{p}</label>
          <textarea className="w-full border rounded p-2 min-h-[84px]"
            value={answers[i]}
            onChange={e => { const next = answers.slice(); next[i] = e.target.value; setAnswers(next); }}
            aria-label={`Toolkit prompt ${i+1}`} />
        </div>
      ))}
      {actions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Quick actions{choice ? ` (for choice ${choice})` : ''}</div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input 
                type="checkbox"
                checked={checks.length === actions.length && checks.every(c => c === true)}
                onChange={e => {
                  const allChecked = e.target.checked;
                  setChecks(actions.map(() => allChecked));
                }}
                aria-label="Select all quick actions"
                className="cursor-pointer"
              />
              <span className="select-none">Select All</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-2">All quick actions must be selected to proceed.</p>
          {actions.map((a, i) => (
            <label key={i} className="flex items-center gap-2 mb-1">
              <input 
                type="checkbox" 
                checked={checks[i] || false} 
                onChange={e => { 
                  const next = checks.slice(); 
                  next[i] = e.target.checked; 
                  setChecks(next); 
                }} 
                aria-label={`Quick action ${i+1}`} 
              />
              <span>{a}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
