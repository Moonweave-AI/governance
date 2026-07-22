---
adr: ADR-0001
title: Relocate .github to repo root and unify release-manifest at 0.2.0
status: Accepted
date: 2026-07-22
decision_owner: Moonweave AI Governance Maintainers
related_rfc:
supersedes:
superseded_by:
---

# ADR-0001: Relocate `.github` to repo root and unify release-manifest at 0.2.0

> **Scope note**: This ADR records an **engineering / project structure** decision
> for the `Moonweave-AI/governance` repository. It does **not** modify governance
> principles, specifications, the `01-Foundation`/`02-Governance`/`04-Engineering/standards`
> documents, or the `governance-skills` skill system. It is a project record, not a
> rule change.

## Context

The `Moonweave-AI/governance` repository is a monorepo containing two surfaces:

1. The governance documentation (`01-Foundation` … `06-Glossary`).
2. The `governance-skills` package (`@moonweave-ai/governance-skills`).

A repository audit on 2026-07-22 (`moonweave-repository-audit` + `moonweave-release-readiness`)
found that the entire `.github/` directory lived under `governance-skills/.github/`.
GitHub Actions, CODEOWNERS review enforcement, and Issue/PR templates are only read
from the **repository root** `.github/`, so this placement meant the repository had
**no functioning CI, no enforced required reviews, and no active Issue/PR templates**.
The audit also surfaced version drift (`package.json` 0.2.0 vs `release-manifest.json`
0.1.0 vs a `0.1.0` CHANGELOG and tarball), stale content counts in the manifest
(skills/commands listed as 23 while the actual count is 25 after `moonweave-help`
and `moonweave-flow` were added), uncommitted regenerated adapters/checksums, and a
`.moonweave/governance.json` that declared `canonical_language: zh-CN` and `maturity: M7`
despite the repository being English-primary and pre-publication.

## Decision

1. **Relocate `.github/` to the repository root** so CI, CODEOWNERS, and Issue/PR
   templates function. Root workflows run with `working-directory: governance-skills`;
   the composite action path is corrected to `governance-skills/bin/...`; root
   CODEOWNERS uses `governance-skills/` path prefixes for the monorepo layout.
2. **Retain a package-local `.github/`** under `governance-skills/` containing
   standalone consumer workflows (no `working-directory`), direct-path CODEOWNERS,
   and Issue/PR templates, so `moonweave-skills install --withGithub` and the
   package-level `audit:self` heuristic remain green. The package-local workflows
   are independent of (not symlinks to) the root ones, because consumers install
   the package at their own root.
3. **Add repo-root `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`** as the public
   repository surface (copies of the package documents), while keeping the package
   copies for the npm tarball.
4. **Unify the version to 0.2.0** across `package.json`, `release-manifest.json`,
   and `CHANGELOG.md` (new 0.2.0 entry).
5. **Refresh `release-manifest.json`** content counts (skills/commands 23 → 25) and
   the validation block to match executed runs: node tests 17/0, static skill checks
   25/0, static evaluations 171/0, adapter checks 199/0, self-audit 0 across all
   severities.
6. **Regenerate all platform adapters and `checksums.sha256`** against the 25-skill
   set via `build:adapters` + `checksums`.
7. **Correct `.moonweave/governance.json`**: `canonical_language: en`, `maturity: M3`
   (pre-publication). Maturity will return to M7 only after publication, signing/OIDC
   provenance, and live in-product evaluation are complete.

No governance specification document and no skill semantic core was modified.

## Consequences

### Positive
- CI, CODEOWNERS required review, and Issue/PR templates now function at the
  repository level where GitHub actually reads them.
- Release manifest, package version, and CHANGELOG are consistent and traceable.
- Adapter/checksum artifacts match the 25-skill set; `prepublishOnly --fail-on medium`
  passes.
- English-primary canonical language is correctly declared.

### Negative
- Two copies of `.github/` exist (root for the monorepo, `governance-skills/.github/`
  for the package). The workflows and CODEOWNERS intentionally differ by
  `working-directory` and path prefix. These must be kept coherent when either is
  changed — drift is possible.
