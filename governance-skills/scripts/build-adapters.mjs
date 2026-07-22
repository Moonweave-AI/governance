#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const description = 'Moonweave AI governance, planning, RFC, engineering, security, quality, release, research, and knowledge management skills.';
const repo = 'https://github.com/Moonweave-AI/governance';
const repoSubdir = 'governance-skills';
const governance = 'https://github.com/Moonweave-AI/governance';
const repoRoot = path.resolve(root, '..');

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function clean(rel) { fs.rmSync(path.join(root, rel), { recursive: true, force: true }); }
function writeJson(rel, value) {
  const file = path.isAbsolute(rel) ? rel : path.join(root, rel);
  ensure(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
function writeText(rel, value) {
  const file = path.isAbsolute(rel) ? rel : path.join(root, rel);
  ensure(path.dirname(file));
  fs.writeFileSync(file, value.endsWith('\n') ? value : `${value}\n`);
}
function copyDir(srcRel, dstRel) {
  const src = path.join(root, srcRel);
  const dst = path.join(root, dstRel);
  fs.cpSync(src, dst, { recursive: true, force: true, dereference: true });
}
function copyFile(srcRel, dstRel) {
  const src = path.join(root, srcRel);
  const dst = path.join(root, dstRel);
  ensure(path.dirname(dst));
  fs.copyFileSync(src, dst);
}
function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function filesUnder(rel) {
  const start = path.join(root, rel);
  const out = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(path.relative(start, full).split(path.sep).join('/'));
    }
  }
  walk(start);
  return out.sort();
}
function pluginReadme(platform, install) {
  return `# Moonweave Governance for ${platform}\n\n${description}\n\n## Installation\n\n\`\`\`bash\n${install}\n\`\`\`\n\n- Authoritative governance source: ${governance}\n- Vendor-neutral skills source: the \`governance-skills/skills/\` directory of the governance repo\n- High-risk actions remain constrained by platform permissions, CI, security gates, and human confirmation.\n`;
}

// Marketplace manifests now live at the governance repo root, not in the
// governance-skills subdirectory. Clean both the root-level manifests (stale
// copies) and the generated plugin directories under governance-skills/.
for (const rel of [
  '.claude-plugin', '.cursor-plugin', '.agents/plugins', 'plugin.json',
  'plugins/claude', 'plugins/cursor', 'plugins/codex', 'plugins/antigravity'
]) clean(rel);
for (const rel of [
  '.claude-plugin', '.cursor-plugin', '.agents/plugins', 'plugin.json'
]) fs.rmSync(path.join(repoRoot, rel), { recursive: true, force: true });

const skills = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

// Kilo remote directory index. Files are relative to each skill directory.
const kiloIndex = {
  skills: skills.map((name) => ({ name, files: filesUnder(path.join('skills', name)) })),
};
writeJson('skills/index.json', kiloIndex);
writeJson('marketplace/kilo/index.json', kiloIndex);
writeJson('marketplace/kilo/entry.json', {
  name: 'moonweave-governance',
  description,
  source: repo,
  remote_url_example: `https://raw.githubusercontent.com/Moonweave-AI/governance/main/${repoSubdir}/skills/`,
  skill_count: skills.length,
});

// Claude Code plugin marketplace. Manifest lives at the governance repo root so
// `/plugin marketplace add Moonweave-AI/governance` can discover it; it points
// into the governance-skills/ subdirectory for the actual plugin source.
writeJson(path.join(repoRoot, '.claude-plugin/marketplace.json'), {
  name: 'moonweave-ai',
  owner: { name: 'Moonweave AI' },
  metadata: { description: 'Moonweave AI agent skills and governance workflows', version },
  plugins: [{
    name: 'moonweave-governance',
    description,
    version,
    author: { name: 'Moonweave AI' },
    source: './governance-skills/plugins/claude/moonweave-governance',
    category: 'development',
  }],
});
writeJson('plugins/claude/moonweave-governance/.claude-plugin/plugin.json', {
  name: 'moonweave-governance',
  version,
  description,
  author: { name: 'Moonweave AI' },
});
copyDir('skills', 'plugins/claude/moonweave-governance/skills');
fs.rmSync(path.join(root, 'plugins/claude/moonweave-governance/skills/index.json'), { force: true });
copyDir('commands', 'plugins/claude/moonweave-governance/commands');
copyFile('LICENSE', 'plugins/claude/moonweave-governance/LICENSE');
writeText('plugins/claude/moonweave-governance/README.md', pluginReadme(
  'Claude Code',
  '/plugin marketplace add Moonweave-AI/governance\n/plugin install moonweave-governance@moonweave-ai',
));

