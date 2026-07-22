#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const repoRoot = path.resolve(root, '..');
const errors = [];
const checks = [];
const pass = (name, detail = '') => checks.push({ status: 'PASS', name, detail });
const fail = (name, detail) => { checks.push({ status: 'FAIL', name, detail }); errors.push(`${name}: ${detail}`); };
// Marketplace manifests live at the governance repo root (repoRoot); plugin
// internals and skills live under governance-skills/ (root).
function readRoot(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(repoRoot, rel), 'utf8')); }
  catch (error) { fail(`JSON ${rel}`, error.message); return null; }
}
function read(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
  catch (error) { fail(`JSON ${rel}`, error.message); return null; }
}
function existsRoot(rel, label = rel) {
  if (fs.existsSync(path.join(repoRoot, rel))) pass(label, rel);
  else fail(label, `missing ${rel}`);
}
function exists(rel, label = rel) {
  if (fs.existsSync(path.join(root, rel))) pass(label, rel);
  else fail(label, `missing ${rel}`);
}
function noSymlinks(rel) {
  const start = path.join(root, rel);
  let found = [];
  function walk(p) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isSymbolicLink()) found.push(path.relative(root, full));
      else if (entry.isDirectory()) walk(full);
    }
  }
  walk(start);
  if (found.length) fail(`No symlinks ${rel}`, found.join(', ')); else pass(`No symlinks ${rel}`);
}

const skillDirs = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
if (skillDirs.length === 23) pass('Portable skill count', '23'); else fail('Portable skill count', String(skillDirs.length));
for (const name of skillDirs) exists(`skills/${name}/SKILL.md`, `Skill ${name}`);

const kilo = read('skills/index.json');
if (kilo) {
  const names = (kilo.skills || []).map((s) => s.name).sort();
  if (JSON.stringify(names) === JSON.stringify(skillDirs)) pass('Kilo index names'); else fail('Kilo index names', 'index does not match skills/');
  for (const item of kilo.skills || []) {
    if (!(item.files || []).includes('SKILL.md')) fail(`Kilo ${item.name}`, 'SKILL.md missing from files');
    for (const file of item.files || []) exists(`skills/${item.name}/${file}`, `Kilo file ${item.name}/${file}`);
  }
}

const claudeMarket = readRoot('.claude-plugin/marketplace.json');
if (claudeMarket) {
  const plugin = claudeMarket.plugins?.[0];
  if (plugin?.source === './governance-skills/plugins/claude/moonweave-governance') pass('Claude marketplace source'); else fail('Claude marketplace source', String(plugin?.source));
}
const claudeManifest = read('plugins/claude/moonweave-governance/.claude-plugin/plugin.json');
if (claudeManifest?.name === 'moonweave-governance') pass('Claude plugin manifest'); else fail('Claude plugin manifest', 'invalid name');

const cursorMarket = readRoot('.cursor-plugin/marketplace.json');
if (cursorMarket?.plugins?.[0]?.source === './governance-skills/plugins/cursor/moonweave-governance') pass('Cursor marketplace source'); else fail('Cursor marketplace source', 'invalid source');
const cursorManifest = read('plugins/cursor/moonweave-governance/.cursor-plugin/plugin.json');
if (cursorManifest?.version === pkg.version) pass('Cursor plugin version'); else fail('Cursor plugin version', String(cursorManifest?.version));

const codexMarket = readRoot('.agents/plugins/marketplace.json');
const codexEntry = codexMarket?.plugins?.[0];
if (codexEntry?.source?.source === 'local' && codexEntry?.source?.path === './governance-skills/plugins/codex/moonweave-governance') pass('Codex marketplace source');
else fail('Codex marketplace source', JSON.stringify(codexEntry?.source));
if (codexEntry?.policy?.installation === 'AVAILABLE' && codexEntry?.policy?.authentication === 'ON_INSTALL') pass('Codex marketplace policy');
else fail('Codex marketplace policy', JSON.stringify(codexEntry?.policy));
const codexManifest = read('plugins/codex/moonweave-governance/.codex-plugin/plugin.json');
if (codexManifest?.skills === './skills/' && codexManifest?.version === pkg.version) pass('Codex plugin manifest'); else fail('Codex plugin manifest', 'skills/version mismatch');

const antigravity = readRoot('plugin.json');
const agAllowed = new Set(['$schema', 'name', 'description']);
const agExtra = antigravity ? Object.keys(antigravity).filter((k) => !agAllowed.has(k)) : ['parse-failed'];
if (antigravity?.$schema === 'https://antigravity.google/schemas/v1/plugin.json' && antigravity?.name === 'moonweave-governance' && agExtra.length === 0) pass('Antigravity root plugin manifest');
else fail('Antigravity root plugin manifest', `extra=${agExtra.join(',')}`);

for (const platform of ['claude', 'cursor', 'codex', 'antigravity']) {
  const dir = `plugins/${platform}/moonweave-governance/skills`;
  const count = fs.readdirSync(path.join(root, dir), { withFileTypes: true }).filter((e) => e.isDirectory()).length;
  if (count === skillDirs.length) pass(`${platform} copied skill count`, String(count)); else fail(`${platform} copied skill count`, String(count));
  noSymlinks(`plugins/${platform}/moonweave-governance`);
}

for (const manifest of ['.claude-plugin/marketplace.json', '.cursor-plugin/marketplace.json', '.agents/plugins/marketplace.json', 'plugin.json']) existsRoot(manifest);
exists('rules/moonweave-governance.md');
exists('generated-adapters.json');

console.log('# Marketplace and Adapter Validation\n');
console.log('| Result | Check | Detail |\n|---|---|---|');
for (const check of checks) console.log(`| ${check.status} | ${check.name.replaceAll('|','\\|')} | ${String(check.detail || '').replaceAll('|','\\|')} |`);
console.log(`\nTotal: ${checks.length}; Failed: ${errors.length}`);
if (errors.length) process.exitCode = 1;
