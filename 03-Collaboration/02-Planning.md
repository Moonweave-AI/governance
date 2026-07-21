# 合作规划规范

> 本文定义辉夜计划从一个想法、实验、原型或需求开始，如何判断它是否值得做；如何验证；如何进入 RFC / 设计；如何拆解为工程任务；如何完成测试、发布、上线、运维和复盘；以及何时暂停、归档或终止。它是所有项目从 **Idea → Prototype → Engineering → Release → Operation** 的统一流程——不是单纯 Roadmap 文档，也不是项目管理工具说明。

本文不替代 `03-RFC-Process.md` 的正式决策流程，也不替代 `02-Security-Ethics.md` 的安全审查与 `01-Organization.md` 的角色权限定义。本文只定义规划对象的流转、门禁、成熟度与责任归属。

---

## 1. 目的

本文定义辉夜计划从想法、实验和原型，到正式工程化、发布、运行和归档的统一规划流程。

规划的目标不是制造流程负担，而是确保每项工作都有明确问题、Owner、风险等级、验证方式、交付标准和后续责任。目标只有两个：让真正值得做的事落地，让不值得做的事体面退场。

---

## 2. 规划原则

八条，专门约束规划系统：

1. **从问题开始，而不是从实现开始** — 任何项目在进入工程化之前，必须说明它解决什么问题、服务谁、为什么现在做，以及不做会造成什么损失。对辉夜计划，"客户"不一定是商业用户，也可能是 Agent 系统、研究流程、开源贡献者、未来具身终端、Infra 运行环境、长期记忆系统、开发者与维护者。每个项目都应回答：Who benefits? What changes after this exists? Why is this better than the current state? Why now? What should not be built?
2. **先验证高不确定性，再投入重工程** — 项目早期应优先验证最大不确定性：技术是否可行、数据是否可获得、模型能力是否足够、安全边界是否可控、系统是否真的需要、是否会破坏现有架构、维护成本是否可接受。不优先构造完整系统。
3. **原型不是生产系统** — 原型用于学习，不能在缺少 Owner、测试、文档、安全审查和运行责任的情况下默默变成生产依赖。Notebook / demo / script 被临时给别人用、被其他系统依赖、无人敢改无人敢删——这种腐烂路径必须在原型阶段就堵住。
4. **风险决定流程强度** — 低风险、可逆、小范围变更轻量推进；高风险、跨仓库、不可逆、涉及安全/隐私/具身/长期状态的变更必须经过更强审查。复用 `02-Security-Ethics.md` §3 的 S0–S5 与 Blocked 等级。
5. **计划必须有 Owner，执行必须有 DRI** — 每个规划对象都必须有 Owner（资产或方向的长期责任）；每个活跃推进事项都必须有 DRI（把事情推进到下一个门禁）。没有 DRI 的项目不能进入活跃状态；没有 Owner 的项目不能进入长期维护或生产。
6. **Roadmap 是承诺管理，不是愿望清单** — 进入 Roadmap 的项目必须具备明确价值、范围、Owner、风险等级、目标阶段和下一次复审时间。未验证想法不应直接进入 Roadmap，应放在 Idea Backlog 或 Discovery Queue。
7. **决策应沉淀，状态应可见** — 项目状态、风险、阻塞、里程碑、Owner 和决策依据必须可追踪。GitHub Projects 是工程规划事实源；聊天、会议、Notion 可以引用，但不得制造并行事实。
8. **完成不等于合并，发布不等于成功** — 一个项目只有在被验证、发布、监控、交接并完成反馈闭环后，才算真正落地。

---

## 3. 工作对象与规划层级

规划对象分层，否则小 Issue 和多年项目会混在一起。

| 层级             | 定义           | 例子                             | 默认工具                           |
| -------------- | ------------ | ------------------------------ | ------------------------------ |
| **Idea**       | 未验证想法        | "是否需要 Agent Memory Inspector？" | GitHub Discussion / Issue      |
| **Task**       | 小型明确任务       | 修复 bug、补文档、增加测试                | GitHub Issue                   |
| **Experiment** | 为验证假设而做的短期工作 | 比较两种 memory retrieval 策略       | Research Log + Issue           |
| **Prototype**  | 可运行但未工程化的验证物 | Agent sandbox demo             | Issue + Notion Brief           |
| **Feature**    | 可交付功能        | 新增 API、UI 模块、评测工具              | GitHub Project Item            |
| **Project**    | 多任务、多阶段交付    | Memory Persistence v1          | Project Brief + GitHub Project |
| **Program**    | 多 Area、多季度方向 | Embodied Runtime Roadmap       | Roadmap + RFC set              |
| **Operation**  | 已上线长期资产      | API 服务、模型服务、数据管线               | Owner Registry + Runbook       |

