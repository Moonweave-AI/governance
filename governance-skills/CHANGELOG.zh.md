# Changelog

## 0.2.3 — 2026-07-22

- 修复生产部署与自主写入的风险路由，并同步所有 Skill 的版本元数据。
- 新增治理文档元数据校验与统一 frontmatter，明确状态、Owner、时间、复审周期、权威来源和替代关系。

## 0.2.2 — 2026-07-22

- 修复 Pull Request Skill 描述中未加引号的冒号，并新增静态检查。

## 0.2.1 — 2026-07-22

- 通过带 provenance 的发布流程发布，并修复发布清单与仓库内容的同步。

## 0.2.0 — 2026-07-22

- 新增 `moonweave-help` 与 `moonweave-flow`，共 25 个 Skills。

## 0.1.0 — 2026-07-22

- 首次完整发布。
- 23 个 Focused Agent Skills 与 23 个命令薄封装。
- 支持 Cursor、Codex、Claude Code、OpenCode、Kilo、Antigravity 及通用 `.agents/skills`。
- 提供项目安装器、doctor、route、artifact 生成、仓库 audit、skill lint 和 checksum。
- 提供 GitHub Issue/PR/Action 模板、Claude/Kilo/Antigravity marketplace 元数据和 skills.sh 安装说明。
- 引入风险 S0–S5、质量 QA-L0–L5、成熟度 M0–M9 和治理追踪矩阵。
- 三语化：英文主版，中文与日文副版覆盖 skills、commands、templates、docs 与 policies。
