export type ScoreBreakdown = {
  decisionQuality:number; toolkitCompleteness:number; p3Coverage:number; reflectionDepth:number; consistency:number; total:number;
};
export function scoreDecision():ScoreBreakdown{
  // placeholder formula (replace with full engine)
  const s = {decisionQuality:12, toolkitCompleteness:20, p3Coverage:18, reflectionDepth:6, consistency:7};
  return {...s, total: s.decisionQuality+s.toolkitCompleteness+s.p3Coverage+s.reflectionDepth+s.consistency};
}

