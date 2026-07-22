import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from './fs-utils.mjs';

export function emit(value, options = {}) {
  const { format = 'markdown', out = null } = options;
  let content;
  if (format === 'json') content = `${JSON.stringify(value, null, 2)}\n`;
  else if (format === 'sarif') content = `${JSON.stringify(value, null, 2)}\n`;
  else content = typeof value === 'string' ? `${value.trimEnd()}\n` : `${toMarkdown(value)}\n`;

  if (out) {
    ensureDir(path.dirname(path.resolve(out)));
    fs.writeFileSync(path.resolve(out), content, 'utf8');
  } else {
    process.stdout.write(content);
  }
}

export function toMarkdown(value) {
  if (typeof value === 'string') return value;
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

export function findingsMarkdown(report) {
  const lines = [];
  lines.push('# Moonweave Governance Audit');
  lines.push('');
  lines.push(`- **Root:** \`${report.root}\``);
  lines.push(`- **Profile:** \`${report.profile}\``);
  lines.push(`- **Generated:** ${report.generated_at}`);
  lines.push(`- **Risk suggestion:** ${report.summary.risk}`);
  lines.push(`- **QA suggestion:** ${report.summary.quality}`);
  lines.push(`- **Result:** ${report.summary.blockers > 0 ? 'BLOCKED' : report.summary.high > 0 ? 'Remediation required' : 'Passed baseline check'}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|---|---:|');
  for (const key of ['blocker', 'high', 'medium', 'low', 'info']) {
    lines.push(`| ${key} | ${report.summary[key] ?? 0} |`);
  }
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (report.findings.length === 0) {
    lines.push('No baseline governance gaps found. This result does not constitute a full security, quality, or architecture approval.');
  } else {
    for (const finding of report.findings) {
      lines.push(`### [${finding.severity.toUpperCase()}] ${finding.id}: ${finding.title}`);
      lines.push('');
      if (finding.path) lines.push(`- **Path:** \`${finding.path}\``);
      if (finding.evidence) lines.push(`- **Evidence:** ${finding.evidence}`);
      lines.push(`- **Remediation:** ${finding.remediation}`);
      lines.push(`- **Governance:** ${finding.governance}`);
      lines.push('');
    }
  }
  lines.push('## Notes');
  lines.push('');
  lines.push('- This audit is a read-only, heuristic baseline check; it does not run repository scripts, builds, or tests.');
  lines.push('- Tests, evaluations, and security reviews that were not run are not reported as passing.');
  lines.push('- S4/S5 projects still require dedicated human review and operational evidence.');
  return lines.join('\n');
}

export function toSarif(report) {
  const rules = new Map();
  const results = [];
  for (const finding of report.findings) {
    if (!rules.has(finding.id)) {
      rules.set(finding.id, {
        id: finding.id,
        name: finding.title,
        shortDescription: { text: finding.title },
        help: { text: `${finding.remediation}\nGovernance: ${finding.governance}` },
      });
    }
    const level = finding.severity === 'blocker' || finding.severity === 'high'
      ? 'error'
      : finding.severity === 'medium' ? 'warning' : 'note';
    const result = {
      ruleId: finding.id,
      level,
      message: { text: finding.evidence || finding.title },
    };
    if (finding.path) {
      result.locations = [{
        physicalLocation: {
          artifactLocation: { uri: finding.path },
        },
      }];
    }
    results.push(result);
  }
  return {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [{
      tool: {
        driver: {
          name: 'moonweave-skills governance audit',
          version: report.tool_version,
          informationUri: 'https://github.com/Moonweave-AI/governance/tree/main/governance-skills',
          rules: [...rules.values()],
        },
      },
      results,
    }],
  };
}
