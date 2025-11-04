import type { Scenario } from "./types";

export function describeResult(opts:{
  scenario: Scenario;
  choice: 'A'|'B'|'C';
  p3:{people:boolean; planet:boolean; parity:boolean};
}): { summary:string; benefits:string[]; harms:string[] }{
  const {scenario, choice} = opts;
  const pick = scenario.choices[choice] || "";
  const benefits:string[] = [];
  const harms:string[] = [];

  // lightweight heuristics for live feedback
  if (pick.toLowerCase().includes("transition") || pick.toLowerCase().includes("audit")) {
    benefits.push("Introduces accountability and a path to improvement");
  }
  if (pick.toLowerCase().includes("shutdown") || pick.toLowerCase().includes("pause")) {
    harms.push("Service disruption risk increases in the short term");
    benefits.push("Halts ongoing harms while protections are built");
  }
  if (pick.toLowerCase().includes("immediate") || pick.toLowerCase().includes("restrict")) {
    benefits.push("Reduces exposure to known risks quickly");
  }

  if (!benefits.length) benefits.push("Maintains continuity for current users");
  if (!harms.length && pick.toLowerCase().includes("keep")) harms.push("Continues existing risks and inequities");

  const summary = `As a result of your decision (${choice}), ${benefits[0]?.toLowerCase() || 'some impacts follow'}.`;

  return { summary, benefits, harms };
}
