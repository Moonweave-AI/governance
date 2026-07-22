import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditRepository } from '../lib/audit.mjs';

test('reports governance gaps without executing project code', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-audit-gap-'));
  fs.writeFileSync(path.join(root, 'package.json'), '{"scripts":{"postinstall":"exit 99"}}', 'utf8');
  const report = auditRepository(root, { profile: 'library' });
  assert.ok(report.findings.some((x) => x.id === 'MW-BASE-README'));
  assert.ok(report.findings.some((x) => x.id === 'MW-CI-MISSING'));
});

test('detects and redacts a secret', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-audit-secret-'));
  fs.writeFileSync(path.join(root, 'README.md'), '# Demo\nStatus: Experimental\nOwner: team\n', 'utf8');
  const syntheticSecret = ['abcdefghijklmnop', '1234567890'].join('');
  const assignmentName = ['api', 'key'].join('_');
  fs.writeFileSync(path.join(root, 'config.txt'), `${assignmentName}="${syntheticSecret}"\n`, 'utf8');
  const report = auditRepository(root, { profile: 'docs' });
  const finding = report.findings.find((x) => x.severity === 'blocker');
  assert.ok(finding);
  assert.ok(!finding.evidence.includes(syntheticSecret));
});

test('embodied profile blocks missing hazard and e-stop evidence', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-audit-embodied-'));
  fs.writeFileSync(path.join(root, 'README.md'), '# Robot\nStatus: Experimental\nOwner: team\n', 'utf8');
  const report = auditRepository(root, { profile: 'embodied' });
  assert.ok(report.findings.some((x) => x.id === 'MW-EMB-HAZARD' && x.severity === 'blocker'));
  assert.ok(report.findings.some((x) => x.id === 'MW-EMB-SAFETY-CONTROLS' && x.severity === 'blocker'));
});
