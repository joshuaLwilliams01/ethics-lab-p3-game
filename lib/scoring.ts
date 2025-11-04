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