// Cursor plugin marketplace. Manifest at governance repo root.
writeJson(path.join(repoRoot, '.cursor-plugin/marketplace.json'), {
  name: 'moonweave-ai',
  owner: { name: 'Moonweave AI' },
  metadata: { description: 'Moonweave AI governance skills and commands', version },
  plugins: [{
    name: 'moonweave-governance',
    source: './governance-skills/plugins/cursor/moonweave-governance',
    description,
  }],
});
writeJson('plugins/cursor/moonweave-governance/.cursor-plugin/plugin.json', {
  name: 'moonweave-governance',
  displayName: 'Moonweave Governance',
  version,
  description,
  author: { name: 'Moonweave AI' },
  license: 'MIT',
  keywords: ['governance', 'agent-skills', 'code-review', 'ai-safety', 'quality-assurance'],
});
copyDir('skills', 'plugins/cursor/moonweave-governance/skills');
fs.rmSync(path.join(root, 'plugins/cursor/moonweave-governance/skills/index.json'), { force: true });
copyDir('commands', 'plugins/cursor/moonweave-governance/commands');
const baseline = fs.readFileSync(path.join(root, 'rules/moonweave-governance.md'), 'utf8');
writeText('plugins/cursor/moonweave-governance/rules/moonweave-governance.mdc', `---\ndescription: Moonweave AI governance, security, engineering, and knowledge baseline\nalwaysApply: true\n---\n\n${baseline}`);
copyFile('LICENSE', 'plugins/cursor/moonweave-governance/LICENSE');
writeText('plugins/cursor/moonweave-governance/README.md', pluginReadme(
  'Cursor',
  '# Add Moonweave-AI/governance in the Cursor Plugin Marketplace\n# Or use: npx @moonweave-ai/governance-skills install --agents cursor',
));

// Codex / ChatGPT plugin marketplace. Manifest at governance repo root.
writeJson(path.join(repoRoot, '.agents/plugins/marketplace.json'), {
  name: 'moonweave-ai',
  interface: { displayName: 'Moonweave AI' },
  plugins: [{
    name: 'moonweave-governance',
    source: { source: 'local', path: './governance-skills/plugins/codex/moonweave-governance' },
    policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
    category: 'Developer Tools',
  }],
});
writeJson('plugins/codex/moonweave-governance/.codex-plugin/plugin.json', {
  name: 'moonweave-governance',
  version,
  description,
  author: { name: 'Moonweave AI', url: 'https://github.com/Moonweave-AI' },
  homepage: repo,
  repository: repo,
  license: 'MIT',
  keywords: ['governance', 'agent-skills', 'code-review', 'ai-safety', 'quality-assurance'],
  skills: './skills/',
  interface: {
    displayName: 'Moonweave Governance',
    shortDescription: 'Governance-aware engineering workflows',
    longDescription: 'Route, plan, review, secure, validate, release and document Moonweave AI projects using focused skills and deterministic checks.',
    developerName: 'Moonweave AI',
    category: 'Developer Tools',
    capabilities: ['Read', 'Write'],
    websiteURL: repo,
    defaultPrompt: [
      'Route this task through the Moonweave governance lifecycle.',
      'Review this pull request using Moonweave security and quality gates.',
      'Audit this repository and produce a prioritized remediation plan.',
    ],
  },
});
copyDir('skills', 'plugins/codex/moonweave-governance/skills');
fs.rmSync(path.join(root, 'plugins/codex/moonweave-governance/skills/index.json'), { force: true });
copyFile('LICENSE', 'plugins/codex/moonweave-governance/LICENSE');
writeText('plugins/codex/moonweave-governance/README.md', pluginReadme(
  'Codex / ChatGPT',
  'codex plugin marketplace add Moonweave-AI/governance\n# Then install Moonweave Governance from the Plugins Directory',
));

