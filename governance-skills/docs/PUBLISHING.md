# Publishing and Marketplace Submission

## Pre-Publish Gate

```bash
npm run verify
npm run audit:self
npm pack --dry-run
```

You should also:

- Reconcile the governance specification version with `core/manifest.json`.
- Review all `SKILL.md`, scripts, manifests, and dependencies.
- Generate and verify SHA-256, SBOM, provenance, and signatures.
- Run an install smoke test from the actual npm tarball, not only from source.
- Verify Cursor, Codex, Claude, OpenCode, Kilo, and Antigravity in at least one real project each.
- Run trigger/non-trigger, security injection, Stop-Ship, and task-result paired evaluations.

## npm

```bash
npm login
npm publish --access public
```

## GitHub Release

Upload:

- Source ZIP / tar.gz
- npm `.tgz`
- `SHA256SUMS`
- Verification report
- SBOM / provenance / signature (for official releases)

## Marketplace Entry Points

- Claude: root `.claude-plugin/marketplace.json`
- Cursor: root `.cursor-plugin/marketplace.json`
- Codex / ChatGPT: root `.agents/plugins/marketplace.json`
- Antigravity: root `plugin.json`
- Kilo: `skills/index.json` remote URL, or submit a skill directory to the Kilo Marketplace
- skills.sh: the `governance-skills/skills/` directory of the governance repo

Until marketplace review is approved, documentation must use "publication-ready / pending review" and must not claim to be listed.
