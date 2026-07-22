import { riskModel, qualityModel } from './config.mjs';

const PATTERNS = {
  secret: [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
    /(?:密钥|私钥|访问令牌|凭据|token|secret|credential).{0,30}(?:提交|泄露|公开|写入|commit)/i,
  ],
  embodied: [/(机器人|机械臂|执行器|传感器闭环|物理动作|具身|robot|actuator|embodied|physical control|motor|torque)/i],
  missingEstop: [/(没有|缺少|无).{0,8}(急停|E-?Stop|Kill Switch)/i, /(without|no).{0,8}(e-?stop|kill switch)/i],
  ai: [/(LLM|大模型|RAG|模型服务|长期记忆|工具调用|tool call|prompt|embedding|向量库|memory|model)/i],
  agent: [/(Agent|智能体)/i],
  privileged: [/(生产数据库|生产环境|写入数据库|支付|执行代码|shell|删除数据|外部系统写|send money|production database)/i],
  noHuman: [/(不需要|无需|绕过|没有).{0,10}(人工|确认|审批|HITL)/i, /(without|no).{0,10}(human|approval|confirmation)/i],
  service: [/(公共\s*API|API服务|联网服务|数据库|持久化|状态机|调度器|后端服务|微服务|消息队列|缓存|deployment|service|database|networked|persistent)/i],
  library: [/(SDK|可复用|共享组件|库|CLI|package|library|reusable component)/i],
  prototype: [/(原型|PoC|实验|本地脚本|spike|prototype|experiment)/i],
  docs: [/(README|文档|拼写|typo|注释|教程|documentation)/i],
  governance: [/(治理|原则|角色权限|维护者|Owner机制|社区规则|默认开放|governance|principle|role permission)/i],
  bypassRfc: [/(不走|绕过|无需).{0,8}RFC/i, /without.{0,8}RFC/i],
  publicContract: [/(公共接口|公共\s*API|公网\s*API|公网|协议|Schema|状态机|领域契约|breaking change|protocol|public API)/i],
  incident: [/(事故|宕机|中断|漏洞|泄露|incident|outage|vulnerability|breach)/i],
  release: [/(发布|上线|部署|release|deploy|rollout|production readiness)/i],
  research: [/(论文|实验复现|数据集|benchmark|研究|paper|research|dataset)/i],
  pr: [/(Pull Request|\bPR\b|代码审查|diff|review)/i],
};

function any(text, patterns) {
  return patterns.some((p) => p.test(text));
}

function levelInfo(level) {
  return riskModel.levels.find((x) => x.id === level);
}

function qualityForRisk(risk, text) {
  if (risk === 'S5') return 'QA-L5';
  if (risk === 'S4') return 'QA-L4';
  if (risk === 'S3') return 'QA-L3';
  if (risk === 'S2') return 'QA-L2';
  if (risk === 'S1') return 'QA-L1';
  if (risk === 'BLOCKED') {
    if (any(text, PATTERNS.embodied)) return 'QA-L5';
    if (any(text, PATTERNS.ai)) return 'QA-L4';
    return 'QA-L3';
  }
  return 'QA-L0';
}

function maturityForText(text) {
  if (/(长期运行|稳定运行|持续运维|sustained)/i.test(text)) return 'M9';
  if (/(正式可用|GA|production)/i.test(text)) return 'M8';
  if (/(候选发布|release candidate)/i.test(text)) return 'M7';
  if (/(beta|pilot|试点)/i.test(text)) return 'M6';
  if (/(集成原型|integrated prototype)/i.test(text)) return 'M5';
  if (/(真实环境|staging|relevant environment)/i.test(text)) return 'M4';
  if (/(原型|prototype)/i.test(text)) return 'M3';
  if (/(PoC|proof of concept|可行性)/i.test(text)) return 'M2';
  if (/(概念|concept)/i.test(text)) return 'M1';
  return 'M0';
}

function workObject(text) {
  if (/(事故|incident|outage|breach)/i.test(text)) return 'Operation';
  if (/(项目|project|跨仓库|多阶段)/i.test(text)) return 'Project';
  if (/(功能|feature)/i.test(text)) return 'Feature';
  if (any(text, PATTERNS.prototype)) return any(text, PATTERNS.research) ? 'Experiment' : 'Prototype';
  if (/(想法|idea|是否需要)/i.test(text)) return 'Idea';
  return 'Task';
}

