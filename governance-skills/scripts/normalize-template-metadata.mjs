#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkFiles } from '../lib/fs-utils.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || path.join(scriptDir, '..'));
const typeRegistry = JSON.parse(fs.readFileSync(path.join(scriptDir, '..', 'core', 'document-type-registry.json'), 'utf8'));
const DOCUMENT_TYPES = new Set(typeRegistry.$defs.type.oneOf.map((entry) => entry.const));
const TEMPLATE_TYPES = {
  'adr': 'architecture/adr', 'agent-behavior-record': 'agent/behavior-record', 'asset-record': 'knowledge/asset-record',
  'dataset-card': 'knowledge/dataset-card', 'discovery-brief': 'planning/discovery', 'engineering-brief': 'engineering/brief',
  'handoff': 'collaboration/handoff', 'hazard-analysis': 'security/hazard-analysis', 'idea': 'planning/idea',
  'incident': 'operations/incident', 'issue': 'collaboration/issue', 'model-card': 'knowledge/model-card',
  'paper-review': 'knowledge/paper-review', 'postmortem': 'operations/postmortem', 'prototype': 'engineering/prototype',
  'pull-request': 'collaboration/pull-request', 'quality-declaration': 'quality/declaration', 'quality-exception': 'quality/exception',
  'release-quality-report': 'quality/release-report', 'research-log': 'knowledge-policy/research-logs', 'rfc': 'engineering/rfc',
  'runbook': 'operations/runbook', 'test-plan': 'quality/test-plan', 'threat-model': 'security/threat-model',
};
const REQUIRED = [
  ['type', (file) => path.basename(file, '.md')], ['status', () => 'Draft'], ['owner', () => '<owner>'],
  ['created', () => '<date>'], ['updated', () => '<date>'], ['last_reviewed', () => '<date>'],
  ['summary', () => ''], ['canonical', () => ''], ['related', () => '[]'], ['supersedes', () => '[]'], ['superseded_by', () => '[]'],
];

let changed = 0;
for (const file of walkFiles(path.join(root, 'templates')).filter((item) => item.endsWith('.md'))) {
  const current = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const end = current.startsWith('---\n') ? current.indexOf('\n---\n', 4) : -1;
  let frontmatter = end < 0 ? '---\n---\n' : current.slice(0, end + 5);
  const expectedType = TEMPLATE_TYPES[path.basename(file, '.md')];
  if (!DOCUMENT_TYPES.has(expectedType)) throw new Error(`Template type is not registered: ${expectedType}`);
  frontmatter = /^type:/m.test(frontmatter) ? frontmatter.replace(/^type:.*$/m, `type: ${expectedType}`) : frontmatter.replace('\n---\n', `\ntype: ${expectedType}\n---\n`);
  frontmatter = frontmatter.replace(/^review_cycle_days:.*\n/gm, '');
  const heading = current.search(/^#\s/m);
  const body = end < 0 ? (current.startsWith('---\n') && heading >= 0 ? current.slice(heading) : current) : current.slice(end + 5);
  for (const [key, fallback] of REQUIRED) {
    const missing = !new RegExp(`^${key}:`, 'm').test(frontmatter);
    const placeholder = ['owner', 'created', 'updated', 'last_reviewed'].includes(key) && new RegExp(`^${key}:\s*$`, 'm').test(frontmatter);
    if (missing) frontmatter = frontmatter.replace('\n---\n', `\n${key}: ${fallback(file)}\n---\n`);
    else if (placeholder) frontmatter = frontmatter.replace(new RegExp(`^${key}:\s*$`, 'm'), `${key}: ${fallback(file)}`);
  }
  const next = `${frontmatter}${body}`;
  if (next !== current) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}
process.stdout.write(`Normalized metadata for ${changed} templates.\n`);
