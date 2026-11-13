# 治理追踪矩阵

本系统不试图用提示词“概括一切”，而是把每份规范映射到可调用技能、确定性检查和模板。

| 治理文档 | 主要 Skills | 确定性机制 | 典型模板 |
|---|---|---|---|
| Principles | router, security, gaps, governance-change | governance-map/checksums | RFC/ADR |
| Security-Ethics | security-review, release, incident, audit | secret/asset/file checks | threat-model, asset, exception, hazard |
| Organization | bootstrap, handoff, router | Owner/Backup 字段检查 | handoff, quality declaration |
| Community | community-contribution, issue, retro | contribution templates | Issue/CoC 流程记录 |
| Communication | issue, handoff, incident | canonical-link 检查 | meeting/action/handoff |
| Planning | triage, planning, bootstrap | lifecycle/risk/maturity 字段 | idea, discovery, prototype |
| RFC Process | rfc, adr, governance-change | frontmatter/status/决策范围/关系互逆/索引检查 | RFC/ADR |
| Workflow | brief, implementation, PR, review, release | repo baseline/CI/lockfile 检查 | brief, PR, runbook |
| Quality Assurance | QA, review, release, audit | test/quality/SBOM 证据检查 | test plan, quality, release report |
| Documentation Guide | docs, research, RFC, ADR | 连通文档图/metadata/link/stale 检查 | README/docs/research/cards |

机器可读映射见 `core/governance-map.json`。

当前生成视图是 [`DOCUMENT-ATLAS.md`](../DOCUMENT-ATLAS.md)、[`CHANGE-ATLAS.md`](../CHANGE-ATLAS.md) 和 [`DOCUMENT-INDEX.md`](../DOCUMENT-INDEX.md)。数据来自文档 frontmatter 与 `core/governance-map.json`，CI 检查这些视图是否最新。Agent 加载图谱或邻域。索引保留为审计台账。
