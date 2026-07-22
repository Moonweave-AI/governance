import test from 'node:test';
import assert from 'node:assert/strict';
import { lintSkills } from '../lib/skill-lint.mjs';

test('all bundled skills pass hard lint rules', () => {
  const report = lintSkills();
  assert.equal(report.summary.skills, 25);
  assert.equal(report.summary.errors, 0, JSON.stringify(report.findings, null, 2));
});
