import fs from 'node:fs';
import path from 'node:path';
import {
  ATLAS_CHAR_BUDGET,
  CHANGE_ATLAS_CHAR_BUDGET,
  CHANGELOG_BULLET_BUDGET,
  CHANGELOG_BULLET_CHAR_BUDGET,
  GENERIC_SUMMARY_AFTER,
  HOT_CANONICAL_BUDGET,
  NEW_RECORD_INTEGRATION_AFTER,
  buildDocumentGraph,
  changeAtlasMarkdown,
  documentAtlasMarkdown,
  DOCUMENT_RELATIONS,
  GOVERNANCE_DOCUMENT_ROOTS,
  hotCanonicalDocuments,
  isCanonicalRecord,
  isHotStatus,
  loadChangelogs,
} from './document-graph.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

export { GOVERNANCE_DOCUMENT_ROOTS } from './document-graph.mjs';
const REQUIRED = ['type', 'status', 'owner', 'created', 'updated', 'last_reviewed', 'summary', 'canonical', 'related', 'supersedes', 'superseded_by'];
const STATUSES = new Set(['Draft', 'Active', 'Deprecated', 'Superseded', 'Archived']);
const typeRegistry = JSON.parse(fs.readFileSync(new URL('../core/document-type-registry.json', import.meta.url), 'utf8'));
const DOCUMENT_TYPES = new Set(typeRegistry.$defs.type.oneOf.map((entry) => entry.const));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function finding(severity, id, file, message) {
  return { severity, id, path: normalizeRel(file), message };
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
  const graph = buildDocumentGraph(root);
  const documentsByPath = new Map(graph.documents.map((document) => [document.path, document]));
  for (const document of graph.documents) {
    const data = document._data;
    const rel = document.path;
    if (document.parse_error) {
      findings.push(finding('error', document.parse_error, rel, 'Authoritative governance documents require YAML frontmatter.'));
      continue;
    }
    for (const key of REQUIRED) if (!(key in data) || isBlank(data[key])) findings.push(finding('error', 'missing-document-metadata', rel, `frontmatter is missing ${key}`));
    if (data.type && !DOCUMENT_TYPES.has(data.type)) findings.push(finding('error', 'invalid-document-type', rel, `Unknown type: ${data.type}`));
    if (data.status && !STATUSES.has(data.status)) findings.push(finding('error', 'invalid-document-status', rel, `Unknown status: ${data.status}`));
    for (const key of ['created', 'updated', 'last_reviewed']) if (!isCalendarDate(data[key])) findings.push(finding('error', 'invalid-document-date', rel, `${key} must be a real YYYY-MM-DD calendar date`));
    if (isCalendarDate(data.created) && isCalendarDate(data.updated) && data.updated < data.created) findings.push(finding('error', 'updated-before-created', rel, 'updated cannot be earlier than created'));
    if (isCalendarDate(data.updated) && isCalendarDate(data.last_reviewed) && data.last_reviewed < data.updated) findings.push(finding('error', 'review-before-update', rel, 'last_reviewed cannot be earlier than updated'));
    if (typeof data.summary !== 'string' || data.summary.length < 20 || data.summary.length > 280) findings.push(finding('error', 'invalid-summary-length', rel, 'summary must be between 20 and 280 characters'));
    for (const key of DOCUMENT_RELATIONS) if (key in data && !Array.isArray(data[key])) findings.push(finding('error', 'invalid-document-relation', rel, `${key} must be a YAML list`));
    if (data.status === 'Superseded' && (!Array.isArray(data.superseded_by) || data.superseded_by.length === 0)) findings.push(finding('error', 'missing-replacement', rel, 'Superseded documents must name a replacement in superseded_by'));
    if (data.status === 'Archived' && !data.summary) findings.push(finding('error', 'missing-archive-context', rel, 'Archived documents require a summary explaining their retained context'));
    if (typeof data.canonical !== 'string' || !data.canonical.trim() || document.canonical.external || !document.canonical.exists) {
      findings.push(finding('error', 'missing-canonical-target', rel, `canonical target does not exist: ${data.canonical || '(empty)'}`));
    }
    if (['engineering/rfc', 'architecture/adr'].includes(document.type)) {
      const canonical = document.canonical.document ? documentsByPath.get(document.canonical.document) : null;
      if (!canonical || canonical.type !== document.type || canonical.identifier !== document.identifier || canonical.decision_scope !== document.decision_scope) {
        findings.push(finding('error', 'invalid-canonical-decision-target', rel, 'Decision record canonical target must match its type, identifier, and decision_scope'));
      }
    }
    for (const key of DOCUMENT_RELATIONS) {
      const seen = new Set();
      for (const reference of document.relations[key]) {
        const identity = reference.external ? reference.target : reference.document || reference.target;
        if (!identity || !reference.exists && !reference.external) findings.push(finding('error', 'missing-document-relation-target', rel, `${key} target does not exist: ${reference.value}`));
        if ((key === 'supersedes' || key === 'superseded_by') && (reference.external || (reference.exists && !reference.document))) findings.push(finding('error', 'invalid-supersession-target', rel, `${key} must point to another governed document: ${reference.value}`));
        if (key === 'related' && !reference.external && reference.exists && !reference.document) findings.push(finding('error', 'invalid-related-target', rel, `${key} must point to another governed document: ${reference.value}`));
        if (reference.document === document.path) findings.push(finding('error', 'self-document-relation', rel, `${key} must not point to the same document`));
        if (seen.has(identity)) findings.push(finding('error', 'duplicate-document-relation', rel, `${key} repeats target: ${reference.value}`));
        seen.add(identity);
      }
    }
  }

  const inverse = { related: 'related', supersedes: 'superseded_by', superseded_by: 'supersedes' };
  for (const document of graph.documents) {
    for (const key of DOCUMENT_RELATIONS) {
      for (const reference of document.relations[key]) {
        if (!reference.document || reference.document === document.path) continue;
        const target = documentsByPath.get(reference.document);
        if (!target.relations[inverse[key]].some((candidate) => candidate.document === document.path)) {
          findings.push(finding('error', 'missing-reciprocal-relation', document.path, `${key} target ${reference.document} must declare ${inverse[key]} back to this document`));
        }
        if (key === 'supersedes' && target.status !== 'Superseded') {
          findings.push(finding('error', 'superseded-status-mismatch', reference.document, `Document superseded by ${document.path} must use status Superseded`));
        }
      }
    }
  }

  if (graph.documents.length > 1) {
    const adjacency = new Map(graph.documents.map((document) => [document.path, new Set()]));
    for (const document of graph.documents) {
      const localRelations = DOCUMENT_RELATIONS.flatMap((key) => document.relations[key]).filter((reference) => reference.document);
      if (!localRelations.length) findings.push(finding('error', 'orphan-document', document.path, 'Document must link at least one other governed document'));
      for (const reference of localRelations) {
        adjacency.get(document.path).add(reference.document);
        adjacency.get(reference.document).add(document.path);
      }
      if (document.canonical.document && document.canonical.document !== document.path) {
        adjacency.get(document.path).add(document.canonical.document);
        adjacency.get(document.canonical.document).add(document.path);
      }
    }
    const unseen = new Set(adjacency.keys());
    const components = [];
    while (unseen.size) {
      const component = [];
      const pending = [unseen.values().next().value];
      unseen.delete(pending[0]);
      while (pending.length) {
        const current = pending.pop();
        component.push(current);
        for (const neighbor of adjacency.get(current)) {
          if (!unseen.delete(neighbor)) continue;
          pending.push(neighbor);
        }
      }
      components.push(component.sort());
    }
    components.sort((left, right) => right.length - left.length);
    for (const component of components.slice(1)) {
      findings.push(finding('error', 'disconnected-document-graph', component[0], `${component.length} governed document(s) are disconnected from the primary document graph`));
    }
  }

  const identifiers = new Map();
  const decisionScopes = new Map();
  for (const document of graph.documents) {
    const expected = document.type === 'engineering/rfc' ? ['rfc', /^RFC-\d{4,}$/] : document.type === 'architecture/adr' ? ['adr', /^ADR-\d{4,}$/] : null;
    if (!expected) continue;
    const [field, pattern] = expected;
    const value = document._data[field];
    if (typeof value !== 'string' || !pattern.test(value)) {
      findings.push(finding('error', 'invalid-document-identifier', document.path, `${field} must match ${field.toUpperCase()}-0000`));
      continue;
    }
    const key = `${field}:${value.toUpperCase()}`;
    if (!identifiers.has(key)) identifiers.set(key, []);
    identifiers.get(key).push(document);
    const scope = document.decision_scope;
    if (typeof scope !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scope)) {
      findings.push(finding('error', 'invalid-decision-scope', document.path, 'decision_scope must be a stable lowercase kebab-case identifier'));
      continue;
    }
    if (!decisionScopes.has(scope)) decisionScopes.set(scope, []);
    decisionScopes.get(scope).push(document);
  }
  for (const [identifier, documents] of identifiers) {
    const canonicalRecords = new Set(documents.map((document) => document.canonical.document || document.path));
    if (canonicalRecords.size <= 1) continue;
    for (const document of documents) findings.push(finding('error', 'duplicate-document-identifier', document.path, `${identifier.split(':')[1]} names more than one canonical record`));
  }
  for (const [scope, documents] of decisionScopes) {
    for (const type of ['engineering/rfc', 'architecture/adr']) {
      const current = documents.filter((document) => document.type === type && !['Superseded', 'Archived'].includes(document.status));
      const canonicalRecords = new Set(current.map((document) => document.canonical.document || document.path));
      if (canonicalRecords.size <= 1) continue;
      for (const document of current) findings.push(finding('error', 'overlapping-decision-scope', document.path, `${scope} has more than one current ${type} authority`));
    }
    const rfcs = documents.filter((document) => document.type === 'engineering/rfc');
    for (const adr of documents.filter((document) => document.type === 'architecture/adr')) {
      if (!rfcs.length) continue;
      const linked = DOCUMENT_RELATIONS.some((key) => adr.relations[key].some((reference) => rfcs.some((rfc) => reference.document === rfc.path)));
      if (!linked) findings.push(finding('error', 'missing-decision-chain-link', adr.path, `${scope} ADR must link at least one RFC with the same decision_scope`));
    }
  }

  const visitState = new Map();
  const stack = [];
  const cycleDocuments = new Set();
  function visit(document) {
    visitState.set(document.path, 1);
    stack.push(document.path);
    for (const reference of document.relations.supersedes) {
      if (!reference.document) continue;
      if (visitState.get(reference.document) === 1) {
        for (const member of stack.slice(stack.indexOf(reference.document))) cycleDocuments.add(member);
      } else if (!visitState.has(reference.document)) visit(documentsByPath.get(reference.document));
    }
    stack.pop();
    visitState.set(document.path, 2);
  }
  for (const document of graph.documents) if (!visitState.has(document.path)) visit(document);
  for (const documentPath of cycleDocuments) findings.push(finding('error', 'supersession-cycle', documentPath, 'supersedes links must form an acyclic history'));

  const hot = hotCanonicalDocuments(graph);
  if (hot.length > HOT_CANONICAL_BUDGET) findings.push(finding('error', 'hot-atlas-over-budget', hot[0].path, `Hot canonical records ${hot.length} exceed the atlas budget of ${HOT_CANONICAL_BUDGET}`));
  const atlas = documentAtlasMarkdown(graph);
  if (atlas.length > ATLAS_CHAR_BUDGET) findings.push(finding('error', 'atlas-over-budget', 'docs/DOCUMENT-ATLAS.md', `Document atlas is ${atlas.length} characters and exceeds ${ATLAS_CHAR_BUDGET}`));
  const changeAtlas = changeAtlasMarkdown(graph);
  if (changeAtlas.length > CHANGE_ATLAS_CHAR_BUDGET) findings.push(finding('error', 'change-atlas-over-budget', 'docs/CHANGE-ATLAS.md', `Change atlas is ${changeAtlas.length} characters and exceeds ${CHANGE_ATLAS_CHAR_BUDGET}`));
  const hotByDomainType = new Map();
  for (const document of hot) {
    const key = `${document.path.split('/')[0]}:${document.type}`;
    if (!hotByDomainType.has(key)) hotByDomainType.set(key, []);
    hotByDomainType.get(key).push(document);
  }
  for (const document of graph.documents) {
    const summaryText = document._data.summary;
    if (typeof summaryText === 'string' && document.updated >= GENERIC_SUMMARY_AFTER && /^Authoritative\b/i.test(summaryText)) {
      findings.push(finding('error', 'generic-summary', document.path, 'summary must state the fact this record owns; a generated "Authoritative …" label is not a summary'));
    }
    if (!isCanonicalRecord(document) || !isHotStatus(document.status) || document.created < NEW_RECORD_INTEGRATION_AFTER) continue;
    const siblings = hotByDomainType.get(`${document.path.split('/')[0]}:${document.type}`) || [];
    const integrates = document.relations.supersedes.length > 0 || document._data.consolidation === 'new-authority';
    if (siblings.length > 1 && !integrates) {
      findings.push(finding('error', 'unintegrated-document', document.path, 'A new hot canonical record must supersede an existing record or set consolidation: new-authority'));
    }
  }
  if (fs.existsSync(path.join(root, 'progress.md'))) findings.push(finding('error', 'append-only-progress-diary', 'progress.md', 'Append-only progress diaries are not a change graph. Record the release in CHANGELOG.md and regenerate the change atlas.'));
  const changelogs = loadChangelogs(root);
  const heads = changelogs.map((file) => file.versions[0]?.version).filter(Boolean);
  if (new Set(heads).size > 1) findings.push(finding('error', 'changelog-head-mismatch', changelogs[0].path, `Changelog heads disagree: ${heads.join(', ')}`));
  for (const file of changelogs) {
    const raw = fs.readFileSync(path.join(root, file.path), 'utf8');
    if (/###\s+What was done|###\s+Notes\b|回滚方式|逐文件进度日记|file-by-file progress diary/i.test(raw)) {
      findings.push(finding('error', 'changelog-stack', file.path, 'Changelog entries must stay a release chain, not a progress diary'));
    }
    for (const version of file.versions) {
      if (version.bullets.length > CHANGELOG_BULLET_BUDGET) findings.push(finding('error', 'changelog-bullet-budget', file.path, `${version.version} has ${version.bullets.length} bullets; keep a release to ${CHANGELOG_BULLET_BUDGET} notable changes`));
      for (const bullet of version.bullets) {
        if (bullet.text.length > CHANGELOG_BULLET_CHAR_BUDGET) findings.push(finding('error', 'changelog-bullet-too-long', file.path, `${version.version} has a bullet longer than ${CHANGELOG_BULLET_CHAR_BUDGET} characters`));
      }
    }
  }

  const summary = { documents: graph.documents.length, errors: findings.filter((item) => item.severity === 'error').length, warnings: findings.filter((item) => item.severity === 'warning').length };
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
