# 平台兼容矩阵

| 平台 | 项目技能路径 | Always-on 指导 | 命令/工作流 | 原生分发 | 状态 |
|---|---|---|---|---|---|
| Codex | `.agents/skills` | `AGENTS.md` | 技能显式/自动调用 | `.agents/plugins/marketplace.json` + `.codex-plugin/plugin.json` | 已生成并验证 |
| Cursor | `.cursor/skills` | `.cursor/rules/*.mdc` / `AGENTS.md` | `.cursor/commands/*.md` | `.cursor-plugin/marketplace.json` | 已生成并验证 |
| Claude Code | `.claude/skills` | `CLAUDE.md` | `.claude/commands` / plugin commands | `.claude-plugin/marketplace.json` | 已生成并验证 |
| OpenCode | `.opencode/skills`，兼容 `.agents/skills` | `AGENTS.md` / `opencode.json` | `.opencode/commands` | 开放技能或 npx 安装 | 已验证路径与命令 |
| Kilo | `.kilo/skills`，兼容 `.agents/skills` / `.claude/skills` | `AGENTS.md` 或 `kilo.jsonc` instructions | `.kilo/commands` | `skills/index.json` remote URL / Kilo Marketplace | 已生成并验证 |
| Antigravity IDE / CLI | `.agents/skills` | `.agents/rules` / `~/.gemini/GEMINI.md` | Skills 自动成为 slash commands | 根 `plugin.json` / `agy plugin install` | 已生成并验证 |
| skills.sh / Skills CLI | 根 `skills/` | 不安装规则 | 技能显式/自动调用 | `npx skills add` | 开放格式 |

## 兼容策略

- `skills/<name>/SKILL.md` 是供应商中立的技能语义源。
- `commands/` 和 `rules/` 是可移植源组件。
- `scripts/build-adapters.mjs` 复制源组件并生成各平台 manifest；原生插件副本不手工维护。
- Always-on 规则只保留安全底线、事实源和路由原则，避免把完整治理文档注入每次会话。
- CLI 对确定性事项负责；平台权限、sandbox、CI 和人类 Review 负责强制边界。
- 平台格式发生变化时，更新 adapter、验证器与兼容矩阵，不分叉修改 23 个技能的业务语义。
