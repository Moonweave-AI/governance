import fs from 'node:fs';
import path from 'node:path';
import { packageJson } from './config.mjs';
import { isTextFile, normalizeRel, redactSecret, walkFiles } from './fs-utils.mjs';

const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'target', '.next', '.venv', 'venv', '__pycache__', '.cache', 'coverage', '.terraform']);

const SECRET_PATTERNS = [
  { id: 'private-key', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g },
  { id: 'aws-access-key', regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: 'github-token', regex: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g },
  { id: 'openai-key', regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { id: 'generic-secret-assignment', regex: /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"'\s]{16,}["']/gi },
];

function existsAny(root, candidates) {
  return candidates.find((candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

function add(findings, severity, id, title, filePath, evidence, remediation, governance) {
  findings.push({ severity, id, title, path: filePath || null, evidence, remediation, governance });
}

function textContains(root, candidates, pattern) {
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    if (!fs.existsSync(file) || !isTextFile(file)) continue;
    try {
      if (pattern.test(fs.readFileSync(file, 'utf8'))) return candidate;
    } catch {}
  }
  return null;
}

function detectProfile(root) {
  const signals = [];
  const topFiles = ['README.md', 'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'docker-compose.yml', 'compose.yaml'];
  let sample = '';
  for (const file of topFiles) {
    const full = path.join(root, file);
    if (fs.existsSync(full) && isTextFile(full)) {
      sample += `\n${fs.readFileSync(full, 'utf8').slice(0, 200000)}`;
    }
  }
  if (/(ROS|robot|机器人|机械臂|actuator|sensor|embodied|gazebo|MoveIt)/i.test(sample) || fs.existsSync(path.join(root, 'src', 'robot'))) signals.push('embodied');
  if (/(Agent|智能体|LLM|RAG|model|模型|embedding|vector store|prompt)/i.test(sample)) signals.push('ai-agent');
  if (/(Dockerfile|kubernetes|service|server|FastAPI|Express|NestJS|数据库|API)/i.test(sample) || fs.existsSync(path.join(root, 'Dockerfile'))) signals.push('service');
  const codeFiles = walkFiles(root, { ignore: IGNORE_DIRS, maxFiles: 2000 }).filter((f) => /\.(?:py|ts|tsx|js|mjs|rs|go|java|cpp|c|h)$/i.test(f));
  if (codeFiles.length === 0) return 'docs';
  return signals[0] || 'library';
}

function riskAndQuality(profile) {
  switch (profile) {
    case 'embodied': return { risk: 'S5', quality: 'QA-L5' };
    case 'ai-agent': return { risk: 'S4', quality: 'QA-L4' };
    case 'service': return { risk: 'S3', quality: 'QA-L3' };
    case 'library': return { risk: 'S2', quality: 'QA-L2' };
    case 'docs': return { risk: 'S0', quality: 'QA-L0/QA-L2 (formal documentation assets)' };
    default: return { risk: 'S1', quality: 'QA-L1' };
  }
}

function scanSecrets(root, findings) {
  const files = walkFiles(root, { ignore: IGNORE_DIRS, maxFiles: 25000 });
  let count = 0;
  for (const file of files) {
    const rel = normalizeRel(path.relative(root, file));
    if (/(?:^|\/)(?:tests?\/fixtures|evals\/cases)\//i.test(rel)) continue;
    if (!isTextFile(file)) continue;
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    if (text.includes('moonweave: allow-secret-test')) continue;
    for (const rule of SECRET_PATTERNS) {
      rule.regex.lastIndex = 0;
      const match = rule.regex.exec(text);
      if (!match) continue;
      add(
        findings,
        'blocker',
        `MW-SEC-${rule.id.toUpperCase()}`,
        'Suspected hardcoded secret or private key detected',
        rel,
        `Matched ${rule.id}: ${redactSecret(match[0])}`,
        'Immediately revoke or rotate credentials, clean Git history, and inject via Secret Manager / CI Secret.',
        'Security-Ethics §Stop-Ship; Workflow §Env Vars and Secrets; Quality Assurance §Security Evidence',
      );
      count += 1;
      if (count >= 20) return;
    }
  }
}

function scanWorkflowRisks(root, findings) {
  const workflows = path.join(root, '.github', 'workflows');
  if (!fs.existsSync(workflows)) return;
  for (const file of walkFiles(workflows, { maxFiles: 200 })) {
    if (!/\.ya?ml$/i.test(file) || !isTextFile(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const rel = normalizeRel(path.relative(root, file));
    if (/pull_request_target\s*:/i.test(text)) {
      add(findings, 'high', 'MW-CI-PR-TARGET', 'Workflow uses pull_request_target', rel,
        'This trigger has a high-privilege context for fork PRs; checking out untrusted code may cause supply-chain risk.',
        'Use pull_request, or strictly isolate checkout, permissions, and secrets; reviewed by Security Reviewer.',
        'Security-Ethics §Supply Chain; Workflow §CI; Quality Assurance §Secure CI');
    }
    if (/permissions\s*:\s*write-all/i.test(text)) {
      add(findings, 'high', 'MW-CI-WRITE-ALL', 'GitHub Actions permissions too broad', rel,
        'Detected permissions: write-all.',
        'Set least-privilege permissions per job; default to contents: read.',
        'Security-Ethics §Least Privilege; Workflow §CI/CD');
    }
    if (/uses:\s*[^@\n]+@(main|master|latest)\b/i.test(text)) {
      add(findings, 'medium', 'MW-CI-UNPINNED-ACTION', 'GitHub Action not pinned to immutable version', rel,
        'Action references main/master/latest; supply-chain inputs can drift.',
        'Pin to a reviewed commit SHA and manage updates via Dependabot/Renovate.',
        'Security-Ethics §Asset Provenance; Quality Assurance §Supply-chain Evidence');
    }
  }
}

export function auditRepository(rootInput, options = {}) {
  const root = path.resolve(rootInput || '.');
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Audit root does not exist or is not a directory: ${root}`);
  const profile = options.profile && options.profile !== 'auto' ? options.profile : detectProfile(root);
  if (!['docs', 'library', 'service', 'ai-agent', 'embodied'].includes(profile)) throw new Error(`Unknown profile: ${profile}`);
  const findings = [];
  const isDocs = profile === 'docs';

  const baseChecks = [
    { files: ['README.md'], severity: 'high', id: 'MW-BASE-README', title: 'Missing README.md', remediation: 'Provide project status, purpose, Quick Start, documentation entry point, security reporting channel, and Owner.', governance: 'Documentation Guide §README' },
    { files: ['LICENSE', 'LICENSE.md', 'LICENSE.txt'], severity: 'high', id: 'MW-BASE-LICENSE', title: 'Missing explicit license', remediation: 'Add a confirmed license and ensure third-party asset licenses are compatible.', governance: 'Principles §Asset Cleanliness; Security-Ethics §Asset Admission' },
    { files: ['SECURITY.md', '.github/SECURITY.md'], severity: 'high', id: 'MW-BASE-SECURITY', title: 'Missing SECURITY.md', remediation: 'Provide a private vulnerability disclosure channel, supported versions, and response boundaries.', governance: 'Security-Ethics §Vulnerability Disclosure' },
    { files: ['CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS'], severity: 'medium', id: 'MW-BASE-CODEOWNERS', title: 'Missing CODEOWNERS', remediation: 'Declare Reviewer/Owner for critical paths and configure branch protection.', governance: 'Organization §Owner; Workflow §Required Review' },
    { files: ['CONTRIBUTING.md', '.github/CONTRIBUTING.md'], severity: 'low', id: 'MW-BASE-CONTRIBUTING', title: 'Missing CONTRIBUTING.md', remediation: 'Explain Issue, PR, testing, documentation, and AI-assisted contribution rules.', governance: 'Community §Contributor Entry' },
  ];
  for (const check of baseChecks) {
    if (!existsAny(root, check.files)) add(findings, check.severity, check.id, check.title, null, `Not found: ${check.files.join(', ')}`, check.remediation, check.governance);
  }

  if (!isDocs && !existsAny(root, ['CHANGELOG.md', 'CHANGELOG', 'changes'])) {
    add(findings, 'low', 'MW-BASE-CHANGELOG', 'Missing change log', null, 'No CHANGELOG or equivalent changes directory found.', 'Maintain a user-facing change log for formal releases.', 'Workflow §Release; Documentation Guide §Release Notes');
  }

  const workflows = path.join(root, '.github', 'workflows');
  if (!isDocs && (!fs.existsSync(workflows) || walkFiles(workflows).filter((f) => /\.ya?ml$/i.test(f)).length === 0)) {
    add(findings, 'high', 'MW-CI-MISSING', 'Missing CI workflows', '.github/workflows', 'No GitHub Actions workflows found.', 'Establish at least format/lint/typecheck/test/build and security scanning gates.', 'Workflow §CI; Quality Assurance §Gate Q3');
  }

  const tests = existsAny(root, ['tests', 'test', '__tests__', 'spec']);
  if (!isDocs && !tests) {
    add(findings, 'high', 'MW-QA-TESTS', 'Missing tests directory', null, 'No tests/test/__tests__/spec found.', 'Establish unit, integration, contract, and necessary E2E tests matching the risk and QA level.', 'Quality Assurance §Test Layering');
  }

  const lockfile = existsAny(root, ['uv.lock', 'poetry.lock', 'requirements.lock', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'Cargo.lock', 'go.sum']);
  const dependencyManifest = existsAny(root, ['pyproject.toml', 'package.json', 'Cargo.toml', 'go.mod']);
  if (dependencyManifest && !lockfile) {
    add(findings, 'medium', 'MW-SUPPLY-LOCKFILE', 'Dependency manifest present but lockfile missing', dependencyManifest,
      'Dependency resolution may drift over time.', 'Generate and commit an appropriate lockfile; use frozen installs in CI.', 'Principles §Reproducibility; Workflow §Dev Environment; Security-Ethics §Supply Chain');
  }

  if (!existsAny(root, ['QUALITY.md', 'docs/QUALITY.md'])) {
    add(findings, profile === 'docs' ? 'low' : 'medium', 'MW-QA-DECLARATION', 'Missing quality declaration QUALITY.md', null,
      'No declaration of component quality level, evidence scope, and known limitations found.',
      `Create QUALITY.md declaring the suggested level ${riskAndQuality(profile).quality}, Owner, tests, operations, and dedicated evidence.`,
      'Quality Assurance §Quality Level Declaration');
  }

  if (!existsAny(root, ['.moonweave/governance.json'])) {
    add(findings, 'low', 'MW-GOV-CONFIG', 'Missing Moonweave project governance config', '.moonweave/governance.json',
      'Project profile, Owner, risk, and source of truth cannot be read by machines.',
      'Run moonweave-skills install or create .moonweave/governance.json.',
      'Organization §Owner; Planning §Risk and Maturity');
  }

  if (!existsAny(root, ['AGENTS.md', 'CLAUDE.md', '.cursor/skills', '.claude/skills', '.agents/skills', '.opencode/skills', '.kilo/skills'])) {
    add(findings, 'low', 'MW-SKILLS-NOT-INSTALLED', 'No Agent governance adapter found', null,
      'Agents may be unable to discover Moonweave specs and skills on demand.',
      'Run moonweave-skills install --agents <platforms>.',
      'Communication §Agent Support Boundaries; Documentation Guide §Single Source of Truth');
  }

  const readmePath = existsAny(root, ['README.md']);
  if (readmePath) {
    const readme = fs.readFileSync(path.join(root, readmePath), 'utf8');
    if (!/(Owner|维护者|Maintainer|Ownership)/i.test(readme)) {
      add(findings, 'medium', 'MW-OWNER-MISSING', 'README does not declare Owner or maintenance responsibility', readmePath,
        'Formal asset lacks a visible responsibility entry.', 'Declare Primary/Backup Owner in README or the Owner Registry.', 'Organization §Owner Mechanism');
    }
    if (!/(Status|状态|Experimental|Active|Production|Deprecated|Archived)/i.test(readme)) {
      add(findings, 'low', 'MW-DOC-STATUS', 'README does not declare project status', readmePath,
        'Readers cannot tell whether the project is experimental, active, production, or archived.', 'Declare status and maturity at the top of the README.', 'Documentation Guide §README / Document Status');
    }
  }

  if (profile === 'service' || profile === 'ai-agent' || profile === 'embodied') {
    if (!existsAny(root, ['docs/runbook.md', 'docs/RUNBOOK.md', 'RUNBOOK.md', 'runbooks'])) {
      add(findings, 'high', 'MW-OPS-RUNBOOK', 'Operational system missing Runbook', null,
        'No common operations, alerting, rollback, backup/recovery, or upgrade paths found.', 'Create a Runbook and link Dashboard, alerts, Owner, and incident channels.', 'Documentation Guide §Runbook; Quality Assurance §QA-L3+');
    }
    const opsEvidence = textContains(root, ['README.md', 'QUALITY.md', 'docs/architecture.md', 'docs/ARCHITECTURE.md'], /(monitor|监控|alert|告警|SLO|rollback|回滚)/i);
    if (!opsEvidence) {
      add(findings, 'high', 'MW-OPS-EVIDENCE', 'Missing monitoring, alerting, SLO, or rollback description', null,
        'Operational quality evidence is not visible.', 'Define SLOs, key metrics, alerting, canary, and rollback paths for the service.', 'Quality Assurance §Operational Quality; Workflow §Deployment');
    }
  }

  if (profile === 'ai-agent' || profile === 'embodied') {
    if (!existsAny(root, ['MODEL_CARD.md', 'docs/model-card.md', 'model-card.md', 'models/README.md'])) {
      add(findings, 'high', 'MW-AI-MODEL-CARD', 'AI system missing Model Card', null,
        'Model purpose, version, evaluation, limitations, and safety boundaries are not traceable.', 'Create a Model Card or an explicit model registry link.', 'Documentation Guide §Model Card; Quality Assurance §Model Quality');
    }
    if (!existsAny(root, ['DATASET_CARD.md', 'docs/dataset-card.md', 'dataset-card.md', 'datasets/README.md'])) {
      add(findings, 'high', 'MW-AI-DATASET-CARD', 'AI system missing Dataset Card', null,
        'Training/evaluation/RAG data provenance, license, and restrictions are not traceable.', 'Create a Dataset Card recording provenance, license, privacy, contamination, and version.', 'Security-Ethics §Data Provenance; Documentation Guide §Dataset Card');
    }
    if (!existsAny(root, ['EVAL_REPORT.md', 'docs/eval-report.md', 'evals', 'evaluations'])) {
      add(findings, 'high', 'MW-AI-EVAL', 'AI system missing evaluation evidence', null,
        'No capability, safety, regression, cost, or failure-mode evaluation found.', 'Establish a versioned Eval Suite and AI Evaluation Report.', 'Quality Assurance §Agent Quality; Security-Ethics §AI Safety');
    }
    if (!existsAny(root, ['AGENT_BEHAVIOR.md', 'docs/agent-behavior-record.md', 'agent-behavior-record.md'])) {
      add(findings, 'medium', 'MW-AI-BEHAVIOR', 'Missing Agent Behavior Record', null,
        'Tool, permission, memory, audit, and human handoff boundaries are unclear.', 'Record Agent capabilities, the tool-permission matrix, memory policy, failure modes, and human takeover.', 'Security-Ethics §Capability Is Not Permission; Documentation Guide §Agent Record');
    }
  }

  if (profile === 'embodied') {
    if (!existsAny(root, ['HAZARD_ANALYSIS.md', 'docs/hazard-analysis.md', 'safety/hazard-analysis.md'])) {
      add(findings, 'blocker', 'MW-EMB-HAZARD', 'Embodied system missing Hazard Analysis', null,
        'No record of physical hazards, boundaries, failure states, and mitigations found.', 'Stop high-risk physical release; complete hazard analysis and have it approved by the safety reviewer.', 'Security-Ethics §Embodied Safety; Quality Assurance §QA-L5');
    }
    const embodiedEvidence = textContains(root,
      ['README.md', 'QUALITY.md', 'HAZARD_ANALYSIS.md', 'docs/hazard-analysis.md', 'safety/hazard-analysis.md'],
      /(E-?Stop|急停|HITL|人工接管|simulation|仿真|SIL|HIL)/i);
    if (!embodiedEvidence) {
      add(findings, 'blocker', 'MW-EMB-SAFETY-CONTROLS', 'No E-Stop, HITL, or simulation evidence found', null,
        'Embodied autonomous control lacks minimum fail-safe evidence.', 'Provide simulation, HITL, hardware E-Stop, and safe-state verification before physical execution.', 'Security-Ethics §Stop-Ship; Quality Assurance §Embodied Quality');
    }
  }

  scanSecrets(root, findings);
  scanWorkflowRisks(root, findings);

  const order = { blocker: 0, high: 1, medium: 2, low: 3, info: 4 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || a.id.localeCompare(b.id));
  const summary = { blocker: 0, high: 0, medium: 0, low: 0, info: 0, ...riskAndQuality(profile) };
  for (const finding of findings) summary[finding.severity] += 1;
  summary.blockers = summary.blocker;

  return {
    schema_version: '1.0',
    tool_version: packageJson.version,
    root,
    profile,
    generated_at: new Date().toISOString(),
    summary,
    findings,
  };
}