Issue / Project / RFC 的边界：小范围、低风险、可逆变更走 Issue + PR；需要协调多个任务走 Project；影响架构、公共契约、长期维护、安全边界或多个仓库走 RFC；已经作出的架构选择记为 ADR。

---

## 4. 生命周期总览

```text
0. Idea Intake
   ↓
1. Triage
   ↓
2. Discovery / Problem Validation
   ↓
3. Prototype / Experiment
   ↓
4. Proposal / RFC / Design
   ↓
5. Planning Breakdown
   ↓
6. Build & Integration
   ↓
7. Verification
   ↓
8. Release Readiness
   ↓
9. Staged Rollout
   ↓
10. Operation
   ↓
11. Improve / Retire
```

状态字段：

| 状态                      | 含义                            |
| ----------------------- | ----------------------------- |
| `Inbox`                 | 新想法，尚未分类                      |
| `Needs Triage`          | 等待初筛                          |
| `Discovery`             | 问题验证中                         |
| `Prototype`             | 原型 / 实验中                      |
| `Needs RFC`             | 需要正式提案                        |
| `Design Review`         | 方案审查中                         |
| `Planning Breakdown`    | 拆解任务和里程碑                      |
| `Ready for Engineering` | 可进入正式开发                       |
| `In Development`        | 开发中                           |
| `In Review`             | PR / Design / Safety Review 中 |
| `Verification`          | 集成、测试、评测中                     |
| `Release Candidate`     | 候选发布                          |
| `Staged Rollout`        | 灰度或分阶段上线                      |
| `Operational`           | 已进入长期运行                       |
| `Improve`               | 基于反馈继续迭代                      |
| `Paused`                | 暂停                            |
| `Archived`              | 归档                            |
| `Terminated`            | 终止                            |

阶段可以重叠或在高确定性情况下跳过，但关键输出和责任仍需明确。

---

## 5. 风险与成熟度

所有规划对象必须标记：

- **Risk**: S0–S5 / Blocked（与 `02-Security-Ethics.md` §3 一致）
- **Maturity**: M0–M9（见下）
- **Owner**、**DRI**、**Area**、**Next Review**

风险决定流程强度：

| 风险等级                | 规划强度                                                   |
| ------------------- | ------------------------------------------------------ |
| S0 文档 / 低风险         | Issue + PR 即可                                          |
| S1 本地实验             | Issue + 实验记录                                           |
| S2 可复用组件            | Issue + 设计说明 + 测试计划                                    |
| S3 联网服务 / 持久化系统     | Project Brief + Design Review + Release Gate           |
| S4 AI / Agent 高影响系统 | RFC + AI Safety Review + Eval Plan                     |
| S5 具身 / 物理系统        | RFC + Safety Review + Simulation Gate + Staged Rollout |

### Moonweave Maturity Level

| 等级     | 名称                   | 定义               |
| ------ | -------------------- | ---------------- |
| **M0** | Idea                 | 只有想法，尚未验证        |
| **M1** | Concept              | 问题和概念初步清楚        |
| **M2** | Proof of Concept     | 已验证关键可行性         |
| **M3** | Prototype            | 有可运行原型，但未工程化     |
| **M4** | Relevant Environment | 在接近真实环境中验证       |
| **M5** | Integrated Prototype | 与部分真实系统集成        |
| **M6** | Beta / Pilot         | 有真实用户或内部运行       |
| **M7** | Production Candidate | 接近生产要求，等待发布门禁    |
| **M8** | GA / Production      | 正式可用，有支持和运维      |
| **M9** | Sustained Operation  | 长期运行，有维护、迭代和退役机制 |

---

## 6. Gate 0：Idea Intake

**目标**：让想法进入系统，但不承诺会做。

**入口**：GitHub Discussion；GitHub Issue；飞书 / 微信 / Discord 社区讨论；研究日志；用户反馈；事故复盘；RFC 反向拆解；Maintainer / Owner 提案；Agent 自动发现的系统缺口。

