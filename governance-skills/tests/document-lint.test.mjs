import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lintDocuments } from '../lib/document-lint.mjs';

function write(root, relative, text) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

const valid = [
  '---', 'type: governance-policy', 'status: Active', 'owner: Governance',
  'created: 2026-07-22', 'updated: 2026-08-05', 'last_reviewed: 2026-08-05',
  'review_cycle_days: 180', 'summary: This is a sufficiently descriptive governance policy summary.',
  'canonical: ./policy.md', 'supersedes: []', 'superseded_by: []', '---', '# Policy', '',
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
