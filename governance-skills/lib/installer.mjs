import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { commandMap, defaultAgents, packageJson, packageRoot, platformTargets, supportedAgents } from './config.mjs';
import { appendManagedBlock, copyDir, copyFileSafe, ensureDir, expandHome, normalizeRel, readJson, removeManagedBlock, sha256File, walkFiles, writeFileSafe, writeJson } from './fs-utils.mjs';

const MARKER = 'MOONWEAVE-GOVERNANCE';

const BASE_RULES = fs.readFileSync(path.join(packageRoot, 'rules', 'moonweave-governance.md'), 'utf8').trim();

function parseAgents(value) {
  if (!value || value === 'all') return [...defaultAgents];
  const selected = value.split(',').map((x) => x.trim()).filter(Boolean);
  for (const agent of selected) {
    if (!supportedAgents.includes(agent)) throw new Error(`Unsupported platform: ${agent}. Supported: ${supportedAgents.join(', ')}`);
  }
  return [...new Set(selected)];
}

function treeHash(root) {
  const files = walkFiles(root, { includeSymlinks: false }).sort();
  const parts = [];
  for (const file of files) parts.push(`${normalizeRel(path.relative(root, file))}:${sha256File(file)}`);
  return Buffer.from(parts.join('\n')).toString('base64url');
}

function resolveTarget(targetValue, root, scope) {
  if (!targetValue) return null;
  if (scope === 'global') return path.resolve(expandHome(targetValue));
  return path.resolve(root, targetValue);
}

function globalCommandPath(agent) {
  const paths = {
    cursor: '~/.cursor/commands',
    claude: '~/.claude/commands',
    opencode: '~/.config/opencode/commands',
    kilo: '~/.config/kilo/commands',
  };
  return paths[agent] ? path.resolve(expandHome(paths[agent])) : null;
}

function globalRulesPath(agent) {
  const paths = {
    codex: '~/.codex/AGENTS.md',
    cursor: '~/.cursor/rules/moonweave-governance.mdc',
    claude: '~/.claude/CLAUDE.md',
    opencode: '~/.config/opencode/AGENTS.md',
    kilo: '~/.config/kilo/AGENTS.md',
    antigravity: '~/.gemini/GEMINI.md',
  };
  return paths[agent] ? path.resolve(expandHome(paths[agent])) : null;
}

function ruleContent(agent) {
  if (agent === 'cursor') {
    return `---\ndescription: Moonweave AI project governance, security, engineering, and knowledge baseline\nalwaysApply: true\n---\n\n${BASE_RULES}\n`;
  }
  return `${BASE_RULES}\n`;
}

function installRules(agent, destination, force, entries, messages) {
  if (!destination) return;
  const relative = destination;
  if (['codex', 'claude', 'opencode', 'generic'].includes(agent) || path.basename(destination) === 'AGENTS.md' || path.basename(destination) === 'CLAUDE.md') {
    appendManagedBlock(destination, BASE_RULES, MARKER, { force });
    entries.push({ kind: 'managed-block', agent, path: destination, marker: MARKER });
    messages.push(`Rules: ${agent} -> ${relative}`);
    return;
  }
  const content = ruleContent(agent);
  const result = writeFileSafe(destination, content, { overwrite: force || isManagedFile(destination) });
  if (result.written) {
    entries.push({ kind: 'file', agent, path: destination, hash: sha256File(destination), managed: true });
    messages.push(`Rules: ${agent} -> ${relative}`);
  } else messages.push(`Skipped existing rules file (use --force to overwrite): ${relative}`);
}

function isManagedFile(file) {
  if (!fs.existsSync(file)) return false;
  try {
    const text = fs.readFileSync(file, 'utf8');
    return text.includes('Moonweave Governance Baseline') || text.includes(MARKER);
  } catch { return false; }
}

