# 安装与分发指南

本项目提供多条互补路径。**从 GitHub 直接获取 skills 是最快的方式 — 无需 npm 发布。** 确定性 `npx` 安装器与 tarball 路径是可选的，仅当你除了 skills 本身还需要 CLI 工具（`route`、`audit`、`doctor`、`lint-skills`、`eval-static`、`checksums`）时才需要。

> 以下 GitHub 与 marketplace 命令在仓库推送到 `Moonweave-AI/governance`（`governance-skills/` 为子目录）后即可使用。npm 包 `@moonweave-ai/governance-skills` 需先在 npm 创建 `moonweave-ai` 组织（见 §7）。

## 1. Agent Skills CLI / skills.sh（推荐，无需发布）

只需要开放格式 skills 时 — 直接从 GitHub 源码运行：

```bash
# Install all skills into the current project
npx skills add Moonweave-AI/governance/governance-skills

# Install globally
npx skills add Moonweave-AI/governance/governance-skills -g

# Install a single skill
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

该方式安装 governance 仓库的 `governance-skills/skills/` 目录。当你还需要 Rules、slash commands、GitHub 模板、治理配置和安装 lock 时，使用 §3 或 §5 的 CLI。

## 2. GitHub CLI skill 安装

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

## 3. 直接从 GitHub 运行（无需发布）

clone governance 仓库的 `governance-skills/` 子目录后运行：

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance/governance-skills
npm install
npx moonweave-skills install --agents all --scope project --mode copy
```

也可以 clone 后不安装依赖直接运行：

```bash
git clone https://github.com/Moonweave-AI/governance.git
node governance-skills/bin/moonweave-skills.mjs \
  install --root ./your-project --agents all --mode copy
```

## 4. 平台原生 Marketplace（无需发布）

Marketplace 清单位于 governance 仓库根目录，因此各平台只需添加 `Moonweave-AI/governance` 仓库即可发现它们。

### Claude Code Plugin Marketplace

仓库根目录包含 `.claude-plugin/marketplace.json`，原生插件位于 `governance-skills/plugins/claude/moonweave-governance/`。

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

### Codex / ChatGPT Plugin Marketplace

仓库根目录包含 `.agents/plugins/marketplace.json`，原生插件位于 `governance-skills/plugins/codex/moonweave-governance/`。

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

随后在 Plugins Directory 中安装 **Moonweave Governance**。

### Cursor Plugin Marketplace

仓库根目录包含 `.cursor-plugin/marketplace.json`，原生插件位于 `governance-skills/plugins/cursor/moonweave-governance/`。在 Cursor 的 Plugin Marketplace 中添加 GitHub 仓库 `Moonweave-AI/governance`。

### Google Antigravity

governance 仓库根目录是原生 Antigravity 插件入口：它包含 `plugin.json`，而 `skills/` 与 `rules/` 目录位于 `governance-skills/` 子目录下。

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

### Kilo remote URL

`skills/index.json` 符合 Kilo remote skill index：

```jsonc
{
  "skills": {
    "urls": [
      "https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/"
    ]
  }
}
```

也可按 Kilo Marketplace 的贡献流程提交 `skills/<name>/`。

## 5. 从 GitHub 的确定性 CLI 安装器

CLI 安装器会复制 skills、commands、rules、GitHub 模板和 lock 文件。你可以从 clone 的仓库直接运行（§3），或在发布到 npm 后通过 npx 运行（§6）。

```bash
# From a clone (§3):
npx moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity --scope project --mode copy
npx moonweave-skills doctor --root .
npx moonweave-skills route --text "let the agent write to the production database"
```

安装位置因 agent 而异：

- **OpenCode**：Skills `.opencode/skills/`，Commands `.opencode/commands/`，rules `AGENTS.md`。OpenCode 也会直接发现 `.agents/skills/`，因此 `npx skills add` 同样适用。
- **Kilo**：项目 skills `.kilo/skills/`，全局 `~/.kilo/skills/`，项目 commands `.kilo/commands/`，rules `AGENTS.md`。
- **Antigravity**：项目 skills `.agents/skills/`，全局 `~/.gemini/config/skills/`，项目 rules `.agents/rules/`，全局 `~/.gemini/GEMINI.md`。
- **Cursor**：`.cursor/skills/`、`.cursor/commands/`、`.cursor/rules/moonweave-governance.mdc`。

## 6. 本地压缩包或 npm tarball

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

从 clone 本地构建 tarball：

```bash
cd governance/governance-skills
npm install
npm pack
```

## 7. npm / npx（需先在 npm 创建 @moonweave-ai 组织）

发布前，先用你的 npm 账号在 https://www.npmjs.com/org/create 创建 `moonweave-ai` 组织，然后在 `governance-skills/` 下：

```bash
npm publish --access public
```

发布后：

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

为选定平台全局安装：

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

在 npm 包发布之前，使用 §1–§5，它们完全从 GitHub 源码运行，无需 npm 发布。

## 8. 安装模式与安全

- 默认 `--mode copy`：推荐；适合 npx、压缩包、Windows 和 marketplace 分发。
- `--mode symlink`：只适合 skills 源目录会长期存在的开发环境。
- `--force`：仅在明确要覆盖已安装内容时使用。
- 安装记录：项目 `.moonweave/skills-lock.json` 或全局 `~/.moonweave/skills-lock.json`。
- `uninstall` 会保留已被用户修改、无法确认归属的文件。
- 安装第三方 skills 前，应审阅 `SKILL.md`、脚本、manifest、校验和和权限要求。
