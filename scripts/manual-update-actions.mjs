import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual mapping of choice-specific actions for each scenario
const choiceActions = {
  "L1-S1": {
    A: ["Publish a 6-month transition plan", "Define hospital/transit continuity plan", "Trigger supplier labor audit"],
    B: ["Issue emergency public notice", "Seek mutual aid compute resources", "Establish emergency continuity protocols"],
    C: ["Divert savings to remediation fund", "Establish remediation fund oversight", "Trigger supplier labor audit"]
  },
  "L1-S2": {
    A: ["Audit current vendor labor practices", "Create transition timeline with milestones", "Establish worker compensation standards"],
    B: ["Verify fair labor practices before reactivation", "Establish labor verification process", "Create service restoration plan"],
    C: ["Audit current vendor labor practices", "Establish emergency payment options for citizens", "Create public audit process for transparency"]
  },
  "L1-S3": {
    A: ["Establish mental health support program", "Implement shift rotation schedules", "Create clear workload limits"],
    B: ["Temporarily disable high-risk features", "Establish safety protocols", "Create feature restoration timeline"],
    C: ["Increase AI filter usage", "Reserve human review for appeals", "Establish appeal process"]
  },
  "L1-S4": {
    A: ["Add relief payments for vulnerable populations", "Conduct vulnerability assessment", "Establish relief payment distribution process"],
    B: ["Adjust system to distribute outages equitably", "Redistribute cost burden", "Create equitable distribution framework"],
    C: ["Pause power-saving feature", "Establish fair rules and public process", "Create public consultation timeline"]
  },
  "L1-S5": {
    A: ["Invest in safer facilities abroad", "Establish safety standards for foreign facilities", "Create compliance monitoring system"],
    B: ["Stop exports immediately", "Develop safe local recycling options", "Establish service delay mitigation plan"],
    C: ["Reduce program size", "Ensure compliance with strict recycling standards", "Establish compliance verification process"]
  },
  "L2-S1": {
    A: ["Establish human-in-the-loop appeals process", "Create appeal review protocol", "Monitor demographic parity"],
    B: ["Pause hiring tool implementation", "Optimize for equalized odds", "Establish retraining timeline"],
    C: ["Restrict use to roles with minimal disparity", "Maintain manual processes for others", "Establish role eligibility criteria"]
  },
  "L2-S2": {
    A: ["Provide clear opt-out options", "Offer thorough explanations", "Create consent documentation"],
    B: ["Implement opt-in model", "Conduct independent bias audits", "Establish audit schedule"],
    C: ["Test system on small loans", "Analyze outcomes by demographic", "Establish pilot review process"]
  },
  "L2-S3": {
    A: ["Incorporate human checks", "Perform additional calibration", "Establish calibration schedule"],
    B: ["Provide alternative assessment methods", "Develop oral presentation options", "Create portfolio assessment framework"],
    C: ["Pause proctoring system", "Fix error gaps", "Establish testing and verification process"]
  },
  "L2-S4": {
    A: ["Include doctor override functionality", "Establish override protocols", "Create override documentation"],
    B: ["Impose penalties for model uncertainty", "Promote caution with limited data", "Establish uncertainty threshold"],
    C: ["Set aside equity slots", "Ensure fair access", "Establish equity slot allocation process"]
  },
  "L2-S5": {
    A: ["Allocate funding for community initiatives", "Enforce transparent public audits", "Create community engagement process"],
    B: ["Implement randomized block trials", "Assess effectiveness", "Gather data on outcomes"],
    C: ["Prioritize investment in community safety programs", "Develop alternatives to traditional policing", "Create program evaluation framework"]
  },
  "L3-S1": {
    A: ["Perform scans on user devices", "Ensure encryption for privacy", "Establish device scanning protocols"],
    B: ["Implement server-side scanning", "Create takedown measures", "Develop educational resources"],
    C: ["Customize scanning protocols by environment", "Allow device scans where appropriate", "Require server scans where needed"]
  },
  "L3-S2": {
    A: ["Implement safety protocols", "Use watermarking for transparency", "Create fast appeal processes"],
    B: ["Refine datasets to exclude harmful material", "Slow release pace", "Conduct red-teaming"],
    C: ["Restrict access to sensitive features", "Allow only verified researchers", "Establish researcher verification process"]
  },
  "L3-S3": {
    A: ["Require human review for bulk uploads", "Establish rate limits", "Create abuse prevention measures"],
    B: ["Prioritize high confidence matches", "Establish strong appeal processes", "Create confidence threshold criteria"],
    C: ["Direct submissions through independent clearinghouse", "Verify reports before processing", "Establish clearinghouse verification process"]
  },
  "L3-S4": {
    A: ["Advocate for stronger regulations", "Prioritize student privacy and security", "Engage with policymakers"],
    B: ["Encourage transparency about monitoring", "Engage in open conversations", "Create parent-student dialogue process"],
    C: ["Propose alternative safety measures", "Enhance conflict resolution programs", "Improve mental health support"]
  },
  "L3-S5": {
    A: ["Implement rapid removal process", "Retain only hashed proof", "Establish hashing verification system"],
    B: ["Conduct gradual removal process", "Ensure consent from survivors", "Utilize evidence escrow"],
    C: ["Establish court-mandated expedited route", "Create standard procedure for other cases", "Develop expedited removal criteria"]
  },
  "L4-S1": {
    A: ["Accept proposal with oversight board", "Negotiate oversight board composition", "Establish board review process"],
    B: ["Create publicly available cloud option", "Develop independent infrastructure", "Establish development timeline"],
    C: ["Structure multi-cloud environment", "Ensure strict data separation", "Define clear audit rights"]
  },
  "L4-S2": {
    A: ["Pay fee to maintain broad reach", "Allocate budget for app store fees", "Monitor reach metrics"],
    B: ["Switch to web-only version", "Develop web version features", "Create feature parity plan"],
    C: ["Join coalition for fee reductions", "Advocate for exemptions", "Build coalition strategy"]
  },
  "L4-S3": {
    A: ["Ensure improvements are transparent", "Make improvements justifiable", "Create transparency reporting"],
    B: ["Prevent exclusive rights to improvements", "Ensure public access to improvements", "Establish public benefit sharing"],
    C: ["Proceed with limited exclusivity", "Define exclusivity limits", "Establish exclusivity review process"]
  },
  "L4-S4": {
    A: ["Set strict conditions", "Include independent advisory committee", "Protect educational integrity"],
    B: ["Reject funding proposal", "Maintain independence", "Avoid conflicts of interest"],
    C: ["Explore alternative funding", "Secure resources without software adoption", "Develop partnership strategy"]
  },
  "L4-S5": {
    A: ["Focus on data collection", "Enhance engagement", "Accept privacy tradeoffs"],
    B: ["Find balanced approach", "Respect privacy", "Gather essential data"],
    C: ["Explore alternative funding", "Don't compromise user experience", "Maintain accessibility"]
  },
  "L5-S1": {
    A: ["Store conversations by default", "Allow users to delete", "Create deletion mechanism"],
    B: ["Offer opt-in for participation", "Protect privacy with fake data", "Use secure learning methods"],
    C: ["Choose no data retention", "Allow personalization on device", "Enhance device privacy"]
  },
  "L5-S2": {
    A: ["Implement opt-in model", "Provide transparent data usage policies", "Create consent documentation"],
    B: ["Provide complete user control", "Allow data sharing preferences", "Create preference management"],
    C: ["Offer tiered discounts", "Ensure robust data protection", "Establish tiered discount structure"]
  },
  "L5-S3": {
    A: ["Engage stakeholders", "Ensure data usage aligns with needs", "Create stakeholder engagement process"],
    B: ["Establish clear objectives", "Measure program success", "Define impact metrics"],
    C: ["Avoid brokered data if not transparent", "Prioritize transparency", "Ensure accountability"]
  },
  "L5-S4": {
    A: ["Collaborate with privacy experts", "Assess potential risks", "Develop privacy-preserving technologies"],
    B: ["Continue implementing chatbot", "Conduct regular audits", "Enhance transparency"],
    C: ["Develop educational campaign", "Inform users about privacy", "Encourage community feedback"]
  },
  "L5-S5": {
    A: ["Offer opt-out option", "Utilize other entry forms", "Create alternative entry methods"],
    B: ["Establish independent oversight committee", "Monitor implementation", "Address ethical concerns"],
    C: ["Involve employees in decision-making", "Conduct surveys or focus groups", "Gauge employee feelings"]
  },
  "L6-S1": {
    A: ["Deploy LLM copilot", "Initiate reskilling program", "Ensure smooth transition"],
    B: ["Implement phased pilot programs", "Include worker councils", "Establish guardrails"],
    C: ["Demand no rollout", "Establish wage-sharing guarantees", "Create job quality guarantees"]
  },
  "L6-S2": {
    A: ["Involve workers in design", "Prioritize worker needs", "Combine algorithmic with manual"],
    B: ["Implement algorithm on trial basis", "Establish trial parameters", "Monitor trial outcomes"],
    C: ["Reject algorithm-based systems", "Prioritize well-being", "Maintain current scheduling"]
  },
  "L6-S3": {
    A: ["Support mandate", "Implement comprehensive training", "Adapt suggestions to agent style"],
    B: ["Limit AI to specific scenarios", "Encourage independent problem-solving", "Define scenario criteria"],
    C: ["Implement without training", "Accept efficiency gains", "Accept frustration risks"]
  },
  "L6-S4": {
    A: ["Maintain tier system", "Publish evaluation criteria", "Expedite appeals process"],
    B: ["Eliminate tiers", "Create randomized pool", "Guarantee equal job opportunities"],
    C: ["Establish union-negotiated tiers", "Guarantee minimum job access", "Create tier structure"]
  },
  "L6-S5": {
    A: ["Offer comprehensive severance packages", "Prioritize re-hiring", "Create re-hiring commitment"],
    B: ["Provide fully funded training", "Equip for higher-demand positions", "Establish training curriculum"],
    C: ["Hybrid approach", "Reduce hours with shared-work", "Provide robust training"]
  }
};

const levelsDir = path.join(__dirname, '../data/levels');

for (let i = 1; i <= 6; i++) {
  const filePath = path.join(levelsDir, `level${i}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;
  
  data.scenarios.forEach(scenario => {
    const scenarioId = scenario.scenario_id;
    if (choiceActions[scenarioId] && scenario.toolkit_flow) {
      scenario.toolkit_flow.quick_actions = choiceActions[scenarioId];
      changed = true;
      console.log(`✓ Updated ${scenarioId}`);
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Saved level${i}.json\n`);
  }
}

console.log('Done! All quick actions are now properly choice-specific.');

