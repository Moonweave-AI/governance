import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { packageJson } from '../lib/config.mjs';
import { buildDocumentGraph, documentAtlasMarkdown, documentIndexMarkdown, documentNeighborhoodMarkdown, changeAtlasMarkdown, parseChangelog } from '../lib/document-graph.mjs';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function write(root, relative, text) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function document({ title, canonical, related = '[]' }) {
  return [
    '---', 'type: governance-policy', 'status: Active', 'owner: Governance',
    'created: 2026-08-08', 'updated: 2026-08-08', 'last_reviewed: 2026-08-08',
    `summary: This document describes the authoritative ${title} governance policy.`,
    `canonical: ${canonical}`, `related: ${related}`, 'supersedes: []', 'superseded_by: []',
    '---', `# ${title}`, '',
  ].join('\n');
}

test('document graph renders a linked index from frontmatter', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-graph-'));
  write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md', related: '[../02-Governance/process.md]' }));
  write(root, '02-Governance/process.md', document({ title: 'Process', canonical: './process.md', related: '[../01-Foundation/policy.md]' }));
  const graph = buildDocumentGraph(root);
  const out = path.join(root, 'docs', 'DOCUMENT-INDEX.md');
  const markdown = documentIndexMarkdown(graph, { outputFile: out });
  assert.equal(graph.summary.documents, 2);
  assert.equal(graph.summary.canonical_records, 2);
  assert.equal(graph.summary.relations, 2);
  assert.equal(graph.summary.skill_links, 0);
  assert.equal(graph.summary.hot_canonical, 2);
  assert.equal(graph.summary.translations, 0);
  assert.match(markdown, /\[Policy\]\(\.\.\/01-Foundation\/policy\.md\)/);
  assert.match(markdown, /## Decision Records\n\nNo RFC or ADR records are registered\./);
  assert.match(markdown, /## All Documents/);
  assert.match(markdown, /\| Document \| Type \| Decision scope \|/);
  assert.match(markdown, /related: \[Process\]\(\.\.\/02-Governance\/process\.md\)/);
});

test('document graph escapes table delimiters in link labels', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-graph-'));
  write(root, '01-Foundation/policy.md', document({ title: 'Policy | Scope', canonical: './policy.md' }));
  const markdown = documentIndexMarkdown(buildDocumentGraph(root));
  assert.ok(markdown.includes('[Policy \\| Scope](./01-Foundation/policy.md)'));
});

test('document graph only assigns decision identifiers to RFC and ADR records', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-graph-'));
  const policy = document({ title: 'Policy', canonical: './policy.md' })
    .replace('canonical: ./policy.md', 'rfc: RFC-9999\nadr: ADR-9999\ncanonical: ./policy.md');
  write(root, '01-Foundation/policy.md', policy);
  const graph = buildDocumentGraph(root);
  assert.equal(graph.documents[0].identifier, null);
  assert.match(documentIndexMarkdown(graph), /- Decision records: 0/);
});

test('document graph highlights RFC and ADR decision records', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-graph-'));
  const adr = document({ title: 'Storage Decision', canonical: './0001-storage.md' })
    .replace('type: governance-policy', 'type: architecture/adr')
    .replace('canonical: ./0001-storage.md', 'adr: ADR-0001\ndecision_scope: storage-engine\ncanonical: ./0001-storage.md');
  write(root, '05-Knowledge/adr/0001-storage.md', adr);
  const markdown = documentIndexMarkdown(buildDocumentGraph(root), { outputFile: path.join(root, 'docs', 'DOCUMENT-INDEX.md') });
  assert.match(markdown, /- Decision records: 1/);
  assert.match(markdown, /\| \[ADR-0001\]\(\.\.\/05-Knowledge\/adr\/0001-storage\.md\) \| storage-engine \| architecture\/adr \| Active \|/);
});

test('docs-index --check detects generated index drift', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-index-'));
  const out = path.join(root, 'docs', 'DOCUMENT-INDEX.md');
  write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md' }));
  const args = [path.join(packageRoot, 'bin', 'moonweave-skills.mjs'), 'docs-index', '--root', root, '--out', out];
  assert.equal(spawnSync(process.execPath, args, { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync(process.execPath, [...args, '--check'], { encoding: 'utf8' }).status, 0);
  fs.appendFileSync(out, '\nstale\n');
  const stale = spawnSync(process.execPath, [...args, '--check'], { encoding: 'utf8' });
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /Document index is out of date/);
});

