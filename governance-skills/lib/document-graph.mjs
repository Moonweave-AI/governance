import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { normalizeRel, walkFiles } from './fs-utils.mjs';

export const GOVERNANCE_DOCUMENT_ROOTS = ['01-Foundation', '02-Governance', '03-Collaboration', '04-Engineering', '05-Knowledge', '06-Glossary'];
export const DOCUMENT_RELATIONS = ['related', 'supersedes', 'superseded_by'];
export const HOT_STATUSES = new Set(['Draft', 'Active']);
export const HOT_CANONICAL_BUDGET = 40;
export const ATLAS_CHAR_BUDGET = 16000;
export const CHANGE_ATLAS_CHAR_BUDGET = 20000;
export const CHANGELOG_BULLET_BUDGET = 12;
export const CHANGELOG_BULLET_CHAR_BUDGET = 900;
export const GENERIC_SUMMARY_AFTER = '2026-11-02';
export const NEW_RECORD_INTEGRATION_AFTER = '2026-11-02';
const CHANGELOG_PATHS = ['governance-skills/CHANGELOG.md', 'CHANGELOG.md'];
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

export function isCanonicalRecord(document) {
  return !document.canonical.document || document.canonical.document === document.path;
}

export function isHotStatus(status) {
  return HOT_STATUSES.has(status);
}

