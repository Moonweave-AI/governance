import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

export const GOVERNANCE_DOCUMENT_ROOTS = ['01-Foundation', '02-Governance', '03-Collaboration', '04-Engineering', '05-Knowledge', '06-Glossary'];
const REQUIRED = ['type', 'status', 'owner', 'created', 'updated', 'last_reviewed', 'summary', 'canonical', 'related', 'supersedes', 'superseded_by'];
const STATUSES = new Set(['Draft', 'Active', 'Deprecated', 'Superseded', 'Archived']);
const typeRegistry = JSON.parse(fs.readFileSync(new URL('../core/document-type-registry.json', import.meta.url), 'utf8'));
const DOCUMENT_TYPES = new Set(typeRegistry.$defs.type.oneOf.map((entry) => entry.const));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function finding(severity, id, file, message) {
  return { severity, id, path: normalizeRel(file), message };
}

function metadataFiles(root) {
  return GOVERNANCE_DOCUMENT_ROOTS.flatMap((dir) => walkFiles(path.join(root, dir)))
    .filter((file) => file.endsWith('.md'));
}

function isBlank(value) {
  return value === '' || (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0);
}

function isCalendarDate(value) {
  if (typeof value !== 'string' || !DATE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
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
    for (const key of REQUIRED) if (!(key in parsed.data) || isBlank(parsed.data[key])) findings.push(finding('error', 'missing-document-metadata', rel, `frontmatter is missing ${key}`));
    if (parsed.data.type && !DOCUMENT_TYPES.has(parsed.data.type)) findings.push(finding('error', 'invalid-document-type', rel, `Unknown type: ${parsed.data.type}`));
    if (parsed.data.status && !STATUSES.has(parsed.data.status)) findings.push(finding('error', 'invalid-document-status', rel, `Unknown status: ${parsed.data.status}`));
    for (const key of ['created', 'updated', 'last_reviewed']) if (!isCalendarDate(parsed.data[key])) findings.push(finding('error', 'invalid-document-date', rel, `${key} must be a real YYYY-MM-DD calendar date`));
    if (isCalendarDate(parsed.data.created) && isCalendarDate(parsed.data.updated) && parsed.data.updated < parsed.data.created) findings.push(finding('error', 'updated-before-created', rel, 'updated cannot be earlier than created'));
    if (isCalendarDate(parsed.data.updated) && isCalendarDate(parsed.data.last_reviewed) && parsed.data.last_reviewed < parsed.data.updated) findings.push(finding('error', 'review-before-update', rel, 'last_reviewed cannot be earlier than updated'));
    if (typeof parsed.data.summary !== 'string' || parsed.data.summary.length < 20 || parsed.data.summary.length > 280) findings.push(finding('error', 'invalid-summary-length', rel, 'summary must be between 20 and 280 characters'));
    for (const key of ['related', 'supersedes', 'superseded_by']) if (key in parsed.data && !Array.isArray(parsed.data[key])) findings.push(finding('error', 'invalid-document-relation', rel, `${key} must be a YAML list`));
    if (parsed.data.status === 'Superseded' && (!Array.isArray(parsed.data.superseded_by) || parsed.data.superseded_by.length === 0)) findings.push(finding('error', 'missing-replacement', rel, 'Superseded documents must name a replacement in superseded_by'));
    if (parsed.data.status === 'Archived' && !parsed.data.summary) findings.push(finding('error', 'missing-archive-context', rel, 'Archived documents require a summary explaining their retained context'));
    if (typeof parsed.data.canonical !== 'string' || !parsed.data.canonical.trim()) findings.push(finding('error', 'missing-canonical-target', rel, 'canonical must name an existing target'));
    else {
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
    if (parsed.data.type && !DOCUMENT_TYPES.has(parsed.data.type)) findings.push(finding('error', 'invalid-template-type', rel, `Unknown type: ${parsed.data.type}`));
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
