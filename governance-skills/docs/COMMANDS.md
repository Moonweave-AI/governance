# CLI Commands

## `list`
List skills, commands, templates, and platforms.

## `install`

```bash
moonweave-skills install --root . --agents all --scope project --mode copy
```

Parameters: `--agents`, `--scope project|global`, `--mode copy|symlink`, `--force`, `--with-github`.

## `doctor`
Check Node version, package integrity, platform target directories, the skills lock, and project governance configuration.

## `route`

```bash
moonweave-skills route --text "New agent tool that can write to the production database"
```
Outputs suggested risk, quality, maturity, required skills, and artifacts. It is a heuristic recommendation and does not replace Owner/security review.

## `new`

```bash
moonweave-skills new rfc --title "Unified long-term memory protocol" --out 05-Knowledge/rfc/0000-memory.md
```
Supports: idea, discovery, prototype, brief, rfc, adr, issue, pr, test-plan, quality, release, research, paper-review, dataset-card, model-card, agent-card, runbook, incident, postmortem, handoff, asset, threat-model, hazard-analysis, exception.

## `audit`

```bash
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills audit --root . --profile embodied --format sarif --out audit.sarif
```
Profiles: docs, library, service, ai-agent, embodied, auto.

## `lint-skills`
Check Agent Skills frontmatter, names, description length, safe-execution contracts, dangerous instructions, and resource file sizes.

## `lint-docs`
Validate document metadata, canonical targets, decision identifiers and scopes, local relation targets, graph connectivity, reciprocal `related` links, and reciprocal `supersedes`/`superseded_by` lifecycle links. The check rejects isolated records, disconnected subgraphs, overlapping current RFC or ADR authorities for one `decision_scope`, and ADRs that omit an existing same-scope RFC link. A superseded record must name its successor and use status `Superseded`.

## `docs-index`

```bash
moonweave-skills docs-index --root . --format json
moonweave-skills docs-index --root . --out docs/DOCUMENT-INDEX.md
moonweave-skills docs-index --root . --out docs/DOCUMENT-INDEX.md --base-url https://github.com/OWNER/REPO/blob/main/
moonweave-skills docs-index --root . --out docs/DOCUMENT-INDEX.md --check
```

Generate an LLM-readable JSON graph or a clickable Markdown table from authoritative document frontmatter and `core/governance-map.json`. Frontmatter remains the source of truth; the Markdown file is a generated view. Use `--base-url` when the generated index is distributed without the referenced repository documents, such as in an npm package. `--check` fails when the committed view is stale.

## `eval-static`
Run risk routing, positive/negative trigger cases for all 23 skills, and static security regressions.

## `checksums`
Generate `checksums.sha256` for the current skills package files.

## `uninstall`
Only remove files installed by the tool as recorded in the lock; it will not delete files whose ownership cannot be confirmed.