export function routeText(input) {
  const text = String(input ?? '').trim();
  const evidence = [];
  let risk = 'S0';
  let stopShip = false;

  if (any(text, PATTERNS.secret)) {
    risk = 'BLOCKED';
    stopShip = true;
    evidence.push('Detected suspected keys, credentials, or leakage semantics.');
  } else if (any(text, PATTERNS.embodied)) {
    risk = 'S5';
    evidence.push('Involves embodied endpoints, actuators, or real-world physical impact.');
    if (any(text, PATTERNS.missingEstop)) {
      stopShip = true;
      evidence.push('Missing hardware-level E-Stop or fail-safe mechanism.');
    }
  } else if ((any(text, PATTERNS.agent) && any(text, PATTERNS.privileged)) || any(text, PATTERNS.ai)) {
    risk = 'S4';
    evidence.push('Involves AI/Agent, models, RAG, tool calls, or long-term memory.');
    if (any(text, PATTERNS.privileged) && any(text, PATTERNS.noHuman)) {
      stopShip = true;
      evidence.push('High-impact external write lacks human confirmation or explicit authorization.');
    }
  } else if (any(text, PATTERNS.service) || any(text, PATTERNS.governance) || any(text, PATTERNS.publicContract)) {
    risk = 'S3';
    evidence.push(any(text, PATTERNS.governance)
      ? 'Involves organization-level rules, permissions, or long-term governance commitments.'
      : 'Involves networked, persistent, public-contract, or operational systems.');
  } else if (any(text, PATTERNS.agent)) {
    risk = 'S4';
    evidence.push('Involves Agent behavior or permissions; further confirmation needed on whether it is purely state-bearing.');
  } else if (any(text, PATTERNS.library)) {
    risk = 'S2';
    evidence.push('Involves reusable components, SDK, library, or CLI.');
  } else if (any(text, PATTERNS.prototype)) {
    risk = 'S1';
    evidence.push('Local experiment, PoC, or prototype.');
  } else if (any(text, PATTERNS.docs)) {
    risk = 'S0';
    evidence.push('Low-risk documentation or non-runtime asset.');
  } else {
    risk = 'S1';
    evidence.push('Insufficient information; tentatively S1 for reversible small-scope work; Owner review required.');
  }

  if (any(text, PATTERNS.bypassRfc) && (any(text, PATTERNS.governance) || any(text, PATTERNS.publicContract))) {
    stopShip = true;
    evidence.push('Attempting to bypass the RFC/formal decision process required for major changes.');
  }

  const skills = new Set(['moonweave-governance-router']);
  const artifacts = new Set();
  const reviews = new Set();
  let needsRfc = false;
  let needsAdr = false;

  if (any(text, PATTERNS.governance)) {
    skills.add('moonweave-governance-change');
    skills.add('moonweave-rfc');
    needsRfc = true;
    reviews.add('Stewardship Council / Governance Owner');
    artifacts.add('Governance RFC');
  }
  if (any(text, PATTERNS.publicContract) || /跨仓库|核心技术栈|难回滚|破坏性/i.test(text)) {
    skills.add('moonweave-rfc');
    needsRfc = true;
    needsAdr = true;
    artifacts.add('RFC');
    artifacts.add('ADR');
  }
  if (any(text, PATTERNS.docs)) {
    skills.add('moonweave-documentation');
    artifacts.add('Documentation Update');
  }
  if (any(text, PATTERNS.research) || /(比较|对比).{0,20}(算法|模型|检索)/i.test(text)) {
    skills.add('moonweave-research');
    artifacts.add('Research Log / Dataset Card');
  }
  if (any(text, PATTERNS.pr)) {
    skills.add('moonweave-code-review');
    skills.add('moonweave-pull-request');
    artifacts.add('PR Review Report');
  }
  if (any(text, PATTERNS.incident) || risk === 'BLOCKED') {
    skills.add('moonweave-incident-response');
    skills.add('moonweave-security-review');
    artifacts.add('Incident / Security Record');
  }
  if (risk === 'S2') {
    skills.add('moonweave-engineering-brief');
    skills.add('moonweave-quality-assurance');
    reviews.add('Owner / Reviewer');
    artifacts.add('Engineering Brief');
    artifacts.add('Test Plan / QUALITY.md');
  }
  if (risk === 'S3') {
    skills.add('moonweave-engineering-brief');
    skills.add('moonweave-quality-assurance');
    skills.add('moonweave-security-review');
    skills.add('moonweave-release-readiness');
    if (any(text, PATTERNS.publicContract) || /(长期|核心|跨仓库|公网|上线)/i.test(text)) {
      skills.add('moonweave-rfc');
      needsRfc = true;
      needsAdr = true;
      artifacts.add('RFC / ADR');
    }
    reviews.add('Owner / Maintainer');
    artifacts.add('Engineering Brief');
    artifacts.add('Threat Model (if networked or sensitive)');
    artifacts.add('Runbook / Rollback Plan');
  }
  if (risk === 'S4') {
    skills.add('moonweave-security-review');
    skills.add('moonweave-quality-assurance');
    skills.add('moonweave-rfc');
    needsRfc = true;
    needsAdr = true;
    reviews.add('AI Systems Reviewer');
    reviews.add('Security Reviewer');
    artifacts.add('AI Evaluation Report');
    artifacts.add('Tool Permission Matrix');
    artifacts.add('Agent Behavior Record');
    artifacts.add('Threat Model');
  }
  if (risk === 'S5') {
    skills.add('moonweave-security-review');
    skills.add('moonweave-quality-assurance');
    skills.add('moonweave-rfc');
    needsRfc = true;
    needsAdr = true;
    reviews.add('Embodiment Safety Reviewer');
    reviews.add('Security Reviewer');
    artifacts.add('Hazard Analysis');
    artifacts.add('Simulation / SIL / HIL Evidence');
    artifacts.add('E-Stop / HITL Verification');
  }
  if (any(text, PATTERNS.release)) {
    skills.add('moonweave-release-readiness');
    artifacts.add('Release Quality Report');
  }
  if (any(text, PATTERNS.research)) {
    skills.add('moonweave-research');
    artifacts.add('Research Log / Dataset Card');
  }
  if (skills.size === 1) {
    skills.add(workObject(text) === 'Idea' ? 'moonweave-idea-triage' : 'moonweave-implementation');
  }

  const quality = qualityForRisk(risk, text);
  const qualityInfo = qualityModel.levels.find((x) => x.id === quality);
  const riskInfo = levelInfo(risk);
  return {
    input: text,
    work_object: workObject(text),
    risk,
    risk_name: riskInfo?.name ?? risk,
    quality,
    quality_name: qualityInfo?.name ?? quality,
    maturity: maturityForText(text),
    stop_ship: stopShip,
    needs_rfc: needsRfc,
    needs_adr: needsAdr,
    evidence,
    required_skills: [...skills],
    required_artifacts: [...artifacts],
    required_reviewers: [...reviews],
    minimum_controls: riskInfo?.minimum ?? [],
    assumptions: text.length === 0 ? ['No task text provided.'] : [],
    disclaimer: 'This result is heuristic governance routing; it does not replace the Owner, dedicated Reviewers, or actual operational evidence.',
  };
}