- Repo-root `SECURITY.md`/`CONTRIBUTING.md`/`CHANGELOG.md` duplicate the package
  copies. Edits should be mirrored to avoid divergence.

### Sync rule (authoritative)
When editing GitHub workflow or governance-surface files, apply this rule to keep
the two copies coherent:

| File | Root copy (monorepo) | Package copy (`governance-skills/`) |
|---|---|---|
| `workflows/ci.yml` | `defaults.run.working-directory: governance-skills` | no `working-directory` (package is the root for consumers) |
| `workflows/governance-audit.yml` | `working-directory: governance-skills`; `sarif_file: governance-skills/moonweave-audit.sarif` | no `working-directory`; `sarif_file: moonweave-audit.sarif` |
| `actions/governance-audit/action.yml` | bin path `governance-skills/bin/...` | (lives only at root; consumers get the workflow from `installGithub`) |
| `CODEOWNERS` | `governance-skills/` path prefixes | direct path prefixes (`/skills/`, `/core/`, ...) |
| `ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md` | identical content | identical content |
| `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md` | repo-root public surface | package copy for the npm tarball — keep content in sync |

Rule of thumb: change both copies in the same commit; run `npm run build:adapters`
and `node bin/moonweave-skills.mjs checksums` afterward; verify with
`npm run verify` and `npm run audit:self`. The `installGithub` workflow template
embedded in `lib/installer.mjs` must also be bumped when the consumer-facing
workflow changes.

### Neutral
- `audit:self` continues to run against the package subdirectory (`--root .`), where
  all package baseline files live. A root-level audit (`--root ..`) would falsely
  report missing `tests/`, `QUALITY.md`, and `.moonweave/` because those belong to the
  package surface, not the monorepo root.

## Alternatives Considered
- **Keep `.github/` in `governance-skills/`, fix only the command path.** Rejected:
  GitHub would still not read the workflows/templates, so CI and review enforcement
  would remain inactive.
- **Mirror only the two workflows to root, keep the rest in the subdirectory.**
  Rejected: CODEOWNERS and Issue/PR templates also need to be at root to function.
- **Move all governance docs to root and audit at `--root ..`.** Rejected: the
  governed component is the package; its `tests/`, `QUALITY.md`, and `.moonweave/`
  belong with the package. A root audit would produce false positives.

## Related RFCs / Issues / PRs
- Audit: `moonweave-repository-audit` (2026-07-22)
- Release readiness: `moonweave-release-readiness` (2026-07-22)
- Implementing commit: `036d3ae fix(governance): resolve release-readiness drift and
  activate repo-level CI`
- Release manifest `assurance_scope.not_completed`: npm publication, third-party
  marketplace approval, release signing/OIDC provenance, live in-product evaluation.

## Release CI (provenance)

A dedicated `release.yml` workflow publishes to npm with Sigstore provenance:

- **Trigger**: `push` of tags matching `v*` and `workflow_dispatch` (with an optional
  `dry-run` input). Tag-triggered releases keep the irreversible publish act deliberate.
- **Permissions**: `id-token: write` (required for npm provenance OIDC) and
  `contents: read`.
- **Environment**: `release` (use a GitHub Environment to require reviewers/wait for
  the first provenance publish; optional hardening).
- **Steps**: `npm ci` → `npm run verify` → `npm run audit:self` →
  `npm publish --provenance`. The package's `prepublishOnly` script additionally
  runs `verify` + `audit --fail-on medium`, so the publish is double-gated.
- **Secret**: `NPM_TOKEN` must be a **granular access token** (automation/legacy tokens
  do not support provenance) scoped to `@moonweave-ai/governance-skills` with Publish
  permission. Set it via `gh secret set NPM_TOKEN` — never commit it.
- **Local publish limitation**: `npm publish --provenance` from a local terminal fails
  with "Automatic provenance generation not supported for provider: null" because no
  OIDC token source exists outside GitHub Actions. Provenance releases must go through
  this workflow.
- A package-local standalone copy lives at `governance-skills/.github/workflows/release.yml`
  for consumers (no `working-directory`); the root copy uses
  `working-directory: governance-skills` per the sync rule above.
