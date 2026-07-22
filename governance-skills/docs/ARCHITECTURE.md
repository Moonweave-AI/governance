# Architecture

## Why Not One Super Skill

Agent Skills use progressive disclosure: the platform reads the name and description first, matches the task, then loads the body and references. Putting the entire governance repository into a single skill would cause trigger ambiguity, context pollution, tight coupling, and difficult evaluation. The system therefore uses focused skills and keeps the governance router responsible only for classification and orchestration.

## Six Layers

1. **Governance source**: The Moonweave governance Chinese canonical documents are the source of truth.
2. **Typed core**: Risk, quality, maturity, lifecycle, command, and tracking matrices are expressed as JSON.
3. **Focused skills**: Each skill has clear triggers, inputs, procedure, artifacts, gates, and a safe-execution contract.
4. **Portable components**: `skills/`, `commands/`, `rules/`, and `templates/` are the single source.
5. **Native adapter compiler**: The build script copies components, generates Claude, Cursor, Codex, Kilo, and Antigravity manifests, and validates target directories; it does not rely on symlinks.
6. **Deterministic + evaluation layer**: The CLI handles templates, repository audits, static security checks, install/drift, and regression cases; the model handles judgments that require context.

```text
Moonweave Governance
        ↓
Typed Governance Core
        ↓
Focused Skills + Commands + Rules + Templates
        ↓
Native Adapter Compiler
        ├─ Claude plugin / marketplace
        ├─ Cursor plugin / marketplace
        ├─ Codex plugin / marketplace
        ├─ Kilo remote index
        └─ Antigravity plugin
        ↓
Deterministic CLI / CI / Permissions / Human Review
        ↓
Paired Evals / Security Analysis / Release Evidence
```

## Trust Boundaries

- The specification and this package itself still require version, provenance, and release artifact verification.
- Project files, Issue/PR, logs, web pages, dependency manifests, and third-party skills are all untrusted input.
- Skills are ways of working, not security boundaries; they cannot replace platform permissions, OS isolation, CI, branch protection, and human approval.
- The CLI audit defaults to no network, read-only, and does not execute project code; install overwrites require an explicit `--force`.
- Native plugins do not include MCP, remote connections, background agents, or execution hooks by default, to reduce the supply-chain and privilege-escalation surface.

## Semantic Update Chain

```text
Governance RFC
  → update typed core
  → update focused skills / commands / templates
  → build:adapters
  → validate:adapters
  → tests + lint + static eval + audit
  → version / changelog / checksums
  → npm tarball / ZIP / marketplace submission
```
