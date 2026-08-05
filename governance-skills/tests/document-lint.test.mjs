import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lintDocuments, lintTemplates } from '../lib/document-lint.mjs';

function write(root, relative, text) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

const valid = [
  '---', 'type: governance-policy', 'status: Active', 'owner: Governance',
  'created: 2026-07-22', 'updated: 2026-08-05', 'last_reviewed: 2026-08-05',
  'summary: This is a sufficiently descriptive governance policy summary.',
  'canonical: ./policy.md', 'related: []', 'supersedes: []', 'superseded_by: []', '---', '# Policy', '',
].join('\n');

test('document lint accepts complete authoritative metadata', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  write(root, '01-Foundation/en/policy.md', valid);
  const report = lintDocuments(root);
  assert.equal(report.summary.documents, 1);
  assert.equal(report.summary.errors, 0, JSON.stringify(report.findings, null, 2));
});

test('document lint rejects missing metadata and invalid chronology', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const invalid = valid.replace('updated: 2026-08-05', 'updated: 2026-07-01').replace('last_reviewed: 2026-08-05', 'last_reviewed: 2026-06-01').replace('owner: Governance\n', '');
  write(root, '01-Foundation/en/policy.md', invalid);
  const report = lintDocuments(root);
  assert.ok(report.findings.some((item) => item.id === 'missing-document-metadata'));
  assert.ok(report.findings.some((item) => item.id === 'updated-before-created'));
  assert.ok(report.findings.some((item) => item.id === 'review-before-update'));
});

test('document lint enforces semantic metadata constraints and accepts inline lists', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const inline = valid.replace('related: []', 'related: [./policy.md]').replace('supersedes: []', 'supersedes: [./older.md]');
  write(root, '01-Foundation/en/policy.md', inline);
  assert.equal(lintDocuments(root).summary.errors, 0);

  const invalid = valid.replace('status: Active', 'status: Superseded').replace('created: 2026-07-22', 'created: 2026-13-99').replace('summary: This is a sufficiently descriptive governance policy summary.', 'summary: short');
  write(root, '01-Foundation/en/policy.md', invalid);
  const findings = lintDocuments(root).findings;
  assert.ok(findings.some((item) => item.id === 'invalid-document-date'));
  assert.ok(findings.some((item) => item.id === 'invalid-summary-length'));
  assert.ok(findings.some((item) => item.id === 'missing-replacement'));
});

test('document lint rejects types absent from the controlled vocabulary', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  write(root, '01-Foundation/en/policy.md', valid.replace('type: governance-policy', 'type: made-up-policy'));
  assert.ok(lintDocuments(root).findings.some((item) => item.id === 'invalid-document-type'));
});

test('template lint rejects types absent from the controlled vocabulary', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-template-lint-'));
  write(root, 'templates/example.md', valid.replace('type: governance-policy', 'type: made-up-template'));
  assert.ok(lintTemplates(root).findings.some((item) => item.id === 'invalid-template-type'));
});
