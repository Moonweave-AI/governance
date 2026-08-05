import test from 'node:test';
import assert from 'node:assert/strict';
import { packageRoot } from '../lib/config.mjs';
import { lintReleaseMetadata } from '../lib/release-lint.mjs';

test('all published version declarations match package.json', () => {
  const report = lintReleaseMetadata(packageRoot);
  assert.equal(report.summary.errors, 0, JSON.stringify(report.findings, null, 2));
});
