#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { walkFiles } from '../lib/fs-utils.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || path.join(scriptDir, '..'));
const reviewed = process.env.DOCUMENT_REVIEW_DATE || new Date().toISOString().slice(0, 10);
let changed = 0;

for (const file of walkFiles(path.join(root, 'skills')).filter((item) => path.basename(item) === 'SKILL.md')) {
  const current = fs.readFileSync(file, 'utf8');
  const normalized = current.replaceAll('\r\n', '\n');
  if (!normalized.startsWith('---\n')) throw new Error(`Missing frontmatter: ${file}`);
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) throw new Error(`Unclosed frontmatter: ${file}`);
  let frontmatter = normalized.slice(0, end + 5);
  if (!/^status:/m.test(frontmatter)) frontmatter = frontmatter.replace('\nlicense:', `\nstatus: Active\nlast_reviewed: ${reviewed}\nlicense:`);
  else if (!/^last_reviewed:/m.test(frontmatter)) frontmatter = frontmatter.replace('\nstatus:', `\nlast_reviewed: ${reviewed}\nstatus:`);
  const next = `${frontmatter}${normalized.slice(end + 5)}`;
  if (next !== current) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}
process.stdout.write(`Normalized metadata for ${changed} skill documents.\n`);
