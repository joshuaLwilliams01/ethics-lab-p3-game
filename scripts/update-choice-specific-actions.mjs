import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levelsDir = path.resolve(__dirname, '../data/levels');

// Map of all scenario IDs to their choice-specific actions
const choiceSpecificActions = {
  'L1-S1': {
    A: [
      "Publish 6-month milestone plan",
      "Define hospital/transit continuity runbooks",
      "Launch independent labor audit"
    ],
    B: [
      "Issue emergency public notice",
      "Activate mutual-aid compute migration",
      "Stand up 24/7 incident bridge"
    ],
    C: [
      "Create escrowed worker fund w/ oversight",
      "Publish payout criteria + verification",
      "Schedule surprise supply-chain audits"
    ]
  },
  'L1-S2': {
    A: [
      "Post cutover timeline + acceptance tests",
      "Add fair-pay clauses to contracts",
      "Set interim wage top-ups"
    ],
    B: [
      "Notify users + critical-use alternatives",
      "Commission rapid labor audit",
      "Define remediation + re-entry criteria"
    ],
    C: [
      "Disburse emergency payments via vetted NGO",
      "Publish audit scope + cadence",
      "Open protected worker feedback channel"
    ]
  },
  'L1-S3': {
    A: [
      "Contract trauma-informed counseling",
      "Implement exposure caps + rotations",
      "Upgrade triage/blur tooling"
    ],
    B: [
      "Publish freeze list + re-enable criteria",
      "Reallocate staff to appeals/backlog",
      "Monitor abuse displacement"
    ],
    C: [
      "Calibrate on diverse data",
      "Set precision/recall targets + drift checks",
      "Launch fast human appeals SLAs"
    ]
  },
  'L1-S4': {
    A: [
      "Auto-credit medically vulnerable homes",
      "Deploy outage early-warning checks",
      "Publish relief eligibility + cadence"
    ],
    B: [
      "Define rotation rules + exclusions",
      "Publish district impact forecasts",
      "Install independent compliance auditor"
    ],
    C: [
      "Suspend algorithm; revert baseline ops",
      "Hold public workshops + feedback",
      "Release draft rules + pilot results"
    ]
  },
  'L1-S5': {
    A: [
      "Sign safety MOUs w/ facilities",
      "Fund PPE + ventilation upgrades",
      "Enable third-party inspections"
    ],
    B: [
      "Secure compliant interim storage",
      "Approve local facility siting plan",
      "Launch recycling workforce training"
    ],
    C: [
      "Vet to recognized safety standards",
      "Cap volumes to safe capacity",
      "Publish vendor list + audits"
    ]
  },
  'L2-S1': {
    A: [
      "Publish appeal flow + deadlines",
      "Monitor adverse impact by role",
      "Blind sensitive attributes where feasible"
    ],
    B: [
      "Freeze automated screening in flagged roles",
      "Retrain w/ fairness constraints + evals",
      "Publish tradeoff memo (precision/recall)"
    ],
    C: [
      "Post role matrix (auto vs. manual)",
      "Train standardized manual rubrics",
      "Review matrix every 60 days"
    ]
  },
  'L2-S2': {
    A: [
      "Provide notices + scoring factors",
      "Offer non-location path for thin-file",
      "Add independent dispute hotline"
    ],
    B: [
      "Require explicit consent summaries",
      "Commission + publish bias audit",
      "Set retention + re-use limits"
    ],
    C: [
      "Define pilot size + success thresholds",
      "Cap APR/fees to prevent harm",
      "Publish pilot results + decision"
    ]
  },
  'L2-S3': {
    A: [
      "Calibrate for tone/lighting/access",
      "Human review before penalties",
      "Rapid appeal channel for students"
    ],
    B: [
      "Stand up oral/portfolio options",
      "Train graders for consistency",
      "Disclose equivalency to students"
    ],
    C: [
      "Suspend tool; use interim methods",
      "Contract vendor for targeted fixes",
      "Pilot w/ diverse cohorts + publish results"
    ]
  },
  'L2-S4': {
    A: [
      "Log override reasons/outcomes",
      "Flag uncertainty for thin histories",
      "Weekly case review of overrides"
    ],
    B: [
      "Boost risk for sparse histories",
      "Validate effect on waits/outcomes",
      "Tune thresholds weekly"
    ],
    C: [
      "Define eligibility + verification",
      "Reserve fixed capacity per shift",
      "Publish equity access metrics"
    ]
  },
  'L2-S5': {
    A: [
      "Reallocate budget to prevention",
      "Publish deployment/stops data",
      "Hold monthly community oversight"
    ],
    B: [
      "Pre-register design + outcomes",
      "Brief communities pre/post trial",
      "Publish full results + data"
    ],
    C: [
      "Fund crisis/mediation/Env. design",
      "Coordinate 911/311 triage routes",
      "Track response + resolution times"
    ]
  },
  'L3-S1': {
    A: [
      "Ship encrypted on-device checks",
      "Provide clear false-positive appeals",
      "Monitor device performance impact"
    ],
    B: [
      "Centralize scanning quality controls",
      "Launch survivor resource hub",
      "Audit access + retention paths"
    ],
    C: [
      "Define when device vs. server applies",
      "Publish user-readable policy visuals",
      "Run periodic gap analysis"
    ]
  },
  'L3-S2': {
    A: [
      "Enforce safety policy + rate limits",
      "Embed robust watermarking",
      "Staff rapid appeals workflow"
    ],
    B: [
      "Clean datasets against risky content",
      "Conduct external red-team exercises",
      "Gate new features behind safety checks"
    ],
    C: [
      "Vet researcher access criteria",
      "Log + review sensitive usage",
      "Publish periodic safety findings"
    ]
  },
  'L3-S3': {
    A: [
      "Implement rate-limited intake API",
      "Require human triage on batches",
      "Track reviewer load + trauma supports"
    ],
    B: [
      "Set confidence threshold for action",
      "Provide creator/user appeal SLAs",
      "Audit false-positive/negative rates"
    ],
    C: [
      "Route reports via third-party vetting",
      "Define shared evidence standards",
      "Publish throughput + accuracy stats"
    ]
  },
  'L3-S4': {
    A: [
      "Adopt district-wide guardrails",
      "Post parent/student rights notice",
      "Schedule annual compliance audits"
    ],
    B: [
      "Hold parent/student info sessions",
      "Offer opt-outs + alternatives",
      "Publish data use + retention policies"
    ],
    C: [
      "Expand counseling/mediation staff",
      "Implement threat reporting training",
      "Track incidents + response timelines"
    ]
  },
  'L3-S5': {
    A: [
      "Automate removal within SLA",
      "Store cryptographic hashes only",
      "Provide survivor status updates"
    ],
    B: [
      "Obtain survivor consent preferences",
      "Use evidence escrow chain-of-custody",
      "Time-box review to hard deadlines"
    ],
    C: [
      "Define expedited legal intake",
      "Standardize judge order templates",
      "Monitor equity of access to pathway"
    ]
  },
  'L4-S1': {
    A: [
      "Negotiate audit + exit clauses",
      "Seat independent oversight members",
      "Publish data residency/segregation plan"
    ],
    B: [
      "Fund phased architecture roadmap",
      "Define reliability SLOs + incident playbooks",
      "Open source templates for peers"
    ],
    C: [
      "Implement policy-as-code separation",
      "Enable cross-cloud audit logging",
      "Run failover drills quarterly"
    ]
  },
  'L4-S2': {
    A: [
      "Budget for fees w/ transparency",
      "Track store policy impacts on features",
      "Explore fee waivers/exemptions"
    ],
    B: [
      "Build high-quality PWA experience",
      "Replace push with email/SMS alerts",
      "Launch user migration guide"
    ],
    C: [
      "Join multi-org advocacy group",
      "Publish economic impact analysis",
      "Propose exemption criteria publicly"
    ]
  },
  'L4-S3': {
    A: [
      "Publish data-use agreement",
      "Require model audit access",
      "Report public benefits achieved"
    ],
    B: [
      "Add reciprocity clauses to contracts",
      "Mandate model artifact sharing windows",
      "Enforce via measurable milestones"
    ],
    C: [
      "Time-limit exclusivity periods",
      "Define public release obligations",
      "Add independent performance audits"
    ]
  },
  'L4-S4': {
    A: [
      "Create independent advisory board",
      "Publish curriculum firewall policy",
      "Set renewal based on audit outcomes"
    ],
    B: [
      "Announce rationale + values",
      "Identify replacement funding targets",
      "Prioritize essential programs list"
    ],
    C: [
      "Diversify small grants portfolio",
      "Standardize conflict-of-interest checks",
      "Coordinate reporting across funders"
    ]
  },
  'L4-S5': {
    A: [
      "Implement consent + preference center",
      "Map data flows + retention limits",
      "Prepare breach/regulatory response plan"
    ],
    B: [
      "Minimize data by default",
      "Run privacy impact assessments",
      "Publish transparency dashboards"
    ],
    C: [
      "Pilot subscriptions/grants/sponsorship",
      "Separate revenue from data collection",
      "Share annual funding + privacy report"
    ]
  },
  'L5-S1': {
    A: [
      "Provide deletion tools + reminders",
      "Limit internal access + logging",
      "Run red-team privacy tests"
    ],
    B: [
      "Require explicit opt-in choices",
      "Apply DP/synthetic safeguards",
      "Publish participation + impact stats"
    ],
    C: [
      "Enable local profiles + backups",
      "Offer device performance guidance",
      "Document feature tradeoffs clearly"
    ]
  },
  'L5-S2': {
    A: [
      "Explain pricing-for-data tradeoffs",
      "Add easy revoke + delete options",
      "Ban downstream resale in contracts"
    ],
    B: [
      "Provide per-signal toggles",
      "Default to minimum sharing",
      "Audit default effects quarterly"
    ],
    C: [
      "Publish clear tier matrix",
      "Cap data scope per tier",
      "Review equity impacts regularly"
    ]
  },
  'L5-S3': {
    A: [
      "Hold community listening sessions",
      "Co-design acceptable-use rules",
      "Publish engagement summary + changes"
    ],
    B: [
      "Define narrow use cases",
      "Set success/exit criteria",
      "Report outcomes vs. harms"
    ],
    C: [
      "Document rationale + alternatives",
      "Invest in ethical first-party data",
      "Revisit decision annually"
    ]
  },
  'L5-S4': {
    A: [
      "Commission re-ID risk assessment",
      "Implement mitigations (k-anon/DP)",
      "Update user notices + choices"
    ],
    B: [
      "Publish sharing partners + purposes",
      "Post audit summaries + fixes",
      "Track opt-outs + complaints"
    ],
    C: [
      "Provide in-product privacy tips",
      "Host user feedback channels",
      "Iterate policies on published input"
    ]
  },
  'L5-S5': {
    A: [
      "Maintain card/PIN lanes",
      "Monitor opt-out friction",
      "Ban retaliation for opting out"
    ],
    B: [
      "Charter a cross-functional board",
      "Set bias/accuracy test schedule",
      "Publish incident + drift reports"
    ],
    C: [
      "Run anonymized sentiment surveys",
      "Include diverse shift/role reps",
      "Share findings + action items"
    ]
  },
  'L6-S1': {
    A: [
      "Fund role-aligned training tracks",
      "Set error ownership + review SLAs",
      "Publish productivity-sharing policy"
    ],
    B: [
      "Form worker councils per unit",
      "Define pilot success + stop rules",
      "Run harm/benefit reviews each sprint"
    ],
    C: [
      "Negotiate wage-sharing + job-quality terms",
      "Sign enforcement/appeal mechanisms",
      "Schedule staged rollout after agreement"
    ]
  },
  'L6-S2': {
    A: [
      "Workshop worker constraints/needs",
      "Add swap/appeal features",
      "Monitor burnout + stability metrics"
    ],
    B: [
      "Pilot on a few teams/shifts",
      "Set fairness + accuracy targets",
      "Provide rapid appeal corrections"
    ],
    C: [
      "Standardize human scheduling rules",
      "Train managers on bias guards",
      "Audit schedules quarterly"
    ]
  },
  'L6-S3': {
    A: [
      "Provide skills + policy training",
      "Cap monitoring to necessary data",
      "Review guidance quality monthly"
    ],
    B: [
      "Define \"complex\" trigger rules",
      "Allow agent override/notes",
      "Track outcomes vs. autonomy"
    ],
    C: [
      "Add in-tool tips + guardrails",
      "Monitor error/CSAT impacts daily",
      "Schedule retro + formal training"
    ]
  },
  'L6-S4': {
    A: [
      "Publish criteria + scoring math",
      "Stand up fast appeals pathway",
      "Audit for rating bias routinely"
    ],
    B: [
      "Implement fair assignment queue",
      "Add quality review + coaching",
      "Monitor client satisfaction drift"
    ],
    C: [
      "Negotiate access floors + pay bands",
      "Codify due-process timelines",
      "Publish compliance reports"
    ]
  },
  'L6-S5': {
    A: [
      "Define eligibility + amounts",
      "Create rehire pool + fast track",
      "Offer career navigation services"
    ],
    B: [
      "Map training to open roles",
      "Guarantee interview pathways",
      "Track placement + wage gains"
    ],
    C: [
      "Split schedules for learn/serve",
      "Set stipend/benefit protections",
      "Review progress each quarter"
    ]
  }
};

async function updateAllActions() {
  const levelFiles = fs.readdirSync(levelsDir).filter(f => f.endsWith('.json'));
  
  for (const file of levelFiles) {
    const filePath = path.join(levelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(content);
    let changed = false;

    data.scenarios = data.scenarios.map((scenario) => {
      const scenarioId = scenario.scenario_id;
      if (choiceSpecificActions[scenarioId]) {
        scenario.toolkit_flow.quick_actions = choiceSpecificActions[scenarioId];
        changed = true;
      }
      return scenario;
    });

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ Updated ${file}`);
    } else {
      console.log(`- No changes for ${file}`);
    }
  }
  console.log('\nDone! All quick actions are now choice-specific.');
}

updateAllActions().catch(console.error);