function clip(value, max = 180) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function agentSummary(summary, title, max = 140) {
  const text = String(summary ?? '').replace(/\s+/g, ' ').trim();
  const generic = text.match(/^Authoritative\b[^:]{0,80}:\s*(.+)$/i);
  const label = (value) => String(value ?? '').trim().replace(/[.。]$/, '');
  if (generic && (!title || label(generic[1]) === label(title))) return '';
  return clip(text, max);
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
  const canonicalDocuments = documents.filter((document) => isCanonicalRecord(document));
  const hotCanonical = canonicalDocuments.filter((document) => isHotStatus(document.status)).length;
  const relationCount = documents.reduce((count, document) => count + DOCUMENT_RELATIONS.reduce((total, key) => total + document.relations[key].length, 0), 0);
  const skillLinkCount = documents.reduce((count, document) => count + document.skills.length, 0);
  const graph = {
    summary: {
      documents: documents.length,
      canonical_records: canonicalRecords.size,
      relations: relationCount,
      skill_links: skillLinkCount,
      hot_canonical: hotCanonical,
      cold_canonical: canonicalDocuments.length - hotCanonical,
      translations: documents.length - canonicalDocuments.length,
    },
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
  lines.push('', 'This ledger is the audit view. Agents load `docs-index --view atlas` or `--view neighborhood --focus <path>`.');
  return lines.join('\n');
}

function documentsByPath(graph) {
  return new Map(graph.documents.map((document) => [document.path, document]));
}

export function neighborPaths(document) {
  const paths = new Set();
  for (const key of DOCUMENT_RELATIONS) {
    for (const reference of document.relations[key]) {
      if (reference.document && reference.document !== document.path) paths.add(reference.document);
    }
  }
  return [...paths];
}

export function hotCanonicalDocuments(graph) {
  return graph.documents.filter((document) => isCanonicalRecord(document) && isHotStatus(document.status));
}

function documentLink(graph, outputFile, baseUrl, document) {
  const label = document.identifier || document.title;
  return `[${linkLabel(label)}](${hrefFor(graph.root, outputFile, document.path, baseUrl)})`;
}

function findFocus(graph, focus) {
  if (!focus) return null;
  const normalized = String(focus).replaceAll('\\', '/').replace(/^\.\//, '');
  return graph.documents.find((document) => document.path === normalized || document.identifier === focus || document.title === focus) || null;
}

function nodeSummary(document) {
  return {
    path: document.path,
    title: document.title,
    identifier: document.identifier,
    type: document.type,
    status: document.status,
    updated: document.updated,
    decision_scope: document.decision_scope,
    summary: agentSummary(document.summary, document.title),
    neighbor_count: neighborPaths(document).length,
    skills: document.skills,
  };
}

export function documentAtlas(graph) {
  const hot = hotCanonicalDocuments(graph);
  const domains = new Map();
  for (const document of hot) {
    const domain = document.path.split('/')[0];
    if (!domains.has(domain)) domains.set(domain, []);
    domains.get(domain).push(nodeSummary(document));
  }
  const cold = graph.documents.filter((document) => isCanonicalRecord(document) && !isHotStatus(document.status)).map((document) => ({
    path: document.path,
    identifier: document.identifier,
    status: document.status,
  }));
  return {
    view: 'atlas',
    budget: { hot_canonical: HOT_CANONICAL_BUDGET, atlas_chars: ATLAS_CHAR_BUDGET },
    summary: {
      hot_canonical: graph.summary.hot_canonical,
      cold_canonical: graph.summary.cold_canonical,
      translations: graph.summary.translations,
      documents: graph.summary.documents,
      relations: graph.summary.relations,
    },
    domains: [...domains.entries()].map(([id, records]) => ({ id, records })),
    cold,
  };
}

export function documentAtlasMarkdown(graph, options = {}) {
  const outputFile = options.outputFile || null;
  const baseUrl = options.baseUrl || null;
  const atlas = documentAtlas(graph);
  const lines = [
    '# Governance Document Atlas',
    '',
    '<!-- Generated by moonweave-skills docs-index --view atlas. Edit document frontmatter, not this file. -->',
    '',
    'Load this map before reading governance documents. It keeps one row per hot canonical record. Translations and superseded records stay out of the default context. Open one neighborhood with `docs-index --view neighborhood --focus <path>` when a row is relevant.',
    '',
    `- Hot canonical records: ${atlas.summary.hot_canonical} / ${HOT_CANONICAL_BUDGET}`,
    `- Cold canonical records excluded: ${atlas.summary.cold_canonical}`,
    `- Translations folded into their canonical record: ${atlas.summary.translations}`,
    `- Declared relations retained in the graph: ${atlas.summary.relations}`,
    '',
  ];
  for (const domain of atlas.domains) {
    lines.push(`## ${domain.id}`, '', '| Canonical | Type | Status | Updated | Neighbors | Skills | Summary |', '|---|---|---|---|---:|---|---|');
    for (const record of domain.records) {
      const document = documentsByPath(graph).get(record.path);
      const skills = record.skills.map((skill) => `\`${skill}\``).join(', ') || '-';
      lines.push(`| ${documentLink(graph, outputFile, baseUrl, document)} | ${table(record.type)} | ${table(record.status)} | ${table(record.updated)} | ${record.neighbor_count} | ${table(skills)} | ${table(record.summary || '-')} |`);
    }
    lines.push('');
  }
  if (!atlas.domains.length) lines.push('No hot canonical records are registered.', '');
  if (atlas.cold.length) {
    lines.push('## Cold Records', '', 'These records remain in the graph for history and are excluded from the hot atlas.', '');
    for (const record of atlas.cold) lines.push(`- ${record.identifier || record.path} (${record.status})`);
    lines.push('');
  }
  return lines.join('\n');
}

export function documentNeighborhood(graph, focus) {
  const document = findFocus(graph, focus);
  if (!document) return { view: 'neighborhood', focus: focus || null, error: 'not-found' };
  const byPath = documentsByPath(graph);
  const canonical = document.canonical.document || document.path;
  const neighbors = [];
  for (const key of DOCUMENT_RELATIONS) {
    for (const reference of document.relations[key]) {
      if (!reference.document || reference.document === document.path) continue;
      const target = byPath.get(reference.document);
      if (!target) continue;
      neighbors.push({ via: key, ...nodeSummary(target) });
    }
  }
  const translations = graph.documents.filter((candidate) => (candidate.canonical.document || candidate.path) === canonical && candidate.path !== document.path).map((candidate) => candidate.path);
  const scope = document.decision_scope;
  const decisionChain = scope
    ? graph.documents.filter((candidate) => candidate.decision_scope === scope && isCanonicalRecord(candidate)).map((candidate) => candidate.path)
    : [];
  return {
    view: 'neighborhood',
    focus: document.path,
    node: { ...nodeSummary(document), relations: Object.fromEntries(DOCUMENT_RELATIONS.map((key) => [key, document.relations[key].map((reference) => reference.document || reference.target)])) },
    neighbors,
    translations,
    decision_chain: decisionChain,
  };
}

export function documentNeighborhoodMarkdown(graph, focus, options = {}) {
  const neighborhood = documentNeighborhood(graph, focus);
  if (neighborhood.error) return `# Neighborhood\n\nNo governed document matches \`${table(focus)}\`.`;
  const outputFile = options.outputFile || null;
  const baseUrl = options.baseUrl || null;
  const byPath = documentsByPath(graph);
  const document = byPath.get(neighborhood.focus);
  const lines = [
    `# Neighborhood: ${document.identifier || document.title}`,
    '',
    `- Path: \`${document.path}\``,
    `- Type: ${table(document.type)}`,
    `- Status: ${table(document.status)}`,
    `- Updated: ${table(document.updated)}`,
    `- Decision scope: ${table(document.decision_scope || '-')}`,
    `- Summary: ${table(agentSummary(document.summary, document.title, 240) || '-')}`,
    '',
    '## One hop',
    '',
  ];
  if (!neighborhood.neighbors.length) lines.push('This record has no governed neighbors.', '');
  else {
    lines.push('| Via | Record | Status | Summary |', '|---|---|---|---|');
    for (const neighbor of neighborhood.neighbors) {
      const target = byPath.get(neighbor.path);
      lines.push(`| ${neighbor.via} | ${documentLink(graph, outputFile, baseUrl, target)} | ${table(neighbor.status)} | ${table(clip(neighbor.summary, 120))} |`);
    }
    lines.push('');
  }
  if (neighborhood.translations.length) {
    lines.push('## Translations', '');
    for (const item of neighborhood.translations) lines.push(`- \`${item}\``);
    lines.push('');
  }
  if (neighborhood.decision_chain.length > 1) {
    lines.push('## Decision chain', '');
    for (const item of neighborhood.decision_chain) lines.push(`- \`${item}\``);
    lines.push('');
  }
  return lines.join('\n');
}

export function parseChangelog(text) {
  const versions = [];
  for (const chunk of String(text).split(/\n(?=## )/)) {
    const match = chunk.match(/^##\s+(\S+)\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*\n([\s\S]*)$/);
    if (!match) continue;
    const [, version, date, body] = match;
    const bullets = [];
    let category = 'Changed';
    let current = null;
    const push = () => {
      if (current) bullets.push(current);
      current = null;
    };
    for (const line of body.split('\n')) {
      const heading = line.match(/^###\s+(.+?)\s*$/);
      if (heading) {
        push();
        category = heading[1].trim();
        continue;
      }
      const bullet = line.match(/^[-*]\s+(.+)/);
      if (bullet) {
        push();
        current = { category, text: bullet[1].trim() };
        continue;
      }
      if (current && /^\s+\S/.test(line)) current.text += ` ${line.trim()}`;
    }
    push();
    versions.push({ version, date, bullets });
  }
  return versions;
}

export function loadChangelogs(rootInput) {
  const root = path.resolve(rootInput);
  return CHANGELOG_PATHS.filter((rel) => fs.existsSync(path.join(root, rel))).map((rel) => ({
    path: rel,
    versions: parseChangelog(fs.readFileSync(path.join(root, rel), 'utf8')),
  }));
}

function mermaidId(value, index) {
  const cleaned = String(value).replace(/[^A-Za-z0-9]/g, '');
  return `${cleaned || 'node'}${index}`;
}

export function changeAtlas(graph, changelogs = []) {
  const canonicalChangelog = changelogs.find((file) => file.path === 'governance-skills/CHANGELOG.md') || changelogs[0] || { path: null, versions: [] };
  const decisions = new Map();
  for (const document of graph.documents.filter((item) => item.identifier && isCanonicalRecord(item))) {
    if (!decisions.has(document.decision_scope)) decisions.set(document.decision_scope, []);
    decisions.get(document.decision_scope).push({
      path: document.path,
      identifier: document.identifier,
      status: document.status,
      supersedes: document.relations.supersedes.map((reference) => reference.document).filter(Boolean),
    });
  }
  const changes = hotCanonicalDocuments(graph).map(nodeSummary).sort((left, right) => String(right.updated).localeCompare(String(left.updated)));
  return {
    view: 'changes',
    changelog: canonicalChangelog.path,
    releases: canonicalChangelog.versions.map((version, index, all) => ({
      version: version.version,
      date: version.date,
      previous: all[index + 1]?.version || null,
      changes: version.bullets.map((bullet) => ({ category: bullet.category, text: clip(bullet.text, 160) })),
    })),
    decisions: [...decisions.entries()].map(([scope, records]) => ({ scope, records })),
    records: changes,
  };
}

export function changeAtlasMarkdown(graph, options = {}) {
  const changelogs = options.changelogs || loadChangelogs(graph.root);
  const atlas = changeAtlas(graph, changelogs);
  const outputFile = options.outputFile || null;
  const baseUrl = options.baseUrl || null;
  const byPath = documentsByPath(graph);
  const lines = [
    '# Governance Change Atlas',
    '',
    '<!-- Generated by moonweave-skills docs-index --view changes. Edit CHANGELOG.md and document frontmatter, not this file. -->',
    '',
    'This is the change graph. Each release points at the previous release. Each decision points at the record it supersedes. Each hot canonical record appears once, on the date it last changed.',
    '',
    '```mermaid',
    'flowchart LR',
  ];
  if (!atlas.releases.length) lines.push('  empty[No changelog]');
  atlas.releases.forEach((release, index) => {
    const id = mermaidId(release.version, index);
    lines.push(`  ${id}["${release.version}"]`);
    if (release.previous) lines.push(`  ${id} --> ${mermaidId(release.previous, index + 1)}`);
  });
  for (const decision of atlas.decisions) {
    for (const record of decision.records) {
      const id = mermaidId(record.identifier, 0);
      lines.push(`  ${id}["${record.identifier}"]`);
      for (const predecessor of record.supersedes) {
        const target = byPath.get(predecessor);
        if (target?.identifier) lines.push(`  ${id} --> ${mermaidId(target.identifier, 0)}`);
      }
    }
  }
  lines.push('```', '', '## Release chain', '');
  if (!atlas.releases.length) lines.push('No changelog was found.', '');
  else {
    lines.push(`Source: \`${atlas.changelog}\`.`, '', '| Version | Date | Previous | Changes |', '|---|---|---|---|');
    for (const release of atlas.releases) {
      const changes = release.changes.slice(0, 6).map((change) => `${change.category}: ${table(change.text)}`).join('<br>') || '-';
      const hidden = release.changes.length > 6 ? `<br>+${release.changes.length - 6} more in the changelog` : '';
      lines.push(`| ${table(release.version)} | ${table(release.date)} | ${table(release.previous || '-')} | ${changes}${hidden} |`);
    }
    lines.push('');
  }
  lines.push('## Decision chains', '');
  if (!atlas.decisions.length) lines.push('No RFC or ADR records are registered.', '');
  else {
    lines.push('| Scope | Current | History |', '|---|---|---|');
    for (const decision of atlas.decisions) {
      const current = decision.records.filter((record) => isHotStatus(record.status));
      const currentLinks = current.map((record) => documentLink(graph, outputFile, baseUrl, byPath.get(record.path))).join('<br>') || '-';
      const history = decision.records.flatMap((record) => record.supersedes.map((predecessor) => {
        const target = byPath.get(predecessor);
        return target ? documentLink(graph, outputFile, baseUrl, target) : predecessor;
      })).join('<br>') || '-';
      lines.push(`| ${table(decision.scope)} | ${currentLinks} | ${history} |`);
    }
    lines.push('');
  }
  lines.push('## Canonical records by last change', '');
  let domain = null;
  for (const record of atlas.records) {
    const nextDomain = record.path.split('/')[0];
    if (nextDomain !== domain) {
      domain = nextDomain;
      lines.push(`### ${domain}`, '', '| Record | Updated | Neighbors | Summary |', '|---|---|---:|---|');
    }
    const document = byPath.get(record.path);
    lines.push(`| ${documentLink(graph, outputFile, baseUrl, document)} | ${table(record.updated)} | ${record.neighbor_count} | ${table(record.summary || '-')} |`);
  }
  if (!atlas.records.length) lines.push('No hot canonical records are registered.');
  lines.push('');
  return lines.join('\n');
}

export const DOCUMENT_VIEWS = {
  atlas: documentAtlasMarkdown,
  full: documentIndexMarkdown,
  changes: changeAtlasMarkdown,
};
