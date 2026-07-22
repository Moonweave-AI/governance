import fs from 'node:fs';
import path from 'node:path';
import { packageRoot } from './config.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DANGEROUS = [
  { id: 'pipe-shell', regex: /(?:curl|wget)[^\n|]*\|\s*(?:bash|sh|zsh)/i, message: 'Detected download-then-execute shell pattern' },
  { id: 'rm-rf', regex: /\brm\s+-rf\s+(?:\/|~|\$HOME|\.\.)/i, message: 'Detected high-risk recursive delete command' },
  { id: 'chmod-777', regex: /\bchmod\s+777\b/i, message: 'Detected overly permissive permission command' },
  { id: 'sudo', regex: /\bsudo\b/i, message: 'Detected privilege escalation command' },
  { id: 'prompt-override', regex: /(ignore|disregard).{0,30}(previous|system|developer).{0,20}(instruction|prompt)/i, message: 'Detected suspected prompt-injection instruction' },
  { id: 'auto-merge', regex: /(自动|无需人工).{0,20}(合并|发布|部署|删除|物理动作)/i, message: 'Detected high-risk action that may bypass human confirmation' },
];

function checkSkillDir(skillDir, root) {
  const findings = [];
  const name = path.basename(skillDir);
  const file = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(file)) {
    findings.push({ severity: 'error', id: 'missing-skill-md', path: normalizeRel(path.relative(root, skillDir)), message: 'Skill directory is missing SKILL.md' });
    return findings;
  }
  const text = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(text);
  const rel = normalizeRel(path.relative(root, file));
  if (parsed.error) findings.push({ severity: 'error', id: parsed.error, path: rel, message: 'YAML frontmatter missing or unclosed' });
  if (!NAME_RE.test(name)) findings.push({ severity: 'error', id: 'invalid-dir-name', path: rel, message: `Directory name is not kebab-case: ${name}` });
  if (!parsed.data.name) findings.push({ severity: 'error', id: 'missing-name', path: rel, message: 'frontmatter is missing name' });
  else {
    if (parsed.data.name !== name) findings.push({ severity: 'error', id: 'name-mismatch', path: rel, message: `name=${parsed.data.name} does not match directory name ${name}` });
    if (!NAME_RE.test(parsed.data.name)) findings.push({ severity: 'error', id: 'invalid-name', path: rel, message: 'name must be lowercase kebab-case' });
  }
  const description = parsed.data.description || '';
  if (!description) findings.push({ severity: 'error', id: 'missing-description', path: rel, message: 'frontmatter is missing description' });
  else if (description.length > 1024) findings.push({ severity: 'error', id: 'description-too-long', path: rel, message: `description length ${description.length} > 1024` });
  else if (description.length < 20) findings.push({ severity: 'warning', id: 'description-too-short', path: rel, message: 'description is too short, which may reduce auto-trigger quality' });

  const bodyWords = parsed.body.trim().split(/\s+/).filter(Boolean).length;
  if (bodyWords > 5000) findings.push({ severity: 'warning', id: 'body-too-long', path: rel, message: `Body is about ${bodyWords} tokens/words; consider splitting references for progressive loading` });
  if (!/(Security Execution Contract|Safety Execution Contract|安全执行契约)/.test(parsed.body)) findings.push({ severity: 'error', id: 'missing-safety-contract', path: rel, message: 'Missing "Security Execution Contract" section' });
  if (!/(Stop-Ship|停止推进|阻断)/i.test(parsed.body)) findings.push({ severity: 'warning', id: 'missing-stop-ship', path: rel, message: 'Stop-Ship / blocking behavior not explicitly stated' });
  if (!/(not fabricat|unverified|不虚构|未验证|不得.*测试)/i.test(parsed.body)) findings.push({ severity: 'warning', id: 'missing-evidence-honesty', path: rel, message: 'Fabricating test, evaluation, or approval results is not explicitly forbidden' });
  if (!/(Governance Sources?|治理来源)/.test(parsed.body)) findings.push({ severity: 'warning', id: 'missing-governance-source', path: rel, message: 'Missing governance-source traceability section' });

  for (const rule of DANGEROUS) {
    if (rule.regex.test(text)) findings.push({ severity: 'error', id: rule.id, path: rel, message: rule.message });
  }
  for (const resource of ['scripts', 'references', 'assets']) {
    const dir = path.join(skillDir, resource);
    if (!fs.existsSync(dir)) continue;
    for (const resourceFile of walkFiles(dir, { maxFiles: 1000 })) {
      const stat = fs.statSync(resourceFile);
      if (stat.size > 5 * 1024 * 1024) findings.push({ severity: 'warning', id: 'large-resource', path: normalizeRel(path.relative(root, resourceFile)), message: 'A single skill resource exceeds 5 MiB' });
    }
  }
  return findings;
}

export function lintSkills(rootInput = path.join(packageRoot, 'skills')) {
  const root = path.resolve(rootInput);
  if (!fs.existsSync(root)) throw new Error(`skills directory does not exist: ${root}`);
  const skillDirs = fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
  const findings = skillDirs.flatMap((dir) => checkSkillDir(dir, root));
  const summary = { skills: skillDirs.length, errors: findings.filter((x) => x.severity === 'error').length, warnings: findings.filter((x) => x.severity === 'warning').length };
  return { root, summary, findings };
}

export function lintMarkdown(report) {
  const lines = ['# Agent Skills Static Check', '', `- Skills: ${report.summary.skills}`, `- Errors: ${report.summary.errors}`, `- Warnings: ${report.summary.warnings}`, ''];
  if (!report.findings.length) lines.push('All skills passed the static check.');
  else {
    lines.push('| Severity | Rule | Path | Message |', '|---|---|---|---|');
    for (const f of report.findings) lines.push(`| ${f.severity} | ${f.id} | \`${f.path}\` | ${f.message.replaceAll('|', '\\|')} |`);
  }
  return lines.join('\n');
}
