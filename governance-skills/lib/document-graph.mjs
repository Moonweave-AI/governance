import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

export const GOVERNANCE_DOCUMENT_ROOTS = ['01-Foundation', '02-Governance', '03-Collaboration', '04-Engineering', '05-Knowledge', '06-Glossary'];
export const DOCUMENT_RELATIONS = ['related', 'supersedes', 'superseded_by'];
const governanceSkillMap = JSON.parse(fs.readFileSync(new URL('../core/governance-map.json', import.meta.url), 'utf8'));

function metadataFiles(root) {
  return GOVERNANCE_DOCUMENT_ROOTS.flatMap((dir) => walkFiles(path.join(root, dir)))
    .filter((file) => file.endsWith('.md'))
    .sort();
}

function titleFor(body, file) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(file, '.md');
}

function decisionIdentifier(data) {
  if (data.type === 'engineering/rfc') return data.rfc || null;
  if (data.type === 'architecture/adr') return data.adr || null;
  return null;
}

function splitTarget(value) {
  const markdown = value.match(/^\[[^\]]+\]\(([^)]+)\)$/);
  const target = (markdown?.[1] || value).trim();
  const suffixAt = [target.indexOf('?'), target.indexOf('#')].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? target.length;
  return { target, pathname: target.slice(0, suffixAt), suffix: target.slice(suffixAt) };
}

function resolveReference(value, sourceFile, root, documentPaths) {
  if (typeof value !== 'string' || !value.trim()) return { value, target: null, external: false, exists: false, document: null };
  const { target, pathname, suffix } = splitTarget(value.trim());
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) {
    return { value, target, external: true, exists: null, document: null };
  }
  if (!pathname) return { value, target, external: false, exists: false, document: null };
  const absolute = path.resolve(path.dirname(sourceFile), pathname);
  const relative = normalizeRel(path.relative(root, absolute));
  return {
    value,
    target: `${relative}${suffix}`,
    external: false,
    exists: fs.existsSync(absolute),
    document: documentPaths.has(absolute) ? relative : null,
  };
}

export function buildDocumentGraph(rootInput) {
  const root = path.resolve(rootInput);
  const files = metadataFiles(root);
  const documentPaths = new Set(files);
  const documents = files.map((file) => {
    const parsed = parseFrontmatter(fs.readFileSync(file, 'utf8'));
    const data = parsed.data;
    const document = {
      path: normalizeRel(path.relative(root, file)),
      title: titleFor(parsed.body, file),
      type: data.type || null,
      status: data.status || null,
      owner: data.owner || null,
      created: data.created || null,
      updated: data.updated || null,
      last_reviewed: data.last_reviewed || null,
      summary: data.summary || null,
      identifier: decisionIdentifier(data),
      decision_scope: data.decision_scope || null,
      canonical: resolveReference(data.canonical, file, root, documentPaths),
      relations: Object.fromEntries(DOCUMENT_RELATIONS.map((key) => [
        key,
        Array.isArray(data[key]) ? data[key].map((value) => resolveReference(value, file, root, documentPaths)) : [],
      ])),
      parse_error: parsed.error,
      skills: [],
    };
    Object.defineProperties(document, {
      _data: { value: data },
      _file: { value: file },
    });
    return document;
  });
  const documentsByPath = new Map(documents.map((document) => [document.path, document]));
  const skillsByCanonical = new Map();
  for (const [documentPath, skills] of Object.entries(governanceSkillMap)) {
    const document = documentsByPath.get(documentPath);
    if (!document) continue;
    const canonical = document.canonical.document || document.path;
    if (!skillsByCanonical.has(canonical)) skillsByCanonical.set(canonical, new Set());
    for (const skill of skills) skillsByCanonical.get(canonical).add(skill);
  }
  for (const document of documents) {
    const canonical = document.canonical.document || document.path;
    document.skills = [...(skillsByCanonical.get(canonical) || [])].sort();
  }
  const canonicalRecords = new Set(documents.map((document) => document.canonical.document || document.path));
  const relationCount = documents.reduce((count, document) => count + DOCUMENT_RELATIONS.reduce((total, key) => total + document.relations[key].length, 0), 0);
  const skillLinkCount = documents.reduce((count, document) => count + document.skills.length, 0);
  const graph = {
    summary: { documents: documents.length, canonical_records: canonicalRecords.size, relations: relationCount, skill_links: skillLinkCount },
    documents,
  };
  Object.defineProperty(graph, 'root', { value: root });
  return graph;
}

