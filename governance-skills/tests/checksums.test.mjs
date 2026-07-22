import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateChecksums } from '../lib/installer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

test('published checksum manifest excludes package-lock and verifies every listed file', () => {
  const out = path.join(root, 'checksums.test.sha256');
  try {
    generateChecksums(out);
    const lines = fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean);
    assert.ok(lines.length > 400);
    assert.ok(!lines.some((line) => line.endsWith('  package-lock.json')));
    for (const line of lines) {
      const match = line.match(/^([a-f0-9]{64})  (.+)$/);
      assert.ok(match, `invalid checksum line: ${line}`);
      const [, expected, rel] = match;
      const file = path.join(root, rel);
      assert.ok(fs.existsSync(file), `missing checksum target: ${rel}`);
      assert.equal(sha256(file), expected, `checksum mismatch: ${rel}`);
    }
  } finally {
    fs.rmSync(out, { force: true });
  }
});
