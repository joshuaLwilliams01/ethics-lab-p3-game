#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok(){  printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn(){ printf "\033[1;33m! %s\033[0m\n" "$*"; }

[ -f package.json ] || { echo "Run in your project root (package.json not found)."; exit 1; }

# 1) Ensure dirs
mkdir -p scripts data/levels lib

# 2) Add/overwrite validator (pure Node ESM)
say "Writing Zod validator at scripts/validate-content.js"
cat > scripts/validate-content.js <<'EOF'
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
EOF
ok "Validator ready"

# 3) Ensure zod in deps
if ! grep -q '"zod"' package.json; then
  say "Installing zod (dev dependency compatible)"
  npm i zod >/dev/null 2>&1 || yarn add zod >/dev/null 2>&1 || pnpm add zod >/dev/null 2>&1
  ok "zod installed"
fi

# 4) Patch package.json safely via Node
say "Updating package.json (type=module, scripts.validate:content)"
node - <<'EOF'
const fs=require('fs');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
if (!pkg.type) pkg.type = 'module';
pkg.scripts ||= {};
pkg.scripts['validate:content'] = 'node scripts/validate-content.js';
if (!pkg.scripts['typecheck']) pkg.scripts['typecheck'] = 'tsc -p tsconfig.json --noEmit';
fs.writeFileSync('package.json', JSON.stringify(pkg,null,2));
EOF
ok "package.json updated"

# 5) Harden lib/content.ts (default export handling)
say "Patching lib/content.ts (JSON default import + zod schemas)"
if [ ! -f lib/content.ts ]; then
  cat > lib/content.ts <<'CONTENT_EOF'
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
  const out: LevelPack[] = [];
  for (let i=1;i<=6;i++) out.push(await loadLevel(i));
  return out;
}
CONTENT_EOF
else
  # in-place patch: ensure .default ?? mod is present
  if ! grep -q "default ?? mod" lib/content.ts; then
    perl -0777 -pe "s/const parsed = levelSchema\.parse\(mod\);/const data = (mod as any).default ?? mod;\\n  const parsed = levelSchema.parse(data);/s" -i lib/content.ts || true
    # If pattern didn't match (different file), replace a simpler occurrence
    sed -i '' -e 's/levelSchema\.parse(mod)/levelSchema.parse((mod as any).default ?? mod)/' lib/content.ts 2>/dev/null || true
  fi
fi
ok "lib/content.ts ok"

# 6) tsconfig: enable resolveJsonModule
say "Ensuring tsconfig.json allows JSON imports"
if [ -f tsconfig.json ]; then
  node - <<'EOF'
const fs=require('fs');
const ts=JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
ts.compilerOptions ||= {};
ts.compilerOptions.resolveJsonModule = true;
fs.writeFileSync('tsconfig.json', JSON.stringify(ts,null,2));
EOF
  ok "tsconfig.json updated"
else
  cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom","es2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] },
    "resolveJsonModule": true
  },
  "include": ["."]
}
EOF
  ok "tsconfig.json created"
fi

# 7) Normalize EOLs to avoid noisy diffs (optional but helpful)
if [ ! -f .gitattributes ]; then
  say "Adding .gitattributes (normalize line endings)"
  echo "* text=auto" > .gitattributes
  ok ".gitattributes added"
fi

# 8) Quick JSON sanity (optional jq normalize if installed)
if command -v jq >/dev/null 2>&1; then
  say "jq found — normalizing level JSON (no semantic change)"
  for f in data/levels/level{1,2,3,4,5,6}.json; do
    [ -f "$f" ] || continue
    tmp="$(mktemp)"; jq . "$f" > "$tmp" && mv "$tmp" "$f" || { warn "jq failed on $f"; rm -f "$tmp"; }
  done
fi

# 9) Validate now
say "Running validator"
npm run -s validate:content || { warn "Validator reported errors (see above)"; exit 1; }
ok "All level JSON files validate"

# 10) Commit changes (if any)
say "Creating commit"
git add -A
git commit -m "chore: JSON validation bootstrap (validator, ESM, loader fix, tsconfig, gitattributes)" >/dev/null || warn "Nothing to commit"

ok "Bootstrap finished. Next:"
echo " - If you saw 'OK', run: npm run dev  and test /play/individual/1"
echo " - If validator failed, fix the listed file/field and rerun: npm run validate:content"

