# 架构设计

## 为什么不是一个超级技能

Agent Skills 使用渐进披露：平台先读取名称和描述，匹配任务后再加载正文与引用。把整个治理仓库放进一个技能会造成触发模糊、上下文污染、错误耦合和难以评测。因此系统使用聚焦技能，并让治理路由器只做分类与编排。

## 六层结构

1. **Governance source**：Moonweave governance 中文 canonical 文档是规范事实源。
2. **Typed core**：风险、质量、成熟度、生命周期、命令与追踪矩阵使用 JSON 表达。
3. **Focused skills**：每个技能有清晰触发、输入、过程、产物、门禁和安全执行契约。
4. **Portable components**：`skills/`、`commands/`、`rules/` 与 `templates/` 是单一源。
5. **Native adapter compiler**：构建脚本复制组件、生成 Claude、Cursor、Codex、Kilo 与 Antigravity 清单，并验证目标目录；不依赖 symlink。
6. **Deterministic + evaluation layer**：CLI 负责模板、仓库审计、静态安全检查、安装/漂移和回归用例；模型负责需要上下文的判断。

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

## 信任边界

- 规范和本包自身仍需版本、来源和发布制品验证。
- 项目文件、Issue/PR、日志、网页、依赖说明与第三方技能全部是不可信输入。
- Skills 是工作方法，不是安全边界；它们不能替代平台权限、操作系统隔离、CI、分支保护与人类批准。
- CLI 审计默认无网络、只读、不执行项目代码；安装覆盖需显式 `--force`。
- 原生插件不默认包含 MCP、远程连接、后台 agent 或执行 hooks，以减少供应链和越权面。

## 语义更新链

```text
Governance RFC
  → 更新 typed core
  → 更新 focused skills / commands / templates
  → 检查文档关系互逆性并重建文档索引
  → build:adapters
  → validate:adapters
  → tests + lint + static eval + audit
  → version / changelog / checksums
  → npm tarball / ZIP / marketplace submission
```

## 文档关系图

权威文档 frontmatter 是关系图事实源。`canonical` 对 canonical 记录及其翻译分组；`related` 形成双向上下文边；`supersedes` 与 `superseded_by` 形成互逆生命周期边；`decision_scope` 为 RFC 与 ADR 提供共享的决策身份。`core/governance-map.json` 再把 canonical 治理文档连接到执行它们的技能。

`docs-index` 从同一张图渲染四种视图。`atlas` 是 Agent 的默认加载：每个热 canonical 记录一行，并受固定预算约束。`neighborhood --focus <path>` 加载该记录和一跳。`changes` 是发布链加上决策替代。`full` 是每份译文和每条边的审计台账。生成视图不是第二权威。起草前，Agent 读取图谱；某一行可能已经拥有该事实时，再读一个邻域。修改后运行 `lint-docs`，用 `--view all` 重建视图，并用 `--check` 防止漂移。门禁保持图连通、热图谱不超出预算、新的 canonical 记录被整合或显式成为新权威、变更日志头一致，并且仓库中不存在进度日记。