test('JSON indexes are independent of the checkout path', () => {
  const firstRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-index-a-'));
  const secondRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-index-b-'));
  const out = path.join(firstRoot, 'document-index.json');
  for (const root of [firstRoot, secondRoot]) {
    write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md' }));
  }
  const cli = path.join(packageRoot, 'bin', 'moonweave-skills.mjs');
  const generated = spawnSync(process.execPath, [cli, 'docs-index', '--root', firstRoot, '--format', 'json', '--out', out], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const checked = spawnSync(process.execPath, [cli, 'docs-index', '--root', secondRoot, '--format', 'json', '--out', out, '--check'], { encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
  assert.equal(JSON.parse(fs.readFileSync(out, 'utf8')).root, undefined);
});

test('docs-index can generate package-safe repository links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-index-'));
  write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md' }));
  const markdown = documentIndexMarkdown(buildDocumentGraph(root), {
    outputFile: path.join(root, 'docs', 'DOCUMENT-INDEX.md'),
    baseUrl: 'https://github.com/Moonweave-AI/governance/blob/main/',
  });
  assert.ok(markdown.includes('[Policy](https://github.com/Moonweave-AI/governance/blob/main/01-Foundation/policy.md)'));
});

test('docs-index release base URL pins package links to the package version tag', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-index-'));
  const out = path.join(root, 'docs', 'DOCUMENT-INDEX.md');
  write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md' }));
  const cli = path.join(packageRoot, 'bin', 'moonweave-skills.mjs');
  const generated = spawnSync(process.execPath, [cli, 'docs-index', '--root', root, '--out', out, '--base-url', 'release'], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  assert.match(fs.readFileSync(out, 'utf8'), new RegExp(`\\]\\(https://github\\.com/Moonweave-AI/governance/blob/v${packageJson.version}/`));
});

test('the packaged document index has no package-escaping relative links', () => {
  const markdown = fs.readFileSync(path.join(packageRoot, 'docs', 'DOCUMENT-INDEX.md'), 'utf8');
  assert.doesNotMatch(markdown, /\]\(\.\.\/\.\.\//);
  assert.match(markdown, new RegExp(`\\]\\(https://github\\.com/Moonweave-AI/governance/blob/v${packageJson.version}/`));
});

test('atlas keeps one hot canonical row and hides translations and superseded records', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-atlas-'));
  const current = document({ title: 'Policy', canonical: './policy.md', related: '[./old.md]' }).replace('supersedes: []', 'supersedes: [./old.md]');
  const old = document({ title: 'Old Policy', canonical: './old.md', related: '[./policy.md]' })
    .replace('status: Active', 'status: Superseded')
    .replace('superseded_by: []', 'superseded_by: [./policy.md]');
  const translation = document({ title: '方針', canonical: '../policy.md' });
  write(root, '01-Foundation/policy.md', current);
  write(root, '01-Foundation/old.md', old);
  write(root, '01-Foundation/ja/policy.md', translation);
  const graph = buildDocumentGraph(root);
  const atlas = documentAtlasMarkdown(graph);
  const [hot] = atlas.split('## Cold');
  assert.equal(graph.summary.hot_canonical, 1);
  assert.equal(graph.summary.translations, 1);
  assert.match(hot, /\[Policy\]/);
  assert.doesNotMatch(hot, /Old Policy/);
  assert.doesNotMatch(atlas, /方針/);
  assert.match(atlas, /## Cold Records/);
  const neighborhood = documentNeighborhoodMarkdown(graph, '01-Foundation/policy.md');
  assert.match(neighborhood, /supersedes/);
  assert.match(neighborhood, /Old Policy/);
  assert.match(neighborhood, /01-Foundation\/ja\/policy\.md/);
  assert.ok(atlas.length < documentIndexMarkdown(graph).length);
});

test('atlas omits generated labels that only repeat the document title', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-atlas-label-'));
  const policy = document({ title: 'Policy', canonical: './policy.md' })
    .replace('summary: This document describes the authoritative Policy governance policy.', 'summary: Authoritative governance policy: Policy.');
  write(root, '01-Foundation/policy.md', policy);
  const atlas = documentAtlasMarkdown(buildDocumentGraph(root));
  assert.match(atlas, /\| - \|$/m);
  assert.doesNotMatch(atlas, /Authoritative governance policy/);
});

test('change atlas links each release to the previous release', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-changes-'));
  write(root, '01-Foundation/policy.md', document({ title: 'Policy', canonical: './policy.md' }));
  write(root, 'governance-skills/CHANGELOG.md', [
    '# Changelog',
    '',
    '## 0.2.5 — 2026-11-02',
    '',
    '- Bounded atlas.',
    '',
    '## 0.2.4 — 2026-08-06',
    '',
    '- Previous release.',
    '',
  ].join('\n'));
  const versions = parseChangelog(fs.readFileSync(path.join(root, 'governance-skills/CHANGELOG.md'), 'utf8'));
  assert.deepEqual(versions.map((version) => version.version), ['0.2.5', '0.2.4']);
  const markdown = changeAtlasMarkdown(buildDocumentGraph(root));
  assert.match(markdown, /0250\["0\.2\.5"\]/);
  assert.match(markdown, /0250 --> 0241/);
  assert.match(markdown, /\| 0\.2\.5 \| 2026-11-02 \| 0\.2\.4 \|/);
});
