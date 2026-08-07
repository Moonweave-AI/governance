import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildDocumentGraph, documentIndexMarkdown } from '../lib/document-graph.mjs';

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
  assert.deepEqual(graph.summary, { documents: 2, canonical_records: 2, relations: 2, skill_links: 0 });
  assert.match(markdown, /\[Policy\]\(\.\.\/01-Foundation\/policy\.md\)/);
  assert.match(markdown, /## Decision Records\n\nNo RFC or ADR records are registered\./);
  assert.match(markdown, /## All Documents/);
  assert.match(markdown, /\| Document \| Type \| Decision scope \|/);
  assert.match(markdown, /related: \[Process\]\(\.\.\/02-Governance\/process\.md\)/);
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
