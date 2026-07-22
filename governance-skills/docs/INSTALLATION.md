# Installation and Distribution Guide

This project provides several complementary paths. **The fastest ways to get the skills are from GitHub directly — no npm publish required.** The deterministic `npx` installer and tarball paths are optional and only needed when you want the CLI tools (`route`, `audit`, `doctor`, `lint-skills`, `eval-static`, `checksums`) in addition to the skills themselves.

> The GitHub and marketplace commands below work now that the repository is pushed to `Moonweave-AI/governance` (with `governance-skills/` as a subdirectory). The npm package `@moonweave-ai/governance-skills` requires creating the `moonweave-ai` organization on npm first (see §7).

## 1. Agent Skills CLI / skills.sh (recommended, no publish needed)

When you only need the open-format skills — works directly from the GitHub source:

```bash
# Install all skills into the current project
npx skills add Moonweave-AI/governance/governance-skills

# Install globally
npx skills add Moonweave-AI/governance/governance-skills -g

# Install a single skill
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

This installs the `governance-skills/skills/` directory of the governance repo. When you also need Rules, slash commands, GitHub templates, governance configuration, and an install lock, use the CLI in §3 or §5.

## 2. GitHub CLI skill install

```bash
# Install all skills (interactive — choose agent and scope)
gh skill install Moonweave-AI/governance/governance-skills --all

# Install for a specific agent
gh skill install Moonweave-AI/governance/governance-skills --all --agent cursor --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent claude-code --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent codex --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent opencode --scope user

# Install a single skill
gh skill install Moonweave-AI/governance/governance-skills moonweave-governance-router
```

## 3. Run Directly from GitHub (no publish needed)

Clone and run from the `governance-skills/` subdirectory of the governance repo:

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance/governance-skills
npm install
npx moonweave-skills install --agents all --scope project --mode copy
```

You can also clone and run without installing dependencies:

```bash
git clone https://github.com/Moonweave-AI/governance.git
node governance-skills/bin/moonweave-skills.mjs \
  install --root ./your-project --agents all --mode copy
```

## 4. Platform-Native Marketplaces (no publish needed)

Marketplace manifests live at the governance repo root, so each platform can discover them by adding the `Moonweave-AI/governance` repository.

### Claude Code Plugin Marketplace

The repo root contains `.claude-plugin/marketplace.json`, and the native plugin is in `governance-skills/plugins/claude/moonweave-governance/`.

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

### Codex / ChatGPT Plugin Marketplace

The repo root contains `.agents/plugins/marketplace.json`, and the native plugin is in `governance-skills/plugins/codex/moonweave-governance/`.

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

Then install **Moonweave Governance** from the Plugins Directory.

### Cursor Plugin Marketplace

The repo root contains `.cursor-plugin/marketplace.json`, and the native plugin is in `governance-skills/plugins/cursor/moonweave-governance/`. Add the GitHub repository `Moonweave-AI/governance` in Cursor's Plugin Marketplace.

### Google Antigravity

The governance repo root is a native Antigravity plugin entry point: it contains `plugin.json`, and the `skills/` and `rules/` directories live under the `governance-skills/` subdirectory.

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

### Kilo remote URL

`skills/index.json` conforms to the Kilo remote skill index:

```jsonc
{
  "skills": {
    "urls": [
      "https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/"
    ]
  }
}
```

You can also submit `skills/<name>/` via the Kilo Marketplace contribution process.

## 5. Deterministic CLI installer from GitHub

The CLI installer copies skills, commands, rules, GitHub templates, and a lock file. You can run it directly from the cloned repo (§3) or, once published to npm, via npx (§6).

```bash
# From a clone (§3):
npx moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity --scope project --mode copy
npx moonweave-skills doctor --root .
npx moonweave-skills route --text "let the agent write to the production database"
```

Install locations vary by agent:

- **OpenCode**: Skills `.opencode/skills/`, Commands `.opencode/commands/`, rules `AGENTS.md`. OpenCode also discovers `.agents/skills/` directly, so `npx skills add` works too.
- **Kilo**: Project skills `.kilo/skills/`, global `~/.kilo/skills/`, project commands `.kilo/commands/`, rules `AGENTS.md`.
- **Antigravity**: Project skills `.agents/skills/`, global `~/.gemini/config/skills/`, project rules `.agents/rules/`, global `~/.gemini/GEMINI.md`.
- **Cursor**: `.cursor/skills/`, `.cursor/commands/`, `.cursor/rules/moonweave-governance.mdc`.

## 6. Local Archive or npm Tarball

```bash
# View contents
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills list

# Install into the current project for all supported platforms
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project --mode copy --with-github

# Post-install check
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills doctor --root .
```

Build a tarball locally from the clone:

```bash
cd governance/governance-skills
npm install
npm pack
```

## 7. npm / npx (requires creating the @moonweave-ai organization on npm)

Before publishing, create the `moonweave-ai` organization at https://www.npmjs.com/org/create with your npm account, then from `governance-skills/`:

```bash
npm publish --access public
```

After publishing:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

Install for select platforms globally:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

Until the npm package is published, use §1–§5, which work entirely from the GitHub source and require no npm publish.

## 8. Install Modes and Security

- Default `--mode copy`: recommended; suitable for npx, archives, Windows, and marketplace distribution.
- `--mode symlink`: only suitable for development environments where the skills source directory will persist long-term.
- `--force`: use only when you explicitly intend to overwrite installed content.
- Install records: project `.moonweave/skills-lock.json` or global `~/.moonweave/skills-lock.json`.
- `uninstall` preserves files that have been modified by the user or whose ownership cannot be confirmed.
- Before installing third-party skills, review `SKILL.md`, scripts, manifests, checksums, and permission requirements.
