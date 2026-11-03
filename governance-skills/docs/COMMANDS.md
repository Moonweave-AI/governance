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
Validate document metadata, canonical targets, decision identifiers and scopes, governed relation endpoints, graph connectivity, reciprocal links, the hot-atlas budget, changelog shape, and consolidation of new canonical records. The check rejects isolated records, disconnected subgraphs, overlapping current decisions, generic summaries on newly updated records, changelog stacks, mismatched changelog heads, and append-only `progress.md` diaries.

## `docs-index`

```bash
moonweave-skills docs-index --root . --view atlas
moonweave-skills docs-index --root . --view neighborhood --focus 05-Knowledge/en/01-Documentation-Guide.md
moonweave-skills docs-index --root . --view changes
moonweave-skills docs-index --root . --view all --out-dir docs --base-url release
moonweave-skills docs-index --root . --view all --out-dir docs --base-url release --check
```

Render the document graph from frontmatter and `core/governance-map.json`. `--view atlas` is the default and keeps one row per hot canonical record. `--view neighborhood` requires `--focus` and returns that record plus one hop. `--view changes` is the release chain and decision supersession. `--view full` is the audit ledger. `--view all` writes `DOCUMENT-ATLAS.md`, `CHANGE-ATLAS.md`, and `DOCUMENT-INDEX.md`. Frontmatter remains the source of truth. Use `--base-url release` for the immutable `v<package-version>` links shipped in the npm package. `--check` fails when a committed view is stale.

## `eval-static`
Run risk routing, positive/negative trigger cases for all 23 skills, and static security regressions.

## `checksums`
Generate `checksums.sha256` for the current skills package files.

## `uninstall`
Only remove files installed by the tool as recorded in the lock; it will not delete files whose ownership cannot be confirmed.
