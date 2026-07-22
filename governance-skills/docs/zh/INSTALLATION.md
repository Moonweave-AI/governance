# 安装与分发指南

本项目提供三条互补路径：开放 Agent Skills、确定性 `npx` 安装器、平台原生插件/市场清单。默认使用**复制安装**，避免临时 `npx` 目录消失、Windows junction 差异和市场打包器不跟随 symlink 的问题。

> 以下 GitHub 与市场命令在仓库推送到 `Moonweave-AI/governance`（`governance-skills/` 为子目录）后生效。当前压缩包已包含可发布清单，但尚未由 Moonweave AI 账号实际发布到 npm 或提交市场审核。

## 1. 本地压缩包或 npm tarball

```bash
# 查看内容
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills list

# 为所有受支持平台安装到当前项目
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project --mode copy --with-github

# 安装后检查
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills doctor --root .
```

## 2. npm / npx

发布后：

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

全局安装某个平台：

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

## 3. GitHub 直接运行

无需先发布 npm。clone governance 仓库的 `governance-skills/` 子目录后运行：

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

## 4. Agent Skills CLI / skills.sh

只需要开放格式技能时：

```bash
npx skills add Moonweave-AI/governance/governance-skills --all
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

该方式安装 governance 仓库的 `governance-skills/skills/` 目录。需要 Rules、slash commands、GitHub 模板、治理配置和安装 lock 时，再运行本包 CLI。

## 5. Claude Code Plugin Marketplace

仓库根目录包含 `.claude-plugin/marketplace.json`，原生插件位于 `plugins/claude/moonweave-governance/`。

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

也可以直接安装项目技能：

```bash
npx @moonweave-ai/governance-skills install --agents claude --scope project
```

## 6. Codex / ChatGPT Plugin Marketplace

仓库根目录包含 `.agents/plugins/marketplace.json`，原生插件位于 `plugins/codex/moonweave-governance/`。

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

随后在 Plugins Directory 中安装 **Moonweave Governance**。项目技能也可以直接装到 `.agents/skills/`：

```bash
npx @moonweave-ai/governance-skills install --agents codex --scope project
```

## 7. Cursor Plugin Marketplace

仓库根目录包含 `.cursor-plugin/marketplace.json`，原生插件位于 `plugins/cursor/moonweave-governance/`。在 Cursor 的 Plugin Marketplace 中添加 GitHub 仓库 `Moonweave-AI/governance`，或使用确定性安装器：

```bash
npx @moonweave-ai/governance-skills install --agents cursor --scope project
```

安装器会放置 `.cursor/skills/`、`.cursor/commands/` 与 `.cursor/rules/moonweave-governance.mdc`。

## 8. OpenCode

```bash
npx @moonweave-ai/governance-skills install --agents opencode --scope project
```

安装位置：

- 技能：`.opencode/skills/`
- 命令：`.opencode/commands/`
- 项目规则：根目录 `AGENTS.md`

OpenCode 也能直接发现 `.agents/skills/`，因此 `npx skills add` 同样适用。

## 9. Kilo

### 本地安装

```bash
npx @moonweave-ai/governance-skills install --agents kilo --scope project
```

- 项目技能：`.kilo/skills/`
- 全局技能：`~/.kilo/skills/`
- 项目命令：`.kilo/commands/`
- 项目规则：`AGENTS.md`

### Remote URL

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

## 10. Google Antigravity

仓库根目录是原生 Antigravity 插件入口：包含 `plugin.json`，而 `skills/` 与 `rules/` 目录位于 `governance-skills/` 子目录下。

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

直接项目安装：

```bash
npx @moonweave-ai/governance-skills install --agents antigravity --scope project
```

- 项目技能：`.agents/skills/`
- 全局技能：`~/.gemini/config/skills/`
- 项目规则：`.agents/rules/`
- 全局规则：`~/.gemini/GEMINI.md`

## 11. 安装模式与安全

- 默认 `--mode copy`：推荐，适合 npx、压缩包、Windows 和市场分发。
- `--mode symlink`：只适合技能源目录会长期存在的开发环境。
- `--force`：仅在明确要覆盖已安装内容时使用。
- 安装记录：项目 `.moonweave/skills-lock.json` 或全局 `~/.moonweave/skills-lock.json`。
- `uninstall` 会保留已被用户修改、无法确认归属的文件。
- 安装第三方技能前，应审阅 `SKILL.md`、脚本、manifest、校验和和权限要求。
