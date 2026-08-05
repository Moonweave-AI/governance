import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

export const GOVERNANCE_DOCUMENT_ROOTS = ['01-Foundation', '02-Governance', '03-Collaboration', '04-Engineering', '05-Knowledge', '06-Glossary'];
const REQUIRED = ['type', 'status', 'owner', 'created', 'updated', 'last_reviewed', 'review_cycle_days', 'summary', 'canonical', 'related', 'supersedes', 'superseded_by'];
const TYPES = new Set(['governance-policy', 'governance-process', 'engineering-policy', 'knowledge-policy', 'glossary']);
const STATUSES = new Set(['Draft', 'Active', 'Deprecated', 'Superseded', 'Archived']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function finding(severity, id, file, message) {
  return { severity, id, path: normalizeRel(file), message };
}

function metadataFiles(root) {
  return GOVERNANCE_DOCUMENT_ROOTS.flatMap((dir) => walkFiles(path.join(root, dir)))
    .filter((file) => file.endsWith('.md'));
}

function isListValue(value) {
  return value === '[]' || (typeof value === 'object' && value !== null);
}

export function lintDocuments(rootInput) {
  const root = path.resolve(rootInput);
  const findings = [];
  const files = metadataFiles(root);
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontmatter(text);
    const rel = path.relative(root, file);
    if (parsed.error) {
      findings.push(finding('error', parsed.error, rel, 'Authoritative governance documents require YAML frontmatter.'));
      continue;
    }
    for (const key of REQUIRED) if (!(key in parsed.data) || parsed.data[key] === '') findings.push(finding('error', 'missing-document-metadata', rel, `frontmatter is missing ${key}`));
    if (parsed.data.type && !TYPES.has(parsed.data.type)) findings.push(finding('error', 'invalid-document-type', rel, `Unknown type: ${parsed.data.type}`));
    if (parsed.data.status && !STATUSES.has(parsed.data.status)) findings.push(finding('error', 'invalid-document-status', rel, `Unknown status: ${parsed.data.status}`));
    for (const key of ['created', 'updated', 'last_reviewed']) if (parsed.data[key] && !DATE.test(parsed.data[key])) findings.push(finding('error', 'invalid-document-date', rel, `${key} must be YYYY-MM-DD`));
    if (DATE.test(parsed.data.created || '') && DATE.test(parsed.data.updated || '') && parsed.data.updated < parsed.data.created) findings.push(finding('error', 'updated-before-created', rel, 'updated cannot be earlier than created'));
    if (DATE.test(parsed.data.updated || '') && DATE.test(parsed.data.last_reviewed || '') && parsed.data.last_reviewed < parsed.data.updated) findings.push(finding('error', 'review-before-update', rel, 'last_reviewed cannot be earlier than updated'));
    if (parsed.data.review_cycle_days && !/^\d+$/.test(parsed.data.review_cycle_days)) findings.push(finding('error', 'invalid-review-cycle', rel, 'review_cycle_days must be a positive integer'));
    for (const key of ['related', 'supersedes', 'superseded_by']) if (key in parsed.data && !isListValue(parsed.data[key])) findings.push(finding('error', 'invalid-document-relation', rel, `${key} must be a YAML list or []`));
    if (parsed.data.status === 'Superseded' && parsed.data.superseded_by === '[]') findings.push(finding('error', 'missing-replacement', rel, 'Superseded documents must name a replacement in superseded_by'));
    if (parsed.data.status === 'Archived' && !parsed.data.summary) findings.push(finding('error', 'missing-archive-context', rel, 'Archived documents require a summary explaining their retained context'));
    if (parsed.data.canonical) {
      const target = path.resolve(path.dirname(file), parsed.data.canonical);
      if (!fs.existsSync(target)) findings.push(finding('error', 'missing-canonical-target', rel, `canonical target does not exist: ${parsed.data.canonical}`));
    }
  }
  const summary = { documents: files.length, errors: findings.filter((item) => item.severity === 'error').length, warnings: findings.filter((item) => item.severity === 'warning').length };
  return { root, summary, findings };
}

export function lintTemplates(rootInput) {
  const root = path.resolve(rootInput);
  const findings = [];
  const files = walkFiles(path.join(root, 'templates')).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    const parsed = parseFrontmatter(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(root, file);
    if (parsed.error) {
      findings.push(finding('error', parsed.error, rel, 'Governance templates require YAML frontmatter.'));
      continue;
    }
    for (const key of REQUIRED) if (!(key in parsed.data)) findings.push(finding('error', 'missing-template-metadata', rel, `frontmatter is missing ${key}`));
  }
  const summary = { templates: files.length, errors: findings.filter((item) => item.severity === 'error').length, warnings: 0 };
  return { root, summary, findings };
}

export function documentLintMarkdown(report) {
  const lines = ['# Governance Document Metadata Check', '', `- Documents: ${report.summary.documents}`, `- Errors: ${report.summary.errors}`, `- Warnings: ${report.summary.warnings}`, ''];
  if (!report.findings.length) lines.push('All authoritative governance documents have valid metadata.');
  else {
    lines.push('| Severity | Rule | Path | Message |', '|---|---|---|---|');
    for (const item of report.findings) lines.push(`| ${item.severity} | ${item.id} | \`${item.path}\` | ${item.message.replaceAll('|', '\\|')} |`);
  }
  return lines.join('\n');
}

export function templateLintMarkdown(report) {
  const lines = ['# Governance Template Metadata Check', '', `- Templates: ${report.summary.templates}`, `- Errors: ${report.summary.errors}`, ''];
  if (!report.findings.length) lines.push('All governance templates have the required metadata fields.');
  else {
    lines.push('| Severity | Rule | Path | Message |', '|---|---|---|---|');
    for (const item of report.findings) lines.push(`| ${item.severity} | ${item.id} | \`${item.path}\` | ${item.message.replaceAll('|', '\\|')} |`);
  }
  return lines.join('\n');
}
