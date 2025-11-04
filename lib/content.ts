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
  const data = (mod as any).default ?? mod;
  const parsed = levelSchema.parse(data);
  return parsed as LevelPack;
}
export async function loadAllLevels():Promise<LevelPack[]>{
  const packs: LevelPack[] = [];
  for (let i=1;i<=6;i++) packs.push(await loadLevel(i));
  return packs;
}

