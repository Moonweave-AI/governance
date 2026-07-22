import fs from 'node:fs';
import path from 'node:path';
import { packageRoot } from './config.mjs';

const aliases = {
  idea: 'idea.md',
  discovery: 'discovery-brief.md',
  prototype: 'prototype.md',
  brief: 'engineering-brief.md',
  'engineering-brief': 'engineering-brief.md',
  rfc: 'rfc.md',
  adr: 'adr.md',
  issue: 'issue.md',
  pr: 'pull-request.md',
  'pull-request': 'pull-request.md',
  'test-plan': 'test-plan.md',
  quality: 'quality-declaration.md',
  'quality-declaration': 'quality-declaration.md',
  release: 'release-quality-report.md',
  research: 'research-log.md',
  'research-log': 'research-log.md',
  'paper-review': 'paper-review.md',
  'dataset-card': 'dataset-card.md',
  'model-card': 'model-card.md',
  'agent-card': 'agent-behavior-record.md',
  'agent-behavior-record': 'agent-behavior-record.md',
  runbook: 'runbook.md',
  incident: 'incident.md',
  postmortem: 'postmortem.md',
  handoff: 'handoff.md',
  asset: 'asset-record.md',
  'asset-record': 'asset-record.md',
  'threat-model': 'threat-model.md',
  'hazard-analysis': 'hazard-analysis.md',
  exception: 'quality-exception.md',
  'quality-exception': 'quality-exception.md',
};

export function templateNames() {
  return Object.keys(aliases).sort();
}

export function renderTemplate(name, options = {}) {
  const file = aliases[name];
  if (!file) throw new Error(`Unknown template: ${name}. Available templates: ${templateNames().join(', ')}`);
  const source = path.join(packageRoot, 'templates', file);
  let content = fs.readFileSync(source, 'utf8');
  const title = options.title || '<title>';
  content = content.replaceAll('<title>', title).replaceAll('<标题>', title).replaceAll('{{title}}', title);
  const now = options.date || new Date().toISOString().slice(0, 10);
  content = content.replaceAll('{{date}}', now).replaceAll('<date>', now).replaceAll('<日期>', now);
  if (options.owner) content = content.replaceAll('<Owner>', options.owner).replaceAll('<owner>', options.owner).replaceAll('{{owner}}', options.owner);
  return { file, content };
}
