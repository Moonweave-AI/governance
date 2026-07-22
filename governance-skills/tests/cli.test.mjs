import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'moonweave-skills.mjs');

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8' });
}

test('CLI lists package content', () => {
  const result = run(['list', '--format', 'json']);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.skills.length, 25);
});

test('CLI route emits machine-readable stop ship result', () => {
  const result = run(['route', '--text', 'Agent 自动写生产数据库且无需人工确认', '--format', 'json']);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.stop_ship, true);
  assert.equal(data.risk, 'S4');
});

test('CLI static eval passes', () => {
  const result = run(['eval-static', '--format', 'json']);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.failed, 0);
});