function table(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function linkLabel(value) {
  return table(value).replaceAll('[', '\\[').replaceAll(']', '\\]');
}

function hrefFor(root, outputFile, target, baseUrl) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) return target;
  const { pathname, suffix } = splitTarget(target);
  if (baseUrl) return new URL(`${pathname}${suffix}`, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).href;
  const base = outputFile ? path.dirname(path.resolve(outputFile)) : root;
  let relative = normalizeRel(path.relative(base, path.resolve(root, pathname)));
  if (!relative.startsWith('.')) relative = `./${relative}`;
  return `${relative}${suffix}`;
}

function referenceLink(graph, outputFile, baseUrl, reference, documentsByPath, fallbackLabel) {
  if (!reference.target) return '-';
  const targetDocument = reference.document ? documentsByPath.get(reference.document) : null;
  const label = targetDocument?.identifier || targetDocument?.title || fallbackLabel || reference.target;
  return `[${linkLabel(label)}](${hrefFor(graph.root, outputFile, reference.target, baseUrl)})`;
}

export function documentIndexMarkdown(graph, options = {}) {
  const outputFile = options.outputFile || null;
  const baseUrl = options.baseUrl || null;
  const documentsByPath = new Map(graph.documents.map((document) => [document.path, document]));
  const decisionRecords = graph.documents.filter((document) => document.identifier);
  const relationsFor = (document) => DOCUMENT_RELATIONS.flatMap((key) => document.relations[key].map((reference) => {
    return `${key}: ${referenceLink(graph, outputFile, baseUrl, reference, documentsByPath)}`;
  })).join('<br>') || '-';
  const lines = [
    '# Governance Document Index',
    '',
    '<!-- Generated by moonweave-skills docs-index. Edit document frontmatter, not this file. -->',
    '',
    `- Documents: ${graph.summary.documents}`,
    `- Canonical records: ${graph.summary.canonical_records}`,
    `- Decision records: ${decisionRecords.length}`,
    `- Declared relations: ${graph.summary.relations}`,
    `- Document-to-skill links: ${graph.summary.skill_links}`,
    '',
    '## Decision Records',
    '',
  ];
  if (!decisionRecords.length) lines.push('No RFC or ADR records are registered.', '');
  else {
    lines.push('| Record | Decision scope | Type | Status | Relations | Updated |', '|---|---|---|---|---|---|');
    for (const document of decisionRecords) {
      const documentLink = `[${linkLabel(document.identifier)}](${hrefFor(graph.root, outputFile, document.path, baseUrl)})`;
      lines.push(`| ${documentLink} | ${table(document.decision_scope || '-')} | ${table(document.type)} | ${table(document.status)} | ${relationsFor(document)} | ${table(document.updated)} |`);
    }
    lines.push('');
  }
  lines.push(
    '## All Documents',
    '',
    '| Document | Type | Decision scope | Status | Canonical | Relations | Skills | Updated | Summary |',
    '|---|---|---|---|---|---|---|---|---|',
  );
  for (const document of graph.documents) {
    const documentLabel = document.identifier || document.title;
    const documentLink = `[${linkLabel(documentLabel)}](${hrefFor(graph.root, outputFile, document.path, baseUrl)})`;
    const canonical = document.canonical.document === document.path
      ? 'self'
      : referenceLink(graph, outputFile, baseUrl, document.canonical, documentsByPath, 'canonical');
    const skills = document.skills.map((skill) => `\`${skill}\``).join('<br>') || '-';
    lines.push(`| ${documentLink} | ${table(document.type)} | ${table(document.decision_scope || '-')} | ${table(document.status)} | ${canonical} | ${relationsFor(document)} | ${skills} | ${table(document.updated)} | ${table(document.summary)} |`);
  }
  return lines.join('\n');
}
