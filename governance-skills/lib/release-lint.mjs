import fs from 'node:fs';
import path from 'node:path';

const READMES = [
  ['README.md', /^> \*\*Version: ([^*]+)\*\*/m],
  ['README.zh.md', /^> \*\*版本：([^*]+)\*\*/m],
  ['README.ja.md', /^> \*\*バージョン: ([^*]+)\*\*/m],
];
const CHANGELOGS = ['CHANGELOG.md', 'CHANGELOG.zh.md', 'CHANGELOG.ja.md'];
const MARKETPLACE_VERSIONS = [
  ['marketplace/claude/marketplace.json', (data) => data.plugins?.[0]?.version],
];

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function finding(id, file, message) { return { severity: 'error', id, path: file, message }; }

export function lintReleaseMetadata(packageRoot) {
  const version = readJson(path.join(packageRoot, 'package.json')).version;
  const findings = [];
  for (const file of ['core/manifest.json', 'release-manifest.json']) {
    if (readJson(path.join(packageRoot, file)).version !== version) findings.push(finding('version-mismatch', file, `version must equal package.json (${version})`));
  }
  for (const [file, pattern] of READMES) {
    const actual = fs.readFileSync(path.join(packageRoot, file), 'utf8').match(pattern)?.[1]?.trim();
    if (actual !== version) findings.push(finding('version-mismatch', file, `displayed version must equal package.json (${version})`));
  }
  for (const file of CHANGELOGS) {
    const actual = fs.readFileSync(path.join(packageRoot, file), 'utf8').match(/^## ([^\s]+)\s+—/m)?.[1];
    if (actual !== version) findings.push(finding('changelog-version-mismatch', file, `first changelog entry must equal package.json (${version})`));
  }
  for (const [file, readVersion] of MARKETPLACE_VERSIONS) {
    if (readVersion(readJson(path.join(packageRoot, file))) !== version) findings.push(finding('version-mismatch', file, `marketplace version must equal package.json (${version})`));
  }
  return { version, summary: { errors: findings.length }, findings };
}

export function releaseLintMarkdown(report) {
  const lines = ['# Release Metadata Check', '', `- Version: ${report.version}`, `- Errors: ${report.summary.errors}`, ''];
  if (!report.findings.length) lines.push('All manifests, READMEs, and changelogs agree on the release version.');
  else {
    lines.push('| Rule | Path | Message |', '|---|---|---|');
    for (const item of report.findings) lines.push(`| ${item.id} | \`${item.path}\` | ${item.message} |`);
  }
  return lines.join('\n');
}
