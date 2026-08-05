#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkFiles } from '../lib/fs-utils.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || path.join(scriptDir, '..'));
const REQUIRED = [
  ['type', (file) => path.basename(file, '.md')], ['status', () => 'Draft'], ['owner', () => ''],
  ['created', () => ''], ['updated', () => ''], ['last_reviewed', () => ''], ['review_cycle_days', () => '180'],
  ['summary', () => ''], ['canonical', () => ''], ['related', () => '[]'], ['supersedes', () => '[]'], ['superseded_by', () => '[]'],
];

let changed = 0;
for (const file of walkFiles(path.join(root, 'templates')).filter((item) => item.endsWith('.md'))) {
  const current = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const end = current.startsWith('---\n') ? current.indexOf('\n---\n', 4) : -1;
  let frontmatter = end < 0 ? '---\n---\n' : current.slice(0, end + 5);
  const heading = current.search(/^#\s/m);
  const body = end < 0 ? (current.startsWith('---\n') && heading >= 0 ? current.slice(heading) : current) : current.slice(end + 5);
  for (const [key, fallback] of REQUIRED) {
    if (!new RegExp(`^${key}:`, 'm').test(frontmatter)) frontmatter = frontmatter.replace('\n---\n', `\n${key}: ${fallback(file)}\n---\n`);
  }
  const next = `${frontmatter}${body}`;
  if (next !== current) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}
process.stdout.write(`Normalized metadata for ${changed} templates.\n`);
