// Run: npm run validate:content
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEVEL_DIR = path.resolve(__dirname, "../data/levels");

const scenarioSchema = z.object({
  scenario_id: z.string(),
  title: z.string(),
  prompt: z.string(),
  choices: z.object({ A: z.string(), B: z.string(), C: z.string() }),
  toolkit_cues: z.string().optional(),
  p3_cues: z.string().optional(),
  toolkit_flow: z.object({
    order: z.array(z.enum(["T1","T2","T3","T4","T5"])),
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

function readJSON(p) {
  const raw = fs.readFileSync(p, "utf8");
  try { return JSON.parse(raw); }
  catch (e) { throw new Error(`JSON parse failed for ${p}\n${e.message}`); }
}

(function validateAll(){
  if (!fs.existsSync(LEVEL_DIR)) {
    console.error("Missing /data/levels folder."); process.exit(1);
  }
  const files = fs.readdirSync(LEVEL_DIR).filter(f => /^level[1-6]\.json$/.test(f));
  if (files.length === 0) { console.error("No level files found (expected level1.json … level6.json)."); process.exit(1); }

  let total = 0; const errors = [];
  for (const f of files) {
    const full = path.join(LEVEL_DIR, f);
    let json;
    try { json = readJSON(full); }
    catch (e) { errors.push(String(e)); continue; }

    try {
      const parsed = levelSchema.parse(json);
      total += parsed.scenarios.length;
    } catch (err) {
      const issues = err.issues?.map(i => `- ${i.path.join(".")}: ${i.message}`).join("\n") || err.message;
      errors.push(`File ${f} failed schema validation:\n${issues}`);
    }
  }
  if (errors.length) {
    console.error("\nValidation failed:\n");
    console.error(errors.join("\n\n"));
    process.exit(1);
  }
  console.log(`OK: ${files.length} level files validated. Total scenarios: ${total}.`);
})();