// Antigravity CLI plugin. The governance repo root is directly installable.
writeJson(path.join(repoRoot, 'plugin.json'), {
  $schema: 'https://antigravity.google/schemas/v1/plugin.json',
  name: 'moonweave-governance',
  description,
});
writeJson('plugins/antigravity/moonweave-governance/plugin.json', {
  $schema: 'https://antigravity.google/schemas/v1/plugin.json',
  name: 'moonweave-governance',
  description,
});
copyDir('skills', 'plugins/antigravity/moonweave-governance/skills');
fs.rmSync(path.join(root, 'plugins/antigravity/moonweave-governance/skills/index.json'), { force: true });
copyDir('rules', 'plugins/antigravity/moonweave-governance/rules');
copyFile('LICENSE', 'plugins/antigravity/moonweave-governance/LICENSE');
writeText('plugins/antigravity/moonweave-governance/README.md', pluginReadme(
  'Antigravity CLI',
  'agy plugin install https://github.com/Moonweave-AI/governance',
));

// Publication notes for portable ecosystems.
writeText('marketplace/skills-sh/README.md', `# skills.sh / Vercel Skills CLI\n\nThe \`governance-skills/skills/\` directory is the portable installation surface inside the governance repo.\n\n\`\`\`bash\nnpx skills add Moonweave-AI/governance/governance-skills --all\nnpx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review\n\`\`\`\n`);
writeText('marketplace/kilo/README.md', `# Kilo\n\n## Project / global installation\n\n\`\`\`bash\nnpx @moonweave-ai/governance-skills install --agents kilo --scope project\n\`\`\`\n\n## Remote URL\n\nAdd the following to \`kilo.jsonc\`:\n\n\`\`\`jsonc\n{\n  "skills": {\n    "urls": ["https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/"]\n  }\n}\n\`\`\`\n\nThis URL serves \`skills/index.json\` and the files for each skill.\n`);
writeText('marketplace/claude/README.md', '# Claude Code Marketplace\n\nThe official marketplace manifest is at the governance repo root `.claude-plugin/marketplace.json`, which points into `governance-skills/plugins/claude/`.\n');
writeText('marketplace/antigravity/README.md', '# Antigravity\n\nThe governance repo root is an installable Antigravity plugin; a standalone published copy is in `governance-skills/plugins/antigravity/moonweave-governance/`.\n');

// Marketplace manifests are generated at the governance repo root (repoRoot);
// plugin-internal files stay under governance-skills/ (root).
const rootGenerated = [
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/marketplace.json',
  '.agents/plugins/marketplace.json',
  'plugin.json',
];
const subGenerated = [
  'skills/index.json',
  'plugins/claude/moonweave-governance/.claude-plugin/plugin.json',
  'plugins/cursor/moonweave-governance/.cursor-plugin/plugin.json',
  'plugins/codex/moonweave-governance/.codex-plugin/plugin.json',
  'plugins/antigravity/moonweave-governance/plugin.json',
];
const generatedFiles = [
  ...rootGenerated.map((rel) => ({ path: rel, base: repoRoot })),
  ...subGenerated.map((rel) => ({ path: rel, base: root })),
];
writeJson('generated-adapters.json', {
  schema_version: '1.0',
  version,
  generated_at: process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString() : null,
  source_skill_count: skills.length,
  targets: ['portable', 'claude', 'cursor', 'codex', 'opencode', 'kilo', 'antigravity'],
  generated_files: generatedFiles.map((entry) => ({ path: entry.path, sha256: sha(path.join(entry.base, entry.path)) })),
});

console.log(`Generated adapters for ${skills.length} skills at version ${version}.`);
