# Moonweave Governance Skills

> **语言**：[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

将 [Moonweave AI Governance](https://github.com/Moonweave-AI/governance) 从“需要人工记忆的长文档”编译成可发现、可调用、可检查、可审计的 Agent Skills、命令、模板、CLI 与平台适配器。

> **版本：0.1.0**
> **规范快照日期：2026-07-22**
> **状态：Active / pre-publication；功能与安装包已验证，npm 与各平台市场仍需由 Moonweave AI 账号实际发布或提交审核。**
> **Owner：Moonweave AI Governance Maintainers；Backup Owner：Moonweave AI Stewardship Council。**

## 核心架构

```text
Moonweave Governance（权威语义）
        ↓
Typed Governance Core（风险/质量/生命周期/追踪矩阵）
        ↓
Focused Agent Skills（按任务渐进加载）
        ↓
Platform Adapters（Cursor / Codex / Claude / OpenCode / Kilo / Antigravity）
        ↓
Deterministic CLI & Hooks（能确定检查的不用模型猜）
        ↓
Paired Evals & Security Analysis（触发、非触发、任务结果、安全）
```

## 安装

### 从 GitHub / skills.sh（推荐，无需发布）

`governance` 仓库 `governance-skills/skills/` 目录符合 Agent Skills 开放格式，因此可被 skills.sh、Codex、Claude Code、Cursor、OpenCode、Kilo、Antigravity 等支持方发现。

```bash
# 装到当前项目
npx skills add Moonweave-AI/governance/governance-skills --all
# 全局安装
npx skills add Moonweave-AI/governance/governance-skills -g
# 或只安装一个技能
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

GitHub CLI skill 安装：

```bash
gh skill install Moonweave-AI/governance/governance-skills --all
gh skill install Moonweave-AI/governance/governance-skills --all --agent cursor --scope user
```

### Git clone 并运行

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance
node governance-skills/bin/moonweave-skills.mjs install --agents all --root /path/to/project
```

### 平台原生市场（无需发布）

marketplace 清单位于 governance 仓库根，各平台添加 `Moonweave-AI/governance` 仓库即可发现：

- Claude Code：`/plugin marketplace add Moonweave-AI/governance`
- Cursor：在 Cursor 插件市场添加 `Moonweave-AI/governance`
- Codex / ChatGPT：`codex plugin marketplace add Moonweave-AI/governance`
- Antigravity：`agy plugin install https://github.com/Moonweave-AI/governance`
- Kilo remote URL：`https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/`

### 从本地 tarball

```bash
cd governance-skills && npm install && npm pack
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project
```

### 发布到 npm 后

需先在 npm 创建 `moonweave-ai` 组织（见 [`docs/INSTALLATION.md`](docs/INSTALLATION.md)）：

```bash
npx @moonweave-ai/governance-skills install --agents all --scope project
```

各清单及插件目录由 `npm run build:adapters` 从同一 `skills/`、`commands/`、`rules/` 源生成，并由 `npm run validate:adapters` 检查。完整安装方式见 [`docs/INSTALLATION.md`](docs/INSTALLATION.md)。
```

## 常用命令

```bash
moonweave-skills list
moonweave-skills route --text "让Agent可以自动写入生产数据库"
moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity
moonweave-skills doctor --root .
moonweave-skills new rfc --title "统一长期记忆状态协议"
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills lint-skills
moonweave-skills checksums
```

完整命令见 [`docs/COMMANDS.md`](docs/COMMANDS.md)。

## 23个技能

| 类别 | 技能 |
|---|---|
| 路由与启动 | `moonweave-governance-router`, `moonweave-project-bootstrap` |
| 规划与决策 | `moonweave-idea-triage`, `moonweave-project-planning`, `moonweave-rfc`, `moonweave-adr` |
| 工程协作 | `moonweave-issue`, `moonweave-engineering-brief`, `moonweave-implementation`, `moonweave-pull-request`, `moonweave-code-review` |
| 安全与质量 | `moonweave-security-review`, `moonweave-quality-assurance`, `moonweave-release-readiness`, `moonweave-repository-audit` |
| 知识与研究 | `moonweave-documentation`, `moonweave-research` |
| 运行与组织 | `moonweave-incident-response`, `moonweave-handoff`, `moonweave-community-contribution` |
| 改进与治理 | `moonweave-gap-analysis`, `moonweave-retrospective`, `moonweave-governance-change` |

## 安全说明

Skills 并非安全边界。确定性限制应由权限系统、Hook、CI、分支保护、Secret 扫描、测试和人类 Review 执行。本包不会默认自动合并、发布、部署、删除数据或授予 Agent/具身权限。

详见 [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md) 与 [`SECURITY.md`](SECURITY.md)。

## 设计与兼容

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md)
- [`docs/GOVERNANCE-TRACEABILITY.md`](docs/GOVERNANCE-TRACEABILITY.md)
- [`docs/EVALUATION.md`](docs/EVALUATION.md)
- [`docs/REFERENCES.md`](docs/REFERENCES.md)
- [`docs/PUBLISHING.md`](docs/PUBLISHING.md)

## License

MIT
