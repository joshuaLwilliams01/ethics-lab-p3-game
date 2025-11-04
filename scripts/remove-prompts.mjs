import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptsToRemove = [
  "T2 Clarify Values: Which duties are inviolable here and why?",
  "T1 Map Impacts: Who is harmed by shutdown vs. continuation? Sketch outage map.",
  "T3 Anticipate Risks: Rate health, safety, legal, reputational risks (L/M/H).",
  "T4 Alternatives: Pick A/B/C and add two safeguards for the chosen path.",
  "T5 Accountability: Who owns this decision? What will you review in 90 days?"
];

const levelsDir = path.join(__dirname, '../data/levels');

for (let i = 1; i <= 6; i++) {
  const filePath = path.join(levelsDir, `level${i}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let updated = false;
  data.scenarios.forEach(scenario => {
    if (scenario.toolkit_flow && scenario.toolkit_flow.prompts) {
      const originalPrompts = [...scenario.toolkit_flow.prompts];
      const originalOrder = [...scenario.toolkit_flow.order];
      
      // Filter out prompts to remove
      scenario.toolkit_flow.prompts = originalPrompts.filter(p => !promptsToRemove.includes(p));
      
      // Update order array to match remaining prompts
      if (scenario.toolkit_flow.prompts.length < originalPrompts.length) {
        // Get tool IDs from remaining prompts
        const remainingToolIds = scenario.toolkit_flow.prompts.map(p => {
          const match = p.match(/^(T[1-5])\s/);
          return match ? match[1] : null;
        }).filter(Boolean);
        
        // Keep only order IDs that have corresponding prompts
        scenario.toolkit_flow.order = originalOrder.filter(id => remainingToolIds.includes(id));
        updated = true;
      }
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Updated level${i}.json`);
  } else {
    console.log(`- No changes needed for level${i}.json`);
  }
}

console.log('\nDone!');

