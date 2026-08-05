#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { GOVERNANCE_DOCUMENT_ROOTS } from '../lib/document-lint.mjs';
import { parseFrontmatter } from '../lib/frontmatter.mjs';
import { walkFiles } from '../lib/fs-utils.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || path.join(scriptDir, '..', '..'));
const today = process.env.DOCUMENT_REVIEW_DATE || new Date().toISOString().slice(0, 10);
const typeFor = {
  '01-Foundation': 'governance-policy',
  '02-Governance': 'governance-policy',
  '03-Collaboration': 'governance-process',
  '04-Engineering': 'engineering-policy',
  '05-Knowledge': 'knowledge-policy',
  '06-Glossary': 'glossary',
};

function yaml(value) { return JSON.stringify(String(value)); }
function titleFor(body, file) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(file, '.md');
}
function canonicalFor(file) {
  const language = path.basename(path.dirname(file));
  if (language === 'en') return `./${path.basename(file)}`;
  const english = path.join(path.dirname(path.dirname(file)), 'en', path.basename(file));
  return fs.existsSync(english) ? `../en/${path.basename(file)}` : `./${path.basename(file)}`;
}
function render(data) {
  return ['---', `type: ${data.type}`, 'status: Active', 'owner: Moonweave AI Governance Maintainers', 'created: 2026-07-22', `updated: ${today}`, `last_reviewed: ${today}`, 'review_cycle_days: 180', `summary: ${yaml(data.summary)}`, `canonical: ${data.canonical}`, 'related: []', 'supersedes: []', 'superseded_by: []', '---', ''].join('\n');
}

let changed = 0;
for (const dir of GOVERNANCE_DOCUMENT_ROOTS) {
  for (const file of walkFiles(path.join(root, dir)).filter((item) => item.endsWith('.md'))) {
    const current = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontmatter(current);
    const body = parsed.error ? current : parsed.body.replace(/^\n/, '');
    const title = titleFor(body, file);
    const metadata = render({ type: typeFor[dir], summary: `Authoritative ${typeFor[dir].replace('-', ' ')}: ${title}.`, canonical: canonicalFor(file) });
    const next = `${metadata}${body}`;
    if (next !== current) {
      fs.writeFileSync(file, next, 'utf8');
      changed += 1;
    }
  }
}
process.stdout.write(`Normalized metadata for ${changed} governance documents.\n`);
