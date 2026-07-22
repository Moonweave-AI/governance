import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { doctor, install, uninstall } from '../lib/installer.mjs';

test('installs all project adapters in copy mode and uninstalls owned files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-skills-install-'));
  const result = install({ root, agents: 'all', scope: 'project', mode: 'copy', profile: 'ai-agent', withGithub: true });
  assert.equal(result.skills, 23);
  assert.ok(fs.existsSync(path.join(root, '.cursor', 'skills', 'moonweave-code-review', 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(root, '.claude', 'skills', 'moonweave-rfc', 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(root, '.opencode', 'commands', 'mw-review.md')));
  assert.ok(fs.existsSync(path.join(root, 'AGENTS.md'))); // Kilo project rules use AGENTS.md
  assert.ok(fs.existsSync(path.join(root, '.agents', 'rules', 'moonweave-governance.md')));
  assert.ok(fs.existsSync(path.join(root, 'CLAUDE.md')));
  assert.ok(fs.existsSync(path.join(root, '.moonweave', 'skills-lock.json')));
  assert.ok(fs.existsSync(path.join(root, '.github', 'workflows', 'moonweave-governance-audit.yml')));

  const report = doctor(root);
  assert.equal(report.summary.fail, 0);

  const removed = uninstall(root);
  assert.equal(removed.preserved.length, 0);
  assert.ok(!fs.existsSync(path.join(root, '.cursor', 'skills', 'moonweave-code-review')));
});

test('does not overwrite an existing skill without force', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-skills-existing-'));
  const target = path.join(root, '.cursor', 'skills', 'moonweave-rfc');
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'SKILL.md'), 'custom', 'utf8');
  install({ root, agents: 'cursor', scope: 'project', mode: 'copy' });
  assert.equal(fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8'), 'custom');
});

test('symlink mode installs stable links and safely removes them', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-skills-symlink-'));
  const result = install({ root, agents: 'cursor', scope: 'project', mode: 'symlink' });
  assert.equal(result.skills, 23);
  const target = path.join(root, '.cursor', 'skills', 'moonweave-rfc');
  assert.ok(fs.lstatSync(target).isSymbolicLink());
  const removed = uninstall(root);
  assert.equal(removed.preserved.length, 0);
  assert.ok(!fs.existsSync(target));
});

test('uninstall preserves user-modified copied skills', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-skills-preserve-'));
  install({ root, agents: 'cursor', scope: 'project', mode: 'copy' });
  const target = path.join(root, '.cursor', 'skills', 'moonweave-rfc', 'SKILL.md');
  fs.appendFileSync(target, '\nUser customization\n', 'utf8');
  const removed = uninstall(root);
  assert.ok(removed.preserved.some((item) => item === path.dirname(target)));
  assert.ok(fs.existsSync(target));
});