**Idea 最低格式**：

```markdown
# Idea

## Summary
一句话说明想法。

## Problem
当前有什么问题？

## Why now
为什么现在值得考虑？

## Affected area
Agent / Infra / Frontend / Backend / Embodiment / Research / Docs / Security

## Expected value
它可能改善什么？

## Known risks
安全、隐私、合规、AI、具身、维护成本等风险。

## Related links
Issue / PR / RFC / ADR / Research log / external reference
```

**Gate 0 出口**：

| 结果                         | 含义        |
| -------------------------- | --------- |
| `Accept for Triage`        | 进入初筛      |
| `Needs Clarification`      | 信息不足      |
| `Duplicate`                | 已有类似事项    |
| `Out of Scope`             | 不符合项目边界   |
| `Blocked by Security / IP` | 触发安全或来源阻断 |
| `Archive`                  | 保留但不推进    |

---

## 7. Gate 1：Triage

**目标**：将想法转化为可判断的规划对象。

**Triage 必须完成**：Type、Area、Risk level、Potential Owner、Suggested DRI、Priority、Maturity target、Required process（Issue / Experiment / RFC / ADR / Project）、Next step。

**类型分类**：`bug` / `feature` / `research` / `experiment` / `prototype` / `infra` / `security` / `embodiment` / `docs` / `rfc` / `deprecation` / `release`。

**优先级**——不只用 P0/P1/P2，组合以下维度：

| 字段                 | 问题               |
| ------------------ | ---------------- |
| Mission Alignment  | 是否服务长期目标？        |
| Impact             | 成果影响范围多大？        |
| Urgency            | 是否阻塞其他工作？        |
| Confidence         | 证据是否充分？          |
| Cost               | 人力和时间成本多高？       |
| Risk               | 安全、隐私、工程、具身风险多高？ |
| Maintenance Burden | 长期维护成本多高？        |
| Reversibility      | 做错后是否容易回滚？       |

---

## 8. Gate 2：Discovery / Problem Validation

**目标**：确认问题真实存在、值得解决，且边界足够清楚。

**必须经过 Discovery 的事项**：新系统；新产品化能力；新公共 API；新 Agent 行为；新模型服务；新长期状态或记忆机制；新具身控制能力；跨仓库重构；高维护成本平台化工作。

**Discovery 输出**：

```markdown
# Discovery Brief

## Problem Statement
## Users / Stakeholders
## Current State
## Evidence
## Success Metrics
## Non-goals
## Risk Classification (S0–S5)
## Alternatives (至少 2 个，包括"不做")
## Recommendation (Prototype / RFC / Backlog / Reject / Archive)
```

在问题尚未被充分理解时，先验证用户问题、目标和关键指标，而不是直接进入构建。

---

## 9. Gate 3：Prototype / Experiment

**目标**：用最小成本验证最大不确定性。

**原型类型**：

| 类型                      | 用途         | 例子                       |
| ----------------------- | ---------- | ------------------------ |
| `Research Spike`        | 验证理论或论文方法  | 复现某个 memory paper        |
| `Technical Spike`       | 验证工程可行性    | 测试状态机持久化方案               |
| `UX Prototype`          | 验证交互与信息架构  | Agent state inspector UI |
| `AI Eval Prototype`     | 验证模型能力与评测  | 长期人格一致性 benchmark        |
| `Embodied Simulation`   | 验证物理控制前置条件 | 仿真环境动作边界测试               |
| `Integration Prototype` | 验证多系统连接    | Agent 调用工具链 demo         |

**原型必须写清楚**：Hypothesis；What is being tested；What is intentionally ignored；Dataset / Asset source；Environment；Success criteria；Failure criteria；Risk level；Owner；Expiration date；Promotion path；Cleanup path。

**原型禁止事项**：不得默认进入生产；不得绕过资产来源审查；不得使用未审查个人数据；不得在无边界条件下连接真实用户、生产系统或具身终端；不得长期被其他系统依赖而没有工程化计划。

**Gate 3 出口**：

| 结果                        | 后续              |
| ------------------------- | --------------- |
| `Promote to RFC / Design` | 进入正式方案          |
| `Promote to Engineering`  | 低风险且方案明确，可直接工程化 |
| `Continue Experiment`     | 信息不足，需要限定时间继续   |
| `Archive`                 | 学到东西但不推进        |
| `Terminate`               | 假设失败，停止投入       |

