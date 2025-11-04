import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate choice-specific actions based on choice text
function generateChoiceActions(choiceText, scenarioContext) {
  const actions = [];
  const text = choiceText.toLowerCase();
  
  // Common patterns to extract actions
  if (text.includes('transition') || text.includes('plan')) {
    actions.push('Create transition timeline with milestones');
    actions.push('Define continuity plan');
  }
  if (text.includes('shutdown') || text.includes('pause') || text.includes('stop')) {
    actions.push('Issue emergency public notice');
    actions.push('Establish alternative service provision');
  }
  if (text.includes('audit') || text.includes('review')) {
    actions.push('Trigger independent audit');
    actions.push('Establish review process');
  }
  if (text.includes('opt-out') || text.includes('opt-in') || text.includes('consent')) {
    actions.push('Establish clear consent process');
    actions.push('Document user choices');
  }
  if (text.includes('override') || text.includes('human')) {
    actions.push('Create human review protocol');
    actions.push('Establish override documentation process');
  }
  if (text.includes('equity') || text.includes('fair')) {
    actions.push('Establish equity monitoring system');
    actions.push('Create fairness assessment framework');
  }
  if (text.includes('community') || text.includes('transparent')) {
    actions.push('Engage community stakeholders');
    actions.push('Establish transparent decision-making process');
  }
  if (text.includes('test') || text.includes('pilot')) {
    actions.push('Design controlled pilot program');
    actions.push('Establish success metrics');
  }
  if (text.includes('restrict') || text.includes('limit')) {
    actions.push('Define access restrictions and criteria');
    actions.push('Establish verification process');
  }
  if (text.includes('regulate') || text.includes('regulation')) {
    actions.push('Draft regulatory framework');
    actions.push('Engage with policymakers');
  }
  if (text.includes('alternative') || text.includes('replace')) {
    actions.push('Develop alternative solutions');
    actions.push('Create implementation timeline');
  }
  if (text.includes('safety') || text.includes('protect')) {
    actions.push('Establish safety protocols');
    actions.push('Create monitoring system');
  }
  if (text.includes('appeal') || text.includes('review')) {
    actions.push('Create appeal process');
    actions.push('Establish review timeline');
  }
  
  // Default actions if none matched
  if (actions.length === 0) {
    actions.push('Define implementation plan');
    actions.push('Establish monitoring and review process');
  }
  
  return actions.slice(0, 3); // Limit to 3 actions
}

const levelsDir = path.join(__dirname, '../data/levels');

for (let i = 1; i <= 6; i++) {
  const filePath = path.join(levelsDir, `level${i}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.scenarios.forEach(scenario => {
    if (scenario.toolkit_flow && Array.isArray(scenario.toolkit_flow.quick_actions)) {
      // Convert static array to choice-specific object
      const staticActions = scenario.toolkit_flow.quick_actions;
      
      // Generate actions for each choice
      const choiceActions = {
        A: generateChoiceActions(scenario.choices.A, scenario),
        B: generateChoiceActions(scenario.choices.B, scenario),
        C: generateChoiceActions(scenario.choices.C, scenario)
      };
      
      scenario.toolkit_flow.quick_actions = choiceActions;
      console.log(`Updated ${scenario.scenario_id}: ${staticActions.length} static actions → choice-specific`);
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated level${i}.json`);
}

console.log('\nDone! All quick actions are now choice-specific.');