function installSkillDirectory(source, destination, mode, force, entries, agent, messages) {
  if (fs.existsSync(destination) || fs.lstatSync(destination, { throwIfNoEntry: false })) {
    if (!force) {
      messages.push(`Skipped existing skill: ${destination}`);
      return;
    }
    fs.rmSync(destination, { recursive: true, force: true });
  }
  ensureDir(path.dirname(destination));
  if (mode === 'symlink') {
    fs.symlinkSync(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
    entries.push({ kind: 'symlink', agent, path: destination, target: source, source_hash: treeHash(source) });
  } else {
    copyDir(source, destination, { overwrite: true });
    entries.push({ kind: 'directory', agent, path: destination, hash: treeHash(destination), source_hash: treeHash(source) });
  }
}

function installCommands(agent, destination, force, entries, messages) {
  if (!destination) return;
  ensureDir(destination);
  for (const cmd of commandMap) {
    const source = path.join(packageRoot, 'commands', `${cmd.command}.md`);
    const target = path.join(destination, `${cmd.command}.md`);
    const result = copyFileSafe(source, target, { overwrite: force || isManagedFile(target) });
    if (result.written) entries.push({ kind: 'file', agent, path: target, hash: sha256File(target), managed: true });
  }
  messages.push(`Commands: ${agent} -> ${destination}`);
}

function installGithub(root, force, entries, messages, profile = 'auto') {
  const targets = [
    ['.github/ISSUE_TEMPLATE/moonweave-idea.yml', '.github/ISSUE_TEMPLATE/idea.yml'],
    ['.github/PULL_REQUEST_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md'],
  ];
  for (const [destRel, srcRel] of targets) {
    const source = path.join(packageRoot, srcRel);
    const destination = path.join(root, destRel);
    const result = copyFileSafe(source, destination, { overwrite: force });
    if (result.written) entries.push({ kind: 'file', agent: 'github', path: destination, hash: sha256File(destination), managed: true });
    else messages.push(`Skipped existing GitHub file: ${destRel}`);
  }
  const workflow = `name: Moonweave Governance Audit\non:\n  pull_request:\n  workflow_dispatch:\npermissions:\n  contents: read\n  security-events: write\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Run governance audit\n        run: npx --yes @moonweave-ai/governance-skills@${packageJson.version} audit --root . --profile ${profile} --format sarif --out moonweave-audit.sarif\n      - uses: github/codeql-action/upload-sarif@v3\n        if: always()\n        with:\n          sarif_file: moonweave-audit.sarif\n`;
  const workflowPath = path.join(root, '.github', 'workflows', 'moonweave-governance-audit.yml');
  const result = writeFileSafe(workflowPath, workflow, { overwrite: force || isManagedFile(workflowPath) });
  if (result.written) entries.push({ kind: 'file', agent: 'github', path: workflowPath, hash: sha256File(workflowPath), managed: true });
  messages.push('GitHub templates and governance audit workflow installed; before npm publishing, the package reference in the workflow can be switched to the GitHub source.');
}

export function install(options = {}) {
  const root = path.resolve(options.root || '.');
  const scope = options.scope || 'project';
  const mode = options.mode || 'copy';
  const force = Boolean(options.force);
  const agents = parseAgents(options.agents || 'all');
  if (!['project', 'global'].includes(scope)) throw new Error('--scope must be project or global');
  if (!['copy', 'symlink'].includes(mode)) throw new Error('--mode must be copy or symlink');
  if (scope === 'project') ensureDir(root);

  const entries = [];
  const messages = [];
  const installedSkillRoots = new Map();
  const skillNames = fs.readdirSync(path.join(packageRoot, 'skills'), { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort();

  for (const agent of agents) {
    const platform = platformTargets.platforms[agent];
    const skillsTargetValue = scope === 'global' ? platform.skills_global : platform.skills_project;
    if (!skillsTargetValue) {
      messages.push(`Platform ${agent} has no confirmed ${scope} skills path; skipped.`);
      continue;
    }
    const skillsRoot = resolveTarget(skillsTargetValue, root, scope);
    const key = path.normalize(skillsRoot);
    if (!installedSkillRoots.has(key)) {
      ensureDir(skillsRoot);
      for (const skillName of skillNames) {
        installSkillDirectory(path.join(packageRoot, 'skills', skillName), path.join(skillsRoot, skillName), mode, force, entries, agent, messages);
      }
      installedSkillRoots.set(key, agent);
      messages.push(`Skills: ${agent} -> ${skillsRoot} (${skillNames.length})`);
    } else {
      messages.push(`Skills path shared with ${installedSkillRoots.get(key)}: ${agent} -> ${skillsRoot}`);
    }

    const rulesTarget = scope === 'global'
      ? globalRulesPath(agent)
      : resolveTarget(platform.rules_project, root, scope);
    installRules(agent, rulesTarget, force, entries, messages);

    const commandsTarget = scope === 'global'
      ? globalCommandPath(agent)
      : resolveTarget(platform.commands_project, root, scope);
    installCommands(agent, commandsTarget, force, entries, messages);
  }

  let configPath = null;
  let lockPath = null;
  if (scope === 'project') {
    configPath = path.join(root, '.moonweave', 'governance.json');
    if (!fs.existsSync(configPath) || force) {
      writeJson(configPath, {
        schema_version: '1.0',
        governance_source: 'https://github.com/Moonweave-AI/governance',
        canonical_language: 'en',
        profile: options.profile || 'auto',
        owner: null,
        backup_owner: null,
        risk: null,
        quality: null,
        maturity: null,
        facts: {
          engineering: 'GitHub',
          organization_memory: 'Notion/Wiki or repository docs',
          rules: 'Moonweave governance repository',
        },
        installed_at: new Date().toISOString(),
      });
      entries.push({ kind: 'file', agent: 'moonweave', path: configPath, hash: sha256File(configPath), managed: true });
    }
    if (options.withGithub) installGithub(root, force, entries, messages, options.profile || 'auto');
    lockPath = path.join(root, '.moonweave', 'skills-lock.json');
  } else {
    lockPath = path.join(os.homedir(), '.moonweave', 'skills-lock.json');
  }

  const lock = {
    schema_version: '1.0',
    package: packageJson.name,
    version: packageJson.version,
    installed_at: new Date().toISOString(),
    scope,
    root,
    mode,
    agents,
    entries,
  };
  writeJson(lockPath, lock);
  messages.push(`Lock: ${lockPath}`);
  return { root, scope, mode, agents, skills: skillNames.length, entries: entries.length, lock_path: lockPath, messages };
}

export function doctor(rootInput = '.', options = {}) {
  const root = path.resolve(rootInput);
  const checks = [];
  const add = (status, name, detail) => checks.push({ status, name, detail });
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  add(nodeMajor >= 20 ? 'pass' : 'fail', 'Node.js >= 20', process.versions.node);
  for (const dir of ['skills', 'core', 'commands', 'templates']) {
    add(fs.existsSync(path.join(packageRoot, dir)) ? 'pass' : 'fail', `Package ${dir}/`, path.join(packageRoot, dir));
  }
  add(fs.existsSync(root) ? 'pass' : 'fail', 'Project root', root);
  const config = path.join(root, '.moonweave', 'governance.json');
  add(fs.existsSync(config) ? 'pass' : 'warn', 'Moonweave config', config);
  const lock = path.join(root, '.moonweave', 'skills-lock.json');
  if (!fs.existsSync(lock)) add('warn', 'Skills lock', 'Not installed or missing .moonweave/skills-lock.json');
  else {
    try {
      const data = readJson(lock);
      let drift = 0;
      for (const entry of data.entries || []) {
        if (entry.kind === 'managed-block') continue;
        if (!fs.existsSync(entry.path) && !fs.lstatSync(entry.path, { throwIfNoEntry: false })) drift += 1;
        else if (entry.kind === 'file' && entry.hash && sha256File(entry.path) !== entry.hash) drift += 1;
        else if (entry.kind === 'directory' && entry.hash && treeHash(entry.path) !== entry.hash) drift += 1;
      }
      add(drift === 0 ? 'pass' : 'warn', 'Install drift', drift === 0 ? 'No drift detected' : `${drift} installed item(s) missing or modified`);
    } catch (error) {
      add('fail', 'Skills lock parse', error.message);
    }
  }
  for (const [agent, platform] of Object.entries(platformTargets.platforms)) {
    const target = resolveTarget(platform.skills_project, root, 'project');
    add(target && fs.existsSync(target) ? 'pass' : 'info', `${agent} skills`, target || 'No project path');
  }
  const summary = {
    pass: checks.filter((x) => x.status === 'pass').length,
    fail: checks.filter((x) => x.status === 'fail').length,
    warn: checks.filter((x) => x.status === 'warn').length,
    info: checks.filter((x) => x.status === 'info').length,
  };
  return { root, summary, checks, strict: Boolean(options.strict) };
}

export function doctorMarkdown(report) {
  const icons = { pass: 'PASS', fail: 'FAIL', warn: 'WARN', info: 'INFO' };
  const lines = ['# Moonweave Skills Doctor', '', '| Status | Check | Detail |', '|---|---|---|'];
  for (const check of report.checks) lines.push(`| ${icons[check.status]} | ${check.name} | ${String(check.detail).replaceAll('|', '\\|')} |`);
  lines.push('', `Result: ${report.summary.fail ? 'Failures present' : report.summary.warn ? 'Usable, with warnings' : 'Passed'}`);
  return lines.join('\n');
}

export function uninstall(rootInput = '.', options = {}) {
  const scope = options.scope || 'project';
  const root = path.resolve(rootInput);
  const lockPath = scope === 'global' ? path.join(os.homedir(), '.moonweave', 'skills-lock.json') : path.join(root, '.moonweave', 'skills-lock.json');
  if (!fs.existsSync(lockPath)) throw new Error(`Install lock not found: ${lockPath}`);
  const lock = readJson(lockPath);
  const removed = [];
  const preserved = [];
  const entries = [...(lock.entries || [])].reverse();
  for (const entry of entries) {
    if (entry.kind === 'managed-block') {
      if (removeManagedBlock(entry.path, entry.marker || MARKER)) removed.push(entry.path);
      continue;
    }
    if (!fs.existsSync(entry.path) && !fs.lstatSync(entry.path, { throwIfNoEntry: false })) continue;
    let safe = false;
    if (entry.kind === 'symlink') {
      try { safe = fs.lstatSync(entry.path).isSymbolicLink() && fs.readlinkSync(entry.path) === entry.target; } catch {}
    } else if (entry.kind === 'file') safe = entry.hash && sha256File(entry.path) === entry.hash;
    else if (entry.kind === 'directory') safe = entry.hash && treeHash(entry.path) === entry.hash;
    if (safe || options.force) {
      fs.rmSync(entry.path, { recursive: true, force: true });
      removed.push(entry.path);
    } else preserved.push(entry.path);
  }
  fs.rmSync(lockPath, { force: true });
  return { lock_path: lockPath, removed, preserved };
}

export function generateChecksums(outFile = path.join(packageRoot, 'checksums.sha256')) {
  const ignores = new Set(['.git', 'node_modules', 'dist']);
  const excludedFiles = new Set(['package-lock.json']); // npm excludes this file from published tarballs.
  const files = walkFiles(packageRoot, { ignore: ignores })
    .filter((file) => path.resolve(file) !== path.resolve(outFile))
    .filter((file) => !excludedFiles.has(normalizeRel(path.relative(packageRoot, file))))
    .sort();
  const lines = files.map((file) => `${sha256File(file)}  ${normalizeRel(path.relative(packageRoot, file))}`);
  fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
  return { file: outFile, entries: lines.length };
}

export function listContent() {
  const skills = fs.readdirSync(path.join(packageRoot, 'skills'), { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort();
  const templates = fs.readdirSync(path.join(packageRoot, 'templates')).filter((x) => x.endsWith('.md')).sort();
  return { package: packageJson.name, version: packageJson.version, agents: supportedAgents, skills, commands: commandMap, templates };
}