ML 系统的挑战不只是训练模型，而是构建包含配置、数据收集与验证、测试、元数据、Serving 和监控的完整系统；实验还需记录什么有效、什么无效，以保持可复现性。

---

## 10. Gate 4：Proposal / RFC / Design

**目标**：将已验证的问题和方案转化为可审查、可讨论、可执行的正式计划。

**什么时候必须 RFC**——满足任一条件，必须进入 RFC 或等价正式提案：

- 跨仓库或跨 Area；
- 改变公共 API、协议、Schema 或状态机；
- 引入长期基础设施；
- 改变安全、隐私、权限或数据处理边界；
- 引入高自治 Agent 行为；
- 涉及具身控制、传感器、执行器或物理风险；
- 引入重大依赖或技术栈；
- 造成不可轻易回滚的迁移；
- 对开源社区或外部用户形成长期承诺。

普通修复不需要正式提案，但重大功能、架构、流程变化需要公开设计、社区输入和决策记录。正式撰写前先公开讨论，避免投入大量时间后发现方向不适用。详细流程见 `03-RFC-Process.md`。

**RFC / Design 最低内容**：Summary；Problem；Goals；Non-goals；Background；Proposed solution；Alternatives；Risks and mitigations；Security / privacy impact；AI / Agent impact；Embodiment impact（if any）；Data and asset provenance；Compatibility and migration；Testing / evaluation plan；Observability plan；Rollout and rollback plan；Owner / DRI；Milestones；Success metrics；Exit criteria。

---

## 11. Gate 5：Planning Breakdown

**目标**：把通过审查的方案拆成可执行、可跟踪、可交付的工作包。

**必须完成**：Project Brief 已更新；RFC / Design 已接受或低风险豁免；Owner 与 DRI 已确认；任务已拆解为 Issues；关键依赖已标注；里程碑已设定；Release strategy 已说明；Quality bar 已定义；Security / privacy / AI / embodiment reviews 已排期；文档、测试、评测、运维工作被纳入计划。

**工程 Issue 字段**：Title；Context；Scope；Acceptance criteria；Out of scope；Risk level；Owner / Assignee；Related RFC / ADR；Dependencies；Test requirement；Documentation requirement；Rollout impact。

**Milestone 规则**——Milestone 不只是日期，必须表达一个可验证的系统状态。

好例子：

```markdown
Memory Persistence v1:
- Agent state can be saved, restored and inspected in local runtime.
- State schema is versioned.
- Migration path from v0 is documented.
- Integration tests cover crash recovery.
```

坏例子：

```markdown
做完记忆系统第一阶段。
```

---

## 12. Gate 6：Build & Integration

**目标**：执行工程实现，并持续同步状态、风险和范围变化。

**开发期规则**：所有实现工作必须链接到 Issue；所有 PR 必须链接到 Issue / RFC / ADR；范围变化必须回写 Project Brief 或 RFC；新风险必须即时标注；被阻塞超过约定时间的事项必须升级；不得用 PR 讨论替代 RFC 级方向争论。

**状态更新要求**——活跃项目至少每周更新一次：Status；Progress；Blockers；Risks；Scope changes；Next step；Need decision。若两次规划周期无更新，应自动标记为 `Stale / Needs DRI Review`。

---

## 13. Gate 7：Verification

**目标**：确认系统不仅"能跑"，而且达到交付标准。

| 维度            | 必须回答                        |
| ------------- | --------------------------- |
| Functional    | 是否实现需求？                     |
| Integration   | 是否和相关系统正确交互？                |
| Compatibility | 是否破坏 API / Schema / 数据？     |
| Security      | 是否通过安全检查？                   |
| Privacy       | 是否符合数据与记忆规则？                |
| AI Evaluation | 是否通过能力、安全、稳定性评测？            |
| Embodiment    | 是否通过仿真、边界、急停、HITL 要求？       |
| Observability | 是否有日志、指标、Tracing、告警？        |
| Documentation | 用户、开发者、维护者文档是否更新？           |
| Operations    | 是否有 runbook、rollback、Owner？ |

