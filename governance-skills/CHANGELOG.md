# Changelog

## 0.2.2 — 2026-07-22

- Fix `moonweave-pull-request` SKILL.md frontmatter: the English `description`
  contained an unquoted `Pull Request: ` sequence that caused standard YAML
  parsers (e.g. Cursor) to fail parsing, so the skill was skipped during
  installation (24/25 installed). The description is now quoted.
- Add a lint rule `description-unquoted-colon` that flags any skill description
  with an unquoted `: ` sequence, preventing recurrence. Includes a regression
  test.
- No skill semantic changes; existing evaluations remain valid.

## 0.2.1 — 2026-07-22

- First release published via the `release.yml` GitHub Actions workflow with
  `npm publish --provenance` (Sigstore / SLSA v1 provenance, GitHub OIDC). The
  published tarball carries `dist.attestations` linking it to this repository
  and the release workflow run.
- Republish to align the npm registry with the repository after the 0.2.0
  tarball was found to be a pre-fix artifact (its internal `release-manifest`
  still read version 0.1.0 with 23-skill counts). 0.2.1 carries the corrected
  manifest, regenerated adapters/checksums, and all repository fixes below.
- Relocate `.github/` to the repository root so CI, CODEOWNERS, and Issue/PR
  templates function; keep a package-local `.github/` for `install --withGithub`
  and the package-level audit (see ADR-0001).
- Bump GitHub Actions to Node 24 and `codeql-action/upload-sarif` to v4 across
  root workflows, package-local workflows, and the `installGithub` template.
- Add repo-root `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md` as the public
  repository surface.
- No skill semantic changes; existing evaluations remain valid.

## 0.2.0 — 2026-07-22

- Add `moonweave-help` (skill picker) and `moonweave-flow` (staged multi-skill runner), bringing the total to 25 focused Agent Skills with 25 thin command wrappers.
- Regenerate all platform adapters and checksums against the 25-skill set.
- Correct `release-manifest.json` content counts (skills/commands 23 → 25) and align the manifest version with `package.json`.
- Fix the governance-audit GitHub Action to run from the `governance-skills/` working directory so the SARIF audit uploads correctly.
- Correct `.moonweave/governance.json`: canonical language is English (`en`); maturity re-stated as M3 (pre-publication). Will return to M7 after publication, signing/OIDC provenance, and live in-product evaluation are complete.
- No skill semantic changes in this release; existing evaluations remain valid.

## 0.1.0 — 2026-07-22

- First complete release.
- 23 focused Agent Skills with 23 thin command wrappers.
- Supports Cursor, Codex, Claude Code, OpenCode, Kilo, Antigravity, and the generic `.agents/skills` format.
- Provides a project installer, doctor, route, artifact generation, repository audit, skill lint, and checksum.
- Provides GitHub Issue / PR / Action templates, Claude / Kilo / Antigravity marketplace metadata, and skills.sh install instructions.
- Introduces risk S0–S5, quality QA-L0–L5, maturity M0–M9, and the governance traceability matrix.
- Tri-lingual: English canonical with Chinese and Japanese companions across skills, commands, templates, docs, and policies.
