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
  const parent = ['ja', 'zh'].includes(language) ? path.dirname(path.dirname(file)) : path.dirname(file);
  const prefix = ['ja', 'zh'].includes(language) ? '../en' : './en';
  const english = path.join(parent, 'en', path.basename(file));
  return fs.existsSync(english) ? `${prefix}/${path.basename(file)}` : `./${path.basename(file)}`;
}
function yamlValue(value) {
  if (Array.isArray(value)) return `[${value.map((item) => yaml(item)).join(', ')}]`;
  return yaml(value);
}
function render(data, existing = {}) {
  const defaults = {
    type: data.type, status: 'Active', owner: 'Moonweave AI Governance Maintainers', created: '2026-07-22', updated: today,
    last_reviewed: today, summary: data.summary, canonical: data.canonical, related: [], supersedes: [], superseded_by: [],
  };
  const metadata = { ...defaults, ...Object.fromEntries(Object.entries(existing).filter(([, value]) => !(typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0))) };
  const ordered = ['type', 'status', 'owner', 'created', 'updated', 'last_reviewed', 'summary', 'canonical', 'related', 'supersedes', 'superseded_by'];
  const lines = ['---'];
  for (const key of ordered) lines.push(`${key}: ${yamlValue(metadata[key])}`);
  for (const [key, value] of Object.entries(metadata)) if (!ordered.includes(key)) lines.push(`${key}: ${yamlValue(value)}`);
  return [...lines, '---', ''].join('\n');
}

let changed = 0;
for (const dir of GOVERNANCE_DOCUMENT_ROOTS) {
  for (const file of walkFiles(path.join(root, dir)).filter((item) => item.endsWith('.md'))) {
    const current = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontmatter(current);
    const body = parsed.error ? current : parsed.body.replace(/^\n/, '');
    const title = titleFor(body, file);
    const existing = parsed.error ? {} : { ...parsed.data };
    delete existing.review_cycle_days;
    const computedCanonical = canonicalFor(file);
    if (computedCanonical !== `./${path.basename(file)}` && existing.canonical === `./${path.basename(file)}`) delete existing.canonical;
    const metadata = render({ type: typeFor[dir], summary: `Authoritative ${typeFor[dir].replace('-', ' ')}: ${title}.`, canonical: computedCanonical }, existing);
    const next = `${metadata}${body}`;
    if (next !== current) {
      fs.writeFileSync(file, next, 'utf8');
      changed += 1;
    }
  }
}
process.stdout.write(`Normalized metadata for ${changed} governance documents.\n`);