export function routeMarkdown(result) {
  const lines = [];
  lines.push('# Moonweave Governance Routing');
  lines.push('');
  lines.push('| Dimension | Suggestion |');
  lines.push('|---|---|');
  lines.push(`| Work object | ${result.work_object} |`);
  lines.push(`| Risk | **${result.risk}** — ${result.risk_name} |`);
  lines.push(`| Quality | **${result.quality}** — ${result.quality_name} |`);
  lines.push(`| Maturity | ${result.maturity} |`);
  lines.push(`| RFC | ${result.needs_rfc ? 'Required' : 'Not required for now'} |`);
  lines.push(`| ADR | ${result.needs_adr ? 'Required' : 'Judge by impact'} |`);
  lines.push(`| Stop-Ship | ${result.stop_ship ? '**Yes**' : 'No'} |`);
  lines.push('');
  lines.push('## Rationale');
  lines.push('');
  for (const item of result.evidence) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Required Skills');
  lines.push('');
  for (const item of result.required_skills) lines.push(`- \`${item}\``);
  if (result.required_artifacts.length) {
    lines.push('');
    lines.push('## Required Artifacts');
    lines.push('');
    for (const item of result.required_artifacts) lines.push(`- ${item}`);
  }
  if (result.required_reviewers.length) {
    lines.push('');
    lines.push('## Required Reviewers');
    lines.push('');
    for (const item of result.required_reviewers) lines.push(`- ${item}`);
  }
  if (result.stop_ship) {
    lines.push('');
    lines.push('## Block');
    lines.push('');
    lines.push('Stop merge, release, deployment, or high-risk execution until the blocking cause is remediated and reviewed by the responsible owner.');
  }
  lines.push('');
  lines.push(`> ${result.disclaimer}`);
  return lines.join('\n');
}
