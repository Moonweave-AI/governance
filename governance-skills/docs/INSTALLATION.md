# Installation and Distribution Guide

This project provides three complementary paths: open Agent Skills, a deterministic `npx` installer, and platform-native plugin/marketplace manifests. The default is **copy install**, which avoids issues with temporary `npx` directories disappearing, Windows junction differences, and marketplace packagers that do not follow symlinks.

> The GitHub and marketplace commands below take effect once the repository is pushed to `Moonweave-AI/governance` (with `governance-skills/` as a subdirectory). The current archive already contains publication-ready manifests, but has not yet been actually published to npm or submitted for marketplace review by the Moonweave AI account.

## 1. Local Archive or npm Tarball

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

## 2. npm / npx

After publishing:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

Install for a single platform globally:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

## 3. Run Directly from GitHub

No need to publish to npm first. Clone and run from the `governance-skills/` subdirectory of the governance repo:

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

## 4. Agent Skills CLI / skills.sh

When you only need the open-format skills:

```bash
npx skills add Moonweave-AI/governance/governance-skills --all
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

This installs the `governance-skills/skills/` directory of the governance repo. When you also need Rules, slash commands, GitHub templates, governance configuration, and an install lock, run this package's CLI.

## 5. Claude Code Plugin Marketplace

The repository root contains `.claude-plugin/marketplace.json`, and the native plugin is in `plugins/claude/moonweave-governance/`.

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

You can also install project skills directly:

```bash
npx @moonweave-ai/governance-skills install --agents claude --scope project
```

## 6. Codex / ChatGPT Plugin Marketplace

The repository root contains `.agents/plugins/marketplace.json`, and the native plugin is in `plugins/codex/moonweave-governance/`.

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

Then install **Moonweave Governance** from the Plugins Directory. Project skills can also be installed directly into `.agents/skills/`:

```bash
npx @moonweave-ai/governance-skills install --agents codex --scope project
```

## 7. Cursor Plugin Marketplace

The repository root contains `.cursor-plugin/marketplace.json`, and the native plugin is in `plugins/cursor/moonweave-governance/`. Add the GitHub repository `Moonweave-AI/governance` in Cursor's Plugin Marketplace, or use the deterministic installer:

```bash
npx @moonweave-ai/governance-skills install --agents cursor --scope project
```

The installer places `.cursor/skills/`, `.cursor/commands/`, and `.cursor/rules/moonweave-governance.mdc`.

## 8. OpenCode

```bash
npx @moonweave-ai/governance-skills install --agents opencode --scope project
```

Install locations:

- Skills: `.opencode/skills/`
- Commands: `.opencode/commands/`
- Project rules: `AGENTS.md` at the repository root

OpenCode also discovers `.agents/skills/` directly, so `npx skills add` works as well.

## 9. Kilo

### Local Install

```bash
npx @moonweave-ai/governance-skills install --agents kilo --scope project
```

- Project skills: `.kilo/skills/`
- Global skills: `~/.kilo/skills/`
- Project commands: `.kilo/commands/`
- Project rules: `AGENTS.md`

### Remote URL

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

## 10. Google Antigravity

The repository root is a native Antigravity plugin entry point: it contains `plugin.json`, and the `skills/` and `rules/` directories live under the `governance-skills/` subdirectory.

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

Direct project install:

```bash
npx @moonweave-ai/governance-skills install --agents antigravity --scope project
```

- Project skills: `.agents/skills/`
- Global skills: `~/.gemini/config/skills/`
- Project rules: `.agents/rules/`
- Global rules: `~/.gemini/GEMINI.md`

## 11. Install Modes and Security

- Default `--mode copy`: recommended; suitable for npx, archives, Windows, and marketplace distribution.
- `--mode symlink`: only suitable for development environments where the skills source directory will persist long-term.
- `--force`: use only when you explicitly intend to overwrite installed content.
- Install records: project `.moonweave/skills-lock.json` or global `~/.moonweave/skills-lock.json`.
- `uninstall` preserves files that have been modified by the user or whose ownership cannot be confirmed.
- Before installing third-party skills, review `SKILL.md`, scripts, manifests, checksums, and permission requirements.