AI 项目的验证不应只看 benchmark，也要覆盖风险、上下文、测量和治理（对齐 NIST AI RMF 的 Govern / Map / Measure / Manage）。

---

## 14. Gate 8：Release Readiness

**目标**：确认系统可以被发布、上线、公开或进入长期运行。

**Release Readiness Checklist**：

```markdown
## Ownership
- [ ] Primary Owner 已确认
- [ ] Backup Owner 已确认
- [ ] DRI 已确认
- [ ] Escalation path 已确认

## Engineering
- [ ] 所有阻断 Issue 已关闭
- [ ] 必要测试通过
- [ ] CI 通过
- [ ] 文档已更新
- [ ] 变更日志已更新
- [ ] 版本策略明确

## Security & Privacy
- [ ] 依赖扫描通过
- [ ] Secret 扫描通过
- [ ] License / provenance 检查通过
- [ ] 数据处理说明已完成
- [ ] 权限边界已检查

## AI / Agent
- [ ] Tool permissions 已审查
- [ ] Prompt injection 风险已评估
- [ ] 输出校验已定义
- [ ] 长期记忆写入规则已明确
- [ ] Eval report 已归档

## Embodiment, if applicable
- [ ] 仿真验证通过
- [ ] 空间 / 动作 / 力限制已定义
- [ ] HITL 已启用
- [ ] E-Stop 已验证
- [ ] 传感器和执行日志可审计

## Operations
- [ ] Monitoring 已启用
- [ ] Alerting 已启用
- [ ] Runbook 已完成
- [ ] Rollback plan 已完成
- [ ] Backup / restore 已验证
- [ ] Incident channel 已确认

## Launch
- [ ] Release notes 已准备
- [ ] Feature flag / staged rollout 已配置
- [ ] 用户或社区公告已准备
- [ ] Post-launch review 已排期
```

可靠性和运维要求应尽早进入设计与构建——PRR 过晚介入会带来较高返工成本。Stop-Ship 条件（见 `02-Security-Ethics.md` §7）触发即冻结发布，任何人不得用进度压力越过。

---

## 15. Gate 9：Staged Rollout

**目标**：降低发布风险，逐步扩大影响面。

| 阶段                  | 说明        | 要求               |
| ------------------- | --------- | ---------------- |
| `Internal`          | 仅核心开发者使用  | 快速反馈             |
| `Dogfood`           | 项目内部真实使用  | 记录问题和体验          |
| `Alpha`             | 外部可试用但不稳定 | 明确限制和风险          |
| `Beta`              | 功能接近稳定    | 有退出标准            |
| `Release Candidate` | 候选正式发布    | 只修阻断问题           |
| `GA`                | 正式可用      | Owner、支持、文档、运维完整 |
| `Deprecated`        | 弃用        | 迁移路径和时间表         |
| `Archived`          | 停止维护      | 状态明确             |

实验应有假设、成功/失败标准、短周期和结果报告；Beta 应有明确退出标准；公开可用能力在进入稳定前应完成安全、可观测性、灾难恢复、SLA、可扩展性等准备。

---

## 16. Gate 10：Operation & Improvement

**目标**：让项目进入长期运行，而不是发布后无人维护。

**Operational Acceptance**——正式进入运行状态前必须具备：Owner Registry 已更新；Runbook 已归档；Monitoring dashboard 已链接；Incident process 已明确；Known issues 已记录；Post-launch review 已排期；Follow-up backlog 已创建；成功指标和观察窗口已定义。

**Post-launch Review**：

```markdown
# Post-launch Review

## What shipped
## Expected outcome
## Actual outcome
## Metrics
## User / maintainer feedback
## Incidents or regressions
## What worked
## What did not work
## Follow-up actions
## Keep / iterate / rollback / deprecate
```

发布后应监控使用情况、度量和定性反馈，并创建后续 Issue。

---

## 17. 项目分类与最小流程

不同类型项目不应走完全相同的流程。

### 17.1 文档 / 低风险改动

```text
Issue / PR → Review → Merge
```

要求：相关 Owner Review；不改变原则、治理或公共承诺；不涉及安全、隐私或法律风险。

### 17.2 普通工程功能

```text
Issue → Triage → Design note → Task breakdown → Implementation → Verification → Release notes
```

适用：小型 API；UI 功能；工具改进；内部服务改动；低风险可逆功能。

