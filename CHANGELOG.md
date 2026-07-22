# Changelog

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
