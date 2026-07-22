# Moonweave Governance Skills

> **Language**: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

Compiles [Moonweave AI Governance](https://github.com/Moonweave-AI/governance) from "long documents a human must memorize" into discoverable, invokable, checkable, auditable Agent Skills, commands, templates, a CLI, and platform adapters.

> **Version: 0.1.0**
> **Spec snapshot: 2026-07-22**
> **Status: Active / pre-publication. Features and install artifacts are verified; npm packages and platform marketplaces still require actual publication or review submission by the Moonweave AI account.**
> **Owner: Moonweave AI Governance Maintainers. Backup Owner: Moonweave AI Stewardship Council.**

## Core Architecture

```text
Moonweave Governance (authoritative semantics)
        ↓
Typed Governance Core (risk / quality / lifecycle / traceability matrices)
        ↓
Focused Agent Skills (progressive disclosure per task)
        ↓
Platform Adapters (Cursor / Codex / Claude / OpenCode / Kilo / Antigravity)
        ↓
Deterministic CLI & Hooks (if it can be checked deterministically, don't let the model guess)
        ↓
Paired Evals & Security Analysis (trigger, non-trigger, task outcome, safety)
```

## Installation

### From GitHub / skills.sh (recommended, no publish needed)

The `governance-skills/skills/` directory of the governance repo follows the open Agent Skills format, so it is discoverable by skills.sh, Codex, Claude Code, Cursor, OpenCode, Kilo, Antigravity, and other supporters.

```bash
# Install all skills into the current project
npx skills add Moonweave-AI/governance/governance-skills --all
# Install globally
npx skills add Moonweave-AI/governance/governance-skills -g
# or install a single skill
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

GitHub CLI skill install:

```bash
gh skill install Moonweave-AI/governance/governance-skills --all
gh skill install Moonweave-AI/governance/governance-skills --all --agent cursor --scope user
```

### Git clone and run

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance
node governance-skills/bin/moonweave-skills.mjs install --agents all --root /path/to/project
```

### Platform-native marketplaces (no publish needed)

Marketplace manifests live at the governance repo root, so each platform discovers them by adding the `Moonweave-AI/governance` repository:

- Claude Code: `/plugin marketplace add Moonweave-AI/governance`
- Cursor: add `Moonweave-AI/governance` in the Cursor Plugin Marketplace
- Codex / ChatGPT: `codex plugin marketplace add Moonweave-AI/governance`
- Antigravity: `agy plugin install https://github.com/Moonweave-AI/governance`
- Kilo remote URL: `https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/`

### From a local tarball

```bash
cd governance-skills && npm install && npm pack
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project
```

### After publishing to npm

Requires creating the `moonweave-ai` organization on npm first (see [`docs/INSTALLATION.md`](docs/INSTALLATION.md)):

```bash
npx @moonweave-ai/governance-skills install --agents all --scope project
```

Each marketplace manifest and plugin directory is generated from the same `skills/`, `commands/`, `rules/` sources by `npm run build:adapters`, and checked by `npm run validate:adapters`. See [`docs/INSTALLATION.md`](docs/INSTALLATION.md) for full install options.

## Common Commands

```bash
moonweave-skills list
moonweave-skills route --text "let the agent write to the production database"
moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity
moonweave-skills doctor --root .
moonweave-skills new rfc --title "Unify the long-term memory state protocol"
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills lint-skills
moonweave-skills checksums
```

See [`docs/COMMANDS.md`](docs/COMMANDS.md) for the full command reference.

## 25 Skills

| Category | Skills |
|---|---|
| Routing & bootstrap | `moonweave-governance-router`, `moonweave-project-bootstrap` |
| Planning & decisions | `moonweave-idea-triage`, `moonweave-project-planning`, `moonweave-rfc`, `moonweave-adr` |
| Engineering collaboration | `moonweave-issue`, `moonweave-engineering-brief`, `moonweave-implementation`, `moonweave-pull-request`, `moonweave-code-review` |
| Security & quality | `moonweave-security-review`, `moonweave-quality-assurance`, `moonweave-release-readiness`, `moonweave-repository-audit` |
| Knowledge & research | `moonweave-documentation`, `moonweave-research` |
| Operation & organization | `moonweave-incident-response`, `moonweave-handoff`, `moonweave-community-contribution` |
| Improvement & governance | `moonweave-gap-analysis`, `moonweave-retrospective`, `moonweave-governance-change` |
| Guidance & flow | `moonweave-help` (pick the right skill), `moonweave-flow` (staged multi-skill run) |

## Security Note

Skills are not a security boundary. Deterministic limits must be enforced by the permission system, hooks, CI, branch protection, secret scanning, tests, and human review. This package does not auto-merge, publish, deploy, delete data, or grant Agent/embodied permissions by default.

See [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md) and [`SECURITY.md`](SECURITY.md).

## Design & Compatibility

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md)
- [`docs/GOVERNANCE-TRACEABILITY.md`](docs/GOVERNANCE-TRACEABILITY.md)
- [`docs/EVALUATION.md`](docs/EVALUATION.md)
- [`docs/REFERENCES.md`](docs/REFERENCES.md)
- [`docs/PUBLISHING.md`](docs/PUBLISHING.md)

## License

MIT
