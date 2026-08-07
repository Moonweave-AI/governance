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
  const inline = valid.replace('related: []', 'related: [https://example.com/policy]');
  write(root, '01-Foundation/en/policy.md', inline);
  assert.equal(lintDocuments(root).summary.errors, 0);

  const invalid = valid.replace('status: Active', 'status: Superseded').replace('created: 2026-07-22', 'created: 2026-13-99').replace('summary: This is a sufficiently descriptive governance policy summary.', 'summary: short');
  write(root, '01-Foundation/en/policy.md', invalid);
  const findings = lintDocuments(root).findings;
  assert.ok(findings.some((item) => item.id === 'invalid-document-date'));
  assert.ok(findings.some((item) => item.id === 'invalid-summary-length'));
  assert.ok(findings.some((item) => item.id === 'missing-replacement'));
});

test('document lint enforces reciprocal related and supersession links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const successor = valid
    .replaceAll('./policy.md', './new.md')
    .replace('related: []', 'related: [./context.md]')
    .replace('supersedes: []', 'supersedes: [./old.md]');
  const old = valid
    .replaceAll('./policy.md', './old.md')
    .replace('status: Active', 'status: Superseded')
    .replace('superseded_by: []', 'superseded_by: [./new.md]');
  const context = valid
    .replaceAll('./policy.md', './context.md')
    .replace('related: []', 'related: [./new.md]');
  write(root, '01-Foundation/en/new.md', successor);
  write(root, '01-Foundation/en/old.md', old);
  write(root, '01-Foundation/en/context.md', context);
  assert.equal(lintDocuments(root).summary.errors, 0);

  write(root, '01-Foundation/en/context.md', context.replace('related: [./new.md]', 'related: []'));
  assert.ok(lintDocuments(root).findings.some((item) => item.id === 'missing-reciprocal-relation'));

  write(root, '01-Foundation/en/context.md', context);
  write(root, '01-Foundation/en/new.md', successor.replace('superseded_by: []', 'superseded_by: [./old.md]'));
  write(root, '01-Foundation/en/old.md', old.replace('supersedes: []', 'supersedes: [./new.md]'));
  assert.ok(lintDocuments(root).findings.some((item) => item.id === 'supersession-cycle'));
});

test('document lint rejects isolated and disconnected governance documents', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const first = valid.replaceAll('./policy.md', './first.md');
  const second = valid.replaceAll('./policy.md', './second.md');
  write(root, '01-Foundation/en/first.md', first);
  write(root, '01-Foundation/en/second.md', second);
  const findings = lintDocuments(root).findings;
  assert.equal(findings.filter((item) => item.id === 'orphan-document').length, 2);
  assert.equal(findings.filter((item) => item.id === 'disconnected-document-graph').length, 1);

  write(root, '01-Foundation/en/first.md', first.replace('related: []', 'related: [./second.md]'));
  write(root, '01-Foundation/en/second.md', second.replace('related: []', 'related: [./first.md]'));
  assert.equal(lintDocuments(root).summary.errors, 0);
});

test('document lint rejects missing relation targets and duplicate decision identifiers', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const rfc = valid
    .replace('type: governance-policy', 'type: engineering/rfc')
    .replace('canonical: ./policy.md', 'rfc: RFC-0001\ndecision_scope: shared-protocol\ncanonical: ./first.md')
    .replace('related: []', 'related: [./missing.md]');
  write(root, '03-Collaboration/first.md', rfc);
  write(root, '03-Collaboration/second.md', rfc.replaceAll('./first.md', './second.md'));
  const findings = lintDocuments(root).findings;
  assert.ok(findings.some((item) => item.id === 'missing-document-relation-target'));
  assert.equal(findings.filter((item) => item.id === 'duplicate-document-identifier').length, 2);
});

test('document lint rejects overlapping live decisions with the same scope', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const first = valid
    .replace('type: governance-policy', 'type: engineering/rfc')
    .replace('canonical: ./policy.md', 'rfc: RFC-0001\ndecision_scope: memory-protocol\ncanonical: ./first.md');
  const second = first.replace('RFC-0001', 'RFC-0002').replaceAll('./first.md', './second.md');
  write(root, '03-Collaboration/first.md', first);
  write(root, '03-Collaboration/second.md', second);
  const findings = lintDocuments(root).findings;
  assert.equal(findings.filter((item) => item.id === 'overlapping-decision-scope').length, 2);
});

test('document lint requires RFC and ADR records in one decision scope to link', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-doc-lint-'));
  const rfc = valid
    .replace('type: governance-policy', 'type: engineering/rfc')
    .replace('canonical: ./policy.md', 'rfc: RFC-0001\ndecision_scope: storage-engine\ncanonical: ./rfc.md');
  const adr = valid
    .replace('type: governance-policy', 'type: architecture/adr')
    .replace('canonical: ./policy.md', 'adr: ADR-0001\ndecision_scope: storage-engine\ncanonical: ./adr.md');
  write(root, '03-Collaboration/rfc.md', rfc);
  write(root, '05-Knowledge/adr/adr.md', adr);
  assert.ok(lintDocuments(root).findings.some((item) => item.id === 'missing-decision-chain-link'));

  write(root, '03-Collaboration/rfc.md', rfc.replace('related: []', 'related: [../05-Knowledge/adr/adr.md]'));
  write(root, '05-Knowledge/adr/adr.md', adr.replace('related: []', 'related: [../../03-Collaboration/rfc.md]'));
  assert.equal(lintDocuments(root).summary.errors, 0);
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
