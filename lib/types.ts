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

