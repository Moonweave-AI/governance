# Quality Declaration

| Field | Value |
|---|---|
| Component | Moonweave Governance Skills |
| Status | Active / published |
| Quality level | QA-L2 (maintained library and portable skill collection) |
| Primary owner | Moonweave AI Governance Maintainers |
| Backup owner | Moonweave AI Stewardship Council |
| Version policy | Semantic Versioning after public publication |
| Runtime | Node.js 20+ for deterministic CLI; skills themselves are Markdown |

## Scope

This declaration covers `skills/`, `commands/`, `core/`, `templates/`, the CLI, the installer, the static auditor, platform adapters, and marketplace manifests.

## Change control

- All changes go through Pull Requests.
- Skill semantic changes must trace to the Moonweave Governance canonical documents.
- Changes to platform paths, manifests, or marketplace formats must update the adapter tests.
- Security boundaries, Stop-Ship, and permission semantics must not be weakened for ordinary maintenance convenience.

## Verification

- Node.js unit and integration tests.
- Static checks on all `SKILL.md` frontmatter, dangerous patterns, and governance traceability.
- Routing and trigger regression cases (Chinese and English samples).
- Native marketplace / plugin manifest structure validation.
- npm pack, tarball install, and multi-platform project install smoke tests.
- Repository self-governance audit and secret / CI risk scanning.

## Security and supply chain

- CLI audit is read-only by default and does not execute the audited repository's code.
- Default install mode is copy, to avoid transient npx path invalidation and cross-platform symlink differences.
- Uninstall follows the lock file and preserves user-modified files.
- Release artifacts generate SHA-256 checksums; formal releases should attach SBOM / provenance / signatures.

## Known limitations

- npm, Claude, Cursor, Codex, Kilo, and other marketplace entries have not yet been actually published or reviewed by the Moonweave AI account.
- Different models vary in auto-trigger reliability for skills; explicit commands, deterministic checks, and human review remain necessary controls.
- Platform marketplace formats may evolve; re-run manifest validation and check official docs before each release.

## Review cadence

Reviewed before each release, and whenever any supported platform changes its skill, command, rule, or plugin format.