### 17.3 研究 / 实验

```text
Research question → Hypothesis → Experiment plan → Run → Research log → Decision: archive / iterate / promote
```

要求：假设明确；数据和配置记录；随机种子和环境记录；结果可复查；结论不夸大；不自动进入生产。

### 17.4 AI / Agent 能力

```text
Problem validation → Prototype → Eval design → Safety review → RFC / Design → Implementation → Red team / benchmark / regression eval → Staged rollout → Monitoring
```

要求：能力边界；失败模式；工具权限；记忆写入规则；Prompt injection 防护；输出校验；Eval 报告；回滚机制。

### 17.5 具身 / 物理系统

```text
Concept → Hazard analysis → Simulation → Low-risk prototype → Controlled physical test → HITL operation → Staged autonomy → Operational acceptance
```

要求：仿真先行；动作边界；空间边界；速度 / 力 / 工具限制；E-Stop；HITL；日志审计；安全复审；严格发布门禁。

---

## 18. 工具系统：GitHub、Notion、飞书、Agent

### 18.1 GitHub Projects

建立组织级 `Moonweave Roadmap` 与若干 Area Project（`Moonweave Agent Systems` / `Moonweave AI Infra` / `Moonweave Embodiment` / `Moonweave Frontend & Design` / `Moonweave Research` / `Moonweave Security`）作为工程规划事实源，避免状态散落在多个工具中。

**推荐字段**：

| 字段                 | 类型                  | 说明                                                            |
| ------------------ | ------------------- | ------------------------------------------------------------- |
| `Type`             | Single select       | bug / feature / research / experiment / RFC / release         |
| `Area`             | Single select       | Agent / Infra / Frontend / Backend / Embodiment / Research    |
| `Lifecycle`        | Single select       | Inbox / Discovery / Prototype / Build / Verification / Launch |
| `Risk`             | Single select       | S0–S5 / Blocked                                               |
| `Maturity`         | Single select       | M0–M9                                                         |
| `Priority`         | Single select       | P0–P3                                                         |
| `Owner`            | User / text         | 长期责任人                                                         |
| `DRI`              | User / text         | 当前阶段推进人                                                       |
| `Target Milestone` | Milestone           | 目标里程碑                                                         |
| `Confidence`       | Single select       | Low / Medium / High                                           |
| `Blocked by`       | Text / linked issue | 阻塞项                                                           |
| `Canonical Doc`    | URL                 | RFC / ADR / Notion / Research Log                             |
| `Next Review`      | Date                | 下一次复审                                                         |
| `Launch Stage`     | Single select       | internal / alpha / beta / GA / deprecated                     |
| `Last Update`      | Date                | 最后状态更新时间                                                      |

**推荐视图**：`Roadmap`；`Current Iteration`；`RFC Pipeline`；`Release Readiness`；`Security / Risk`；`Stale / Blocked`；`By Area`；`By Owner`。

### 18.2 Notion

适合：Roadmap narrative；Project Brief；Owner Registry；Planning meeting notes；Quarterly review；Research planning；Onboarding；Project index；Runbook index。工程任务事实源仍回 GitHub。

### 18.3 飞书

适合：Planning meeting；Calendar cadence；Milestone / RFC / Release review reminder；Blocking issue escalation；Agent digest 推送。不适合作为唯一 Roadmap、唯一任务系统、唯一决策记录或唯一项目状态。

### 18.4 Planning Agent

**Kaguya Planner** — 每周生成 Roadmap digest；标记缺少 Owner / DRI 的事项；标记无风险等级的事项；标记 stale issue；标记 overdue milestone；汇总 blocked items；提醒即将到期的 review date。

**Kaguya Gatekeeper** — 检查 Gate 进入条件；生成 readiness checklist；检查 RFC / ADR / Issue 链接是否缺失；检查 release readiness 是否缺少测试、文档、Owner、rollback。**仅能提示，不得自动批准**。

**Kaguya Chronicle** — 将 planning meeting 的 action items 写成草稿；生成 project status summary；将决策链接回 Issue / RFC / ADR；生成人类 DRI 待确认的更新草稿。

硬规则：

> Agent 可以提醒、摘要、检查和创建草稿；Agent 不能替代 DRI、Owner、Maintainer 或 Council 作出计划承诺。

---

## 19. Planning Cadence

