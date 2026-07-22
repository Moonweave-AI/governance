# Platform Compatibility Matrix

| Platform | Project skills path | Always-on guidance | Commands/workflows | Native distribution | Status |
|---|---|---|---|---|---|
| Codex | `.agents/skills` | `AGENTS.md` | Skills explicit/auto invocation | `.agents/plugins/marketplace.json` + `.codex-plugin/plugin.json` | Generated and verified |
| Cursor | `.cursor/skills` | `.cursor/rules/*.mdc` / `AGENTS.md` | `.cursor/commands/*.md` | `.cursor-plugin/marketplace.json` | Generated and verified |
| Claude Code | `.claude/skills` | `CLAUDE.md` | `.claude/commands` / plugin commands | `.claude-plugin/marketplace.json` | Generated and verified |
| OpenCode | `.opencode/skills`, compatible with `.agents/skills` | `AGENTS.md` / `opencode.json` | `.opencode/commands` | Open skills or npx install | Paths and commands verified |
| Kilo | `.kilo/skills`, compatible with `.agents/skills` / `.claude/skills` | `AGENTS.md` or `kilo.jsonc` instructions | `.kilo/commands` | `skills/index.json` remote URL / Kilo Marketplace | Generated and verified |
| Antigravity IDE / CLI | `.agents/skills` | `.agents/rules` / `~/.gemini/GEMINI.md` | Skills auto-become slash commands | Root `plugin.json` / `agy plugin install` | Generated and verified |
| skills.sh / Skills CLI | Root `skills/` | Does not install rules | Skills explicit/auto invocation | `npx skills add` | Open format |

## Compatibility Strategy

- `skills/<name>/SKILL.md` is the vendor-neutral semantic source of the skill.
- `commands/` and `rules/` are portable source components.
- `scripts/build-adapters.mjs` copies source components and generates per-platform manifests; native plugin copies are not maintained manually.
- Always-on rules keep only the safety baseline, source of truth, and routing principles, to avoid injecting the full governance document into every session.
- The CLI is responsible for deterministic matters; platform permissions, sandbox, CI, and human review enforce the boundaries.
- When platform formats change, update the adapter, validators, and compatibility matrix, without forking the business semantics of the 23 skills.