| 节奏                | 内容                   | 产物                            |
| ----------------- | -------------------- | ----------------------------- |
| Continuous        | Idea intake          | Issue / Discussion            |
| Weekly / Biweekly | Triage               | 更新 Project 状态                 |
| Biweekly          | Engineering planning | 当前迭代计划                        |
| Monthly           | Roadmap review       | Milestone 调整                  |
| Per RFC window    | RFC review           | RFC 决策                        |
| Per release       | Release readiness    | Release checklist             |
| Post-launch       | 发布后复盘                | Post-launch review            |
| Quarterly         | Portfolio review     | Roadmap / Owner / Risk review |

规划会议必须遵守 `01-Communication.md` 规范：没有 agenda 不开会；没有 DRI 不开会；没有预期产物不开会；可以异步解决的，不默认开会。

---

## 20. Definition of Ready / Done

### 20.1 Ready for Discovery

Problem 初步清楚；有相关背景或证据；有潜在 Owner；不明显 out of scope；未触发 Blocked 安全项。

### 20.2 Ready for Prototype

假设明确；成功 / 失败标准明确；实验边界明确；数据和资产来源可接受；有过期时间；有 Owner / DRI。

### 20.3 Ready for Engineering

问题已验证；方案已通过 Issue / Design / RFC 审查；Owner / DRI 明确；任务可拆解；风险等级明确；质量标准明确；测试、文档、发布和回滚策略已定义；高风险事项已通过安全 / AI / 具身前置审查。

### 20.4 Ready for Release

功能完成；测试通过；文档更新；安全检查通过；监控和告警准备完成；rollback plan 完成；release notes 完成；Owner 和 support path 明确；已完成必要的 staged rollout 计划。

### 20.5 Done

一个项目只有在以下条件满足时才算 Done：

- 目标功能或成果已交付；
- 验收标准通过；
- 文档和变更记录完成；
- 监控、告警、runbook 或研究日志完成；
- 相关 Issue / PR / RFC / ADR 已互相链接；
- 反馈和后续项已记录；
- Owner 已接收长期维护责任，或项目已明确归档。

---

## 21. 暂停、归档与终止

规划文档必须允许"不做"，否则 Roadmap 会变成垃圾堆。

### Pause

适用：依赖未完成；资源暂时不足；风险需要重新评估；外部环境变化；需要等待 RFC 结果。要求：说明暂停原因；记录恢复条件；设置复审日期；保留 Owner。

### Archive

适用：实验完成但不推进；文档或代码保留历史价值；被替代方案取代；项目已完成但不再活跃开发。要求：标记状态；说明归档原因；链接替代方案；清理 Roadmap 承诺。

### Terminate

适用：假设失败；风险不可接受；维护成本过高；不再符合使命；资产来源或合规问题无法解决；无法找到 Owner；技术路线被明确废弃。要求：记录终止原因；记录已学到的内容；清理权限、资源、分支、部署和文档；必要时发布迁移或弃用说明。

---

## 22. 反模式

以下行为应被视为规划反模式：

1. 从聊天中的灵感直接进入长期工程；
2. 原型没有过期时间；
3. Demo 被生产依赖但没有 Owner；
4. Roadmap 只有愿望，没有资源和责任；
5. PR 承载架构争论；
6. 里程碑只写日期，不写可验证系统状态；
7. 安全、隐私、AI、具身风险发布前才审查；
8. 没有回滚方案就上线；
9. 项目状态只存在于飞书群聊；
10. 每个想法都进入 Roadmap；
11. 长期无更新但无人归档；
12. 失败实验没有记录，导致重复踩坑。

---

## 23. 修订

本文只能通过公开 RFC 修订，修订需写明是规划规模变了、老冲突总解不开，还是某条规则被证明在害事。与 `01-Principles.md` 的"冲突与修订"一致：当本文与 RFC 流程、安全审查或组织权限冲突时，以对应专项文档为准；当与法律、安全伦理底线冲突时，底线优先。旧版存于版本控制，随时可查。

只有本文建立的链路——Idea → Triage → Discovery → Prototype → RFC / Design → Engineering Breakdown → Build → Verification → Release → Operation → Improve / Retire——被守住，辉夜计划才不会陷入两种常见失败：**想法很多但没有任何东西真正落地，或 Demo 很多但没有任何东西能长期维护**。
