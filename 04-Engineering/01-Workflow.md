# 工程工作流

> 本文定义辉夜计划中软件、AI Agent、前后端系统、基础设施、数据管线、模型服务、工具链与具身相关工程从设计到交付的统一工作流程。本文关注"如何工程化地完成工作"，包括技术方案确认、实现准备、开发分支、本地验证、Pull Request、Code Review、CI/CD、构建、部署、发布验证、问题反馈与修复闭环。

本文不替代：

- `03-Collaboration/02-Planning.md`：决定是否做、何时做、如何拆解；
- `03-Collaboration/03-RFC-Process.md`：处理重大设计和跨仓库决策；
- `04-Engineering/02-Quality-Assurance.md`：定义测试和质量标准细节；
- `01-Foundation/02-Security-Ethics.md`：定义安全、隐私、AI 与具身风险边界；
- `04-Engineering/standards/*`：定义前端、后端、API、AI 系统等具体技术标准。

---

## 1. 目的与适用范围

本文定义辉夜计划从工程准备、设计、技术选型、实现、验证、Review、CI/CD、发布、部署、监控到反馈闭环的统一工程流程。

工程工作流的目标不是制造审批开销，而是让所有正式工程变更在进入系统的同时保持可追踪、可复现、可审查、可验证、可回滚。GitHub Flow 强调以短分支和 Pull Request 协作；Google 将代码审查的首要目标定义为让代码库整体健康度持续改善；NIST SSDF 强调把安全开发实践嵌入 SDLC；Google SRE 通过发布工程、canary、rollback 和 launch checklist 管理上线风险。辉夜计划的工程协议在此基础上增加了对 AI Agent 行为、长期记忆、模型服务与具身安全的专项要求。

适用于辉夜计划所有正式仓库中的代码、配置、数据、模型、基础设施、文档与工具链变更。

---

## 2. 核心原则

八条，专门约束工程执行：

1. **可追踪** — 每个变更必须能追溯到 Issue / RFC / ADR、实现者、审查者、构建过程和部署记录。
2. **可复现** — 构建、测试和部署不得依赖隐式本地配置或人工手动步骤；lockfile、container、CI 环境必须可重建。
3. **可审查** — 所有正式变更必须经过结构化的 Pull Request 与 Code Review，不允许直接推入受保护分支。
4. **可验证** — 每个阶段都应有自动化或可执行的验证手段；CI 不是"能跑就行"，而是工程事实验证系统。
5. **可回滚** — 部署到生产的变更必须具备回退路径；不可轻易回滚的变更必须经过更强的发布审查。
6. **可维护** — 代码、文档、监控、告警和 Owner 必须同步交付；没有 Owner 的系统视为无人看管的负债。
7. **风险分级** — 低风险轻量推进，高风险重度审查；不用最重流程堵住所有小改动，也不用最轻流程放过关键变更。
8. **合并不是完成，部署不是成功** — 真正完成必须经过发布验证、监控、反馈和 Owner 接收。

---

## 3. 工程流程总览

```text
Engineering Ready
  ↓
Engineering Brief
  ↓
Technical Decision / ADR
  ↓
Scaffolding & Environment Setup
  ↓
Implementation Branch
  ↓
Local Verification
  ↓
Pull Request
  ↓
CI Quality Gates
  ↓
Code Review / Design Review / Safety Review
  ↓
Merge
  ↓
Build Artifact
  ↓
Staging / Preview / Simulation
  ↓
Release Readiness
  ↓
Deployment / Rollout
  ↓
Post-deploy Verification
  ↓
Feedback / Incident / Improvement Loop
```

并非所有变更都需要走完全部节点。流程强度由工作流分级决定。

---

## 4. 工作流分级

所有事项不走同样重的流程。三条路径覆盖从文档修正到生产基础设施的全部场景。

### 4.1 Lightweight Path：轻量变更

适用：

- 文档修正；
- 小 Bug；
- 局部重构；
- 单仓库内部实现；
- 无公共 API / Schema / 状态机影响；
- 无安全、隐私、AI、具身风险。

流程：

```text
Issue / Small Task
  ↓
Branch
  ↓
Local Check
  ↓
PR
  ↓
CI
  ↓
Review
  ↓
Merge
```

要求：

- 必须有 PR；
- 必须通过 CI；
- 至少一名 Reviewer；
- 不允许直接 push 到 main；
- 若影响 Owner 范围，必须请求对应 Owner / CODEOWNER Review。

### 4.2 Standard Engineering Path：标准工程变更

适用：

- 新功能；
- 可复用组件；
- 前后端协作功能；
- 内部服务；
- 数据处理模块；
- 工具链改造；
- 需要文档、测试、部署或迁移的变更。

流程：

```text
Issue
  ↓
Engineering Brief
  ↓
Technical Decision / ADR if needed
  ↓
Task Breakdown
  ↓
Implementation
  ↓
Local + CI Verification
  ↓
PR Review
  ↓
Staging / Preview
  ↓
Release Readiness
  ↓
Deploy
  ↓
Post-deploy Review
```

要求：

- 必须有 Owner 和 DRI；
- 必须有验收标准；
- 必须说明测试计划；
- 必须说明文档影响；
- 若引入新依赖或新技术，应有选型记录；
- 若影响运行系统，应有部署、回滚和监控计划。

### 4.3 High-risk Engineering Path：高风险工程变更

适用：

- 公共 API / 协议 / Schema / 状态机；
- 长期基础设施；
- 生产服务；
- AI Agent 工具调用；
- 长期记忆写入；
- 模型服务；
- 用户数据；
- 安全、隐私、合规；
- 具身终端、传感器、执行器；
- 不易回滚的迁移。

流程：

```text
Planning Discovery
  ↓
RFC
  ↓
Risk Review
  ↓
Engineering Brief
  ↓
ADR / Design Doc
  ↓
Implementation Plan
  ↓
Development
  ↓
CI + Security + Evaluation Gates
  ↓
Required Reviews
  ↓
Staging / Simulation / Canary
  ↓
Release Readiness Sign-off
  ↓
Staged Rollout
  ↓
Post-release Monitoring
  ↓
Postmortem / Follow-up
```

要求：

- 必须经过 RFC 或明确豁免；
- 必须完成安全 / 隐私 / AI / 具身专项审查；
- 必须有 Release Readiness Checklist；
- 必须有回滚、降级或 Kill Switch；
- 必须有 Owner、Backup Owner 和事故升级路径。

Google SRE 对 canary release 的定义：先让一小部分真实流量接触候选版本，并与控制组比较，以降低坏变更的影响面。辉夜计划中涉及 Agent 行为、模型服务、数据管线或具身终端的发布必须遵循此模式。

---

## 5. Engineering Ready：进入工程前的条件

`02-Planning.md` 输出的项目不能直接进入开发。工程工作流定义的入口门禁如下。

### 5.1 Ready for Engineering

一个事项只有满足以下条件，才能进入正式工程开发：

- Problem 已清楚；
- Scope 和 Non-goals 已明确；
- Owner 和 DRI 已确认；
- 风险等级已标注（复用 `02-Security-Ethics.md` §3 的 S0–S5 与 Blocked）；
- 相关 Issue / RFC / ADR 已链接；
- 验收标准已定义；
- 技术依赖已识别；
- 测试策略已定义；
- 文档影响已识别；
- 安全、隐私、AI、具身风险已初筛；
- 不存在 Blocked 级来源、合规或安全问题。

### 5.2 不允许进入工程的情况

以下事项不得进入正式工程开发：

- 只有一句想法，没有问题定义；
- 没有 Owner；
- 没有验收标准；
- 依赖来源不明的代码、数据、模型或素材；
- 涉及生产、用户数据、Agent 自治或具身动作但没有风险分级；
- 架构性变更绕过 RFC；
- 原型被要求直接接入生产。

---

## 6. Engineering Brief：工程设计简报

对于标准及以上工程变更，应先写一个轻量 Engineering Brief。它比 RFC 短，比 Issue 具体。设计逻辑必须先于代码结构：写代码前至少要明确 Domain Concepts → State → Invariants → Interfaces → Failure Modes → Implementation。

模板：

```markdown
# Engineering Brief

## Summary
一句话说明要做什么。

## Context
当前系统是什么状态？相关 Issue / RFC / ADR 是什么？

## Problem
具体工程问题是什么？

## Goals
本次要达成什么。

## Non-goals
本次不做什么。

## Domain Model
涉及哪些核心概念、状态、接口、数据实体？

## Invariants
哪些条件必须始终成立？

## Proposed Approach
实现路径。

## Alternatives
至少说明"不做"和一个替代方案。

## Technical Decisions
语言、框架、存储、协议、依赖、容器、部署方式等选择。

## Risks
安全、隐私、AI、具身、兼容、性能、维护风险。

## Testing Plan
单元、集成、契约、E2E、评测、回归测试。

## Rollout / Rollback
如何发布，如何回退。

## Observability
日志、指标、Tracing、告警。

## Owner / DRI
长期 Owner 与当前推进人。
```

---

## 7. 技术选型流程

辉夜计划涉及 Python、TypeScript、Rust、容器、数据、模型、前后端和 Agent Infra，技术栈管理必须有章法。

### 7.1 选型分级

采用四级技术雷达，与 Thoughtworks Technology Radar 的 Adopt / Trial / Assess / Hold 分层一致：

| 等级 | 含义 | 使用规则 |
|------|------|----------|
| **Adopt** | 组织推荐标准 | 新项目默认使用 |
| **Trial** | 允许在限定项目中试用 | 必须有 Owner 和退出路径 |
| **Assess** | 可调研，不进入正式依赖 | 只能用于实验或 Spike |
| **Hold** | 暂停引入 | 新项目不得使用 |

### 7.2 什么时候必须做技术选型记录

以下情况必须写 Technical Decision 或 ADR：

- 引入新语言；
- 引入新前端框架；
- 引入新后端框架；
- 引入新数据库、向量库、消息队列、缓存；
- 引入新模型框架、Agent 框架或推理服务；
- 引入新部署平台、容器运行时或云服务；
- 替换已有核心依赖；
- 引入长期维护成本高的工具；
- 引入许可、合规或供应链风险不清的依赖。

### 7.3 技术选型必须回答

```markdown
Technology:
Category:
Adoption level: Adopt / Trial / Assess / Hold
Problem solved:
Alternatives considered:
Why now:
Expected lifetime:
Owner:
Operational burden:
Security / license risk:
Community health:
Migration cost:
Exit strategy:
Decision:
```

### 7.4 默认技术基线

以下为辉夜计划初始工程基线，更细标准放入 `standards/`：

| 领域 | 默认基线 |
|------|----------|
| Source control | GitHub |
| Planning / PR / CI | GitHub Issues / PR / Projects / Actions |
| Python | `pyproject.toml` + `uv` + `uv.lock` |
| TypeScript / Frontend | `pnpm` workspace + `pnpm-lock.yaml` |
| Rust | Cargo |
| Container | OCI-compatible image + Dockerfile |
| CI/CD | GitHub Actions |
| Code ownership | CODEOWNERS |
| Versioning | SemVer where public API exists |
| Commit convention | Conventional Commits |
| Security scan | Secret scanning, dependency scan, code scan |
| Supply chain | SBOM / provenance for release artifacts |
| E2E web tests | Playwright or equivalent |
| Python tests | pytest or equivalent |
| Data / ML pipeline | dataset manifest, validation report, model/eval artifact |

---

## 8. 仓库与工程脚手架

每个正式工程仓库应有统一基线。

### 8.1 必备文件

```text
README.md
CONTRIBUTING.md
SECURITY.md
LICENSE
CODEOWNERS
CHANGELOG.md
.github/
  workflows/
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE.md
docs/
tests/
```

按技术栈增加：

```text
pyproject.toml          # Python
uv.lock

package.json            # TypeScript / Frontend
pnpm-lock.yaml
pnpm-workspace.yaml

Cargo.toml              # Rust
Cargo.lock

Dockerfile              # Container
.dockerignore
compose.yaml

devcontainer.json       # Dev Container
```

### 8.2 仓库初始化门禁

正式仓库创建后，必须完成：

- Owner 声明；
- README 完成；
- License 明确；
- SECURITY.md 完成；
- CODEOWNERS 完成；
- CI baseline 完成；
- 分支保护开启；
- Secret scanning / dependency scanning 开启；
- Issue / PR 模板完成；
- Release 方式说明完成。

OpenSSF Scorecard 可自动检查仓库的安全启发式指标；辉夜计划的正式仓库应以 Scorecard 作为安全基线参考。

---

## 9. 开发环境与可复现性

### 9.1 本地开发环境

所有正式仓库必须提供可复现的本地开发入口。最低要求：

- 一条命令安装依赖；
- 一条命令运行测试；
- 一条命令启动本地服务；
- 锁定语言运行时和依赖版本；
- 明确环境变量模板；
- 不依赖个人机器上的隐式配置。

标准命令：

```text
Python:
  uv sync
  uv run pytest
  uv run <service>

TypeScript:
  pnpm install --frozen-lockfile
  pnpm test
  pnpm dev

Rust:
  cargo build
  cargo test
  cargo fmt --check
  cargo clippy
```

### 9.2 Dev Container

对于跨语言、复杂依赖或具身 / 仿真环境，应提供 Dev Container 或等价容器化开发环境。

应使用 Dev Container 的情况：

- 依赖 GPU、仿真器、ROS、系统库或复杂 native dependency；
- 本地环境配置成本高；
- 新人 onboarding 成本高；
- CI 与本地环境经常不一致；
- 需要隔离实验依赖。

### 9.3 环境变量

仓库可以提交 `.env.example`，不得提交真实 `.env`。所有 secret 必须通过受控 secret manager 或 GitHub Actions secrets / environment secrets 注入。GitHub secret scanning 会扫描 Git 历史中硬编码的凭据；GitHub environments 可对部署任务设置人工批准、等待时间和分支限制。

---

## 10. 分支、提交与 PR 工作流

### 10.1 分支模型

采用 GitHub Flow，不采用重型 Git Flow：

```text
main
 ├── feat/<short-name>
 ├── fix/<short-name>
 ├── docs/<short-name>
 ├── refactor/<short-name>
 ├── experiment/<short-name>
 └── release/<version>   # 仅在需要稳定发布分支时使用
```

### 10.2 main 分支规则

main 必须始终保持可构建、可测试、可发布。

禁止：

- 直接 push 到 main；
- force push 到 main；
- 跳过 CI 合并；
- 未经 Review 合并；
- 未授权修改 release artifact。

分支保护必须至少要求：

- PR Review；
- 必要 status checks 通过；
- CODEOWNER Review；
- conversation resolved；
- linear history or squash merge；
- signed commits / verified commits（如果项目要求）；
- 不允许 force push；
- 不允许删除 protected branch。

### 10.3 Commit 规范

采用 Conventional Commits，与 SemVer 的 feature、fix 和 breaking change 表达相衔接：

```text
<type>(<scope>): <description>
```

常用 type：

| type | 含义 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档 |
| `refactor` | 重构 |
| `test` | 测试 |
| `perf` | 性能 |
| `ci` | CI/CD |
| `chore` | 构建或辅助工具 |
| `revert` | 回退 |

示例：

```text
feat(agent): add memory retrieval state transition
fix(runtime): prevent scheduler race condition
docs(api): clarify error response schema
refactor(frontend): split agent inspector panel
test(eval): add regression cases for tool-call failure
```

---

## 11. 实现阶段工作规则

### 11.1 小步提交

变更应尽可能小、聚焦、可 Review。一个 PR 只解决一个清晰问题。

推荐 PR 大小：

| 类型 | 推荐 |
|------|------|
| 文档 / typo | 小 PR |
| Bug fix | 小 PR，附复现测试 |
| 新功能 | 可拆为多个 PR |
| 重构 | 与行为变更分离 |
| 迁移 | 分阶段 PR |
| 大型变更 | 先 RFC / ADR，再分阶段实现 |

### 11.2 实现前检查

开发者在开始编码前应确认：

- 是否已有 Issue；
- 是否需要 RFC / ADR；
- 是否知道 Owner；
- 是否知道验收标准；
- 是否知道测试方式；
- 是否会影响公共契约；
- 是否会影响数据、模型、状态、权限或部署；
- 是否需要同步前后端 / API / Schema；
- 是否需要更新文档。

### 11.3 本地提交前检查

提交 PR 前，作者必须在本地完成最低检查：

- formatter；
- linter；
- type check；
- unit tests；
- affected integration tests；
- dependency lockfile check；
- secret scan if available；
- generated files up to date。

标准命令：

```text
Python:
  uv run ruff format --check .
  uv run ruff check .
  uv run mypy .
  uv run pytest

TypeScript:
  pnpm format:check
  pnpm lint
  pnpm typecheck
  pnpm test

Rust:
  cargo fmt --check
  cargo clippy --all-targets --all-features
  cargo test
```

---

## 12. Pull Request 规范

### 12.1 PR 必须包含

```markdown
## Summary
做了什么。

## Motivation
为什么做。

## Changes
主要变更点。

## Test Plan
如何验证。

## Risk
风险与回滚方式。

## Compatibility
是否影响 API / Schema / 数据 / 状态。

## Security / Privacy
是否涉及权限、用户数据、secret、依赖、模型或资产来源。

## AI / Agent Impact
是否影响 Agent 行为、工具调用、记忆、RAG、评测。

## Deployment
是否需要部署、迁移、feature flag、配置变更。

## Links
Issue / RFC / ADR / Design Doc / Research Log。
```

### 12.2 PR 不应承担的内容

PR 不应用来首次讨论重大方向。以下问题必须先进入 Issue / RFC / ADR：

- 是否采用新架构；
- 是否改变公共 API；
- 是否引入新服务；
- 是否重写系统；
- 是否改变安全边界；
- 是否让 Agent 获得新权限；
- 是否让具身系统执行新动作。

### 12.3 Draft PR

Draft PR 可用于提前暴露实现方向、CI 问题和设计风险。Draft PR 不应被合并，也不应被当作正式 Review 完成。

### 12.4 PR Ready Checklist

```markdown
- [ ] Linked issue / RFC / ADR
- [ ] Scope is clear
- [ ] Tests added or updated
- [ ] Docs updated
- [ ] CI passes
- [ ] No secret / credential
- [ ] No unexplained dependency
- [ ] No public contract change without review
- [ ] Rollback / migration considered
- [ ] Owner / CODEOWNER requested
```

---

## 13. Code Review 流程

### 13.1 Review 目标

> Code Review 的目标不是寻找完美代码，而是确保每个正常变更不会降低系统整体健康度。

与 Google Code Review 标准一致：Review 应在 CL 明确改善系统整体代码健康时倾向批准，即使它并不完美。

### 13.2 Review 维度

Reviewer 至少检查：

- Correctness
- Design fit
- Maintainability
- Testability
- Security
- Privacy
- Performance
- Compatibility
- Observability
- Documentation
- Operational risk

### 13.3 Required Review

| 变更类型 | Review 要求 |
|----------|-------------|
| 文档小改 | 1 Reviewer |
| 普通代码 | 1 Reviewer + CI |
| Owner 范围代码 | CODEOWNER Review |
| 公共 API / Schema | API Owner + affected client Owner |
| Infra / deployment | Infra Owner + rollback plan |
| Security-sensitive | Security Reviewer |
| AI / Agent behavior | AI Systems Reviewer + Eval result |
| Embodiment | Embodiment Safety Reviewer |
| Breaking change | RFC / ADR + migration plan |

---

## 14. CI 质量门禁

CI 不是"能跑就行"，而是工程事实验证系统。

### 14.1 CI 分层

每个正式仓库至少应有以下 workflow：

```text
ci.yml
  - format
  - lint
  - typecheck
  - unit-test
  - integration-test
  - build

security.yml
  - secret scan
  - dependency scan
  - license check
  - SAST / code scan
  - container scan (if applicable)

release.yml
  - version check
  - artifact build
  - SBOM / provenance
  - publish

e2e.yml
  - preview environment
  - E2E tests
  - report artifact

nightly.yml
  - slow tests
  - full regression
  - long-running eval
```

### 14.2 CI 必须产出可检查结果

CI 不应只返回 pass / fail。关键 workflow 应上传：

- test report；
- coverage report；
- lint report；
- typecheck result；
- E2E trace / screenshot / video；
- build artifact；
- container image digest；
- SBOM；
- provenance / attestation；
- benchmark result；
- eval report。

### 14.3 CI 阻断规则

以下失败必须阻断合并：

- format / lint / typecheck 失败；
- 单元测试失败；
- 必要集成测试失败；
- secret scan 命中；
- 高危依赖漏洞无豁免；
- license 检查失败；
- container build 失败；
- 公共 API snapshot 未更新；
- 数据 / 模型 artifact 缺少来源；
- release artifact 无法构建。

高风险变更还应阻断：

- AI eval 失败；
- prompt injection regression 失败；
- data validation 失败；
- migration dry run 失败；
- rollback test 失败；
- simulation safety test 失败；
- readiness / health check 失败。

---

## 15. 测试触发点

详细测试策略见 `02-Quality-Assurance.md`，本节定义测试何时进入工程流程。

### 15.1 测试分层

```text
Static Checks
  ↓
Unit Tests
  ↓
Component Tests
  ↓
Integration Tests
  ↓
Contract Tests
  ↓
End-to-End Tests
  ↓
Release Candidate Tests
  ↓
Post-deploy Checks
```

辉夜计划保留"越上层越少、越稳定、越关键"的金字塔原则（Google Testing Blog 经验值：70% unit / 20% integration / 10% E2E）。实际比例可调整，但不应倒过来。

### 15.2 各阶段测试要求

| 阶段 | 必须测试 |
|------|----------|
| Local | affected unit / lint / typecheck |
| PR | unit + integration + changed area tests |
| Merge to main | full CI |
| Nightly | slow tests + regression + eval |
| Release Candidate | E2E + migration + performance + security |
| Post-deploy | smoke test + health check + monitoring |

### 15.3 AI / Agent 测试

AI / Agent 相关 PR 还应包含：

- eval dataset 版本；
- prompt / policy snapshot；
- model version；
- tool permission matrix；
- memory write / read behavior tests；
- prompt injection regression；
- hallucination / uncertainty checks；
- cost / latency budget；
- failure mode report。

Google 的 ML Test Score 论文提出了 28 项测试和监控需求，用于评估生产 ML 系统准备度并降低技术债。辉夜计划的 AI / Agent 系统应以此为参考基线。

### 15.4 数据测试

数据管线必须验证：

- schema；
- null / missing；
- range；
- distribution drift；
- duplicates；
- label quality；
- provenance；
- PII / sensitive fields；
- train / eval contamination；
- dataset version。

---

## 16. 构建与制品管理

### 16.1 Build Artifact

任何正式发布产物必须可追溯。每个 release artifact 必须知道：

- source commit；
- build workflow；
- dependency lockfile；
- build environment；
- artifact hash；
- container image digest；
- SBOM；
- provenance；
- signer / attestation；
- release version。

SLSA 关注软件供应链完整性和构建 provenance；OCI Image Specification 定义容器镜像互操作基线。辉夜计划的正式发布产物应逐步达到 SLSA Level 2 以上。

### 16.2 Container 规则

容器镜像必须：

- 使用明确 base image；
- 固定 base image 版本或 digest；
- 使用 multi-stage build；
- 使用 `.dockerignore`；
- 不安装无关包；
- 不写入 secret；
- 尽量非 root 运行；
- 在 CI 中构建和测试；
- 发布时记录 image digest。

---

## 17. 发布与部署工作流

### 17.1 环境分层

```text
local
  ↓
dev
  ↓
preview / ephemeral
  ↓
staging
  ↓
canary
  ↓
production
```

### 17.2 Preview Environment

前端、API、Agent UI、文档站等适合 PR Preview：

- UI 变更；
- API contract demo；
- 文档站；
- Agent state inspector；
- demo / playground；
- integration validation。

### 17.3 Release Readiness Checklist

```markdown
## Ownership
- [ ] Owner 确认
- [ ] Backup Owner 确认
- [ ] DRI 确认
- [ ] Escalation path 确认

## Code
- [ ] CI passed
- [ ] Required reviews completed
- [ ] No unresolved conversations
- [ ] Changelog updated
- [ ] Version updated

## Tests
- [ ] Unit passed
- [ ] Integration passed
- [ ] E2E passed if applicable
- [ ] Contract tests passed
- [ ] Migration dry run passed if applicable

## Security
- [ ] Secret scan passed
- [ ] Dependency scan passed
- [ ] License check passed
- [ ] Container scan passed if applicable
- [ ] SBOM / provenance generated if release artifact

## AI / Data
- [ ] Dataset versions recorded
- [ ] Eval report archived
- [ ] Model / prompt / policy version recorded
- [ ] Tool permissions reviewed
- [ ] Data validation passed

## Operations
- [ ] Rollback plan ready
- [ ] Monitoring dashboard linked
- [ ] Alerts configured
- [ ] Runbook updated
- [ ] Smoke test defined
```

Google SRE 的 Launch Coordination Engineering 使用 launch checklist 审查可靠性、可扩展性和上线风险。辉夜计划的 Release Readiness 直接复用此思路。

### 17.4 Rollout

生产发布默认使用 staged rollout。高风险发布不得一次性全量上线。典型顺序：

```text
staging
  ↓
internal dogfood
  ↓
canary 1% / limited users
  ↓
canary 10%
  ↓
regional / area rollout
  ↓
full rollout
```

### 17.5 Post-deploy Verification

部署后必须完成：

- health check；
- smoke test；
- key metrics check；
- error rate check；
- latency check；
- log anomaly check；
- rollback readiness check；
- user-facing validation；
- Agent / model behavior spot check（if applicable）。

DORA 指标建议用部署频率、变更前置时间、失败部署恢复时间等衡量软件交付吞吐与稳定性。辉夜计划应逐步建立对 Deployment Frequency、Lead Time、Change Failure Rate 和 Time to Restore 的可观测能力。

---

## 18. 问题反馈与修复闭环

### 18.1 Bug Lifecycle

```text
Report
  ↓
Triage
  ↓
Reproduce
  ↓
Root Cause
  ↓
Fix
  ↓
Regression Test
  ↓
Release
  ↓
Verify
  ↓
Close
```

### 18.2 Bug Issue 必须包含

- Expected behavior
- Actual behavior
- Reproduction steps
- Environment
- Version / commit
- Logs / screenshots
- Impact
- Regression: yes / no / unknown
- Related release
- Owner

### 18.3 修复要求

Bug 修复不得只修当前现象。至少应补充以下之一：

- regression test；
- stronger validation；
- clearer error message；
- better logging；
- documentation update；
- monitoring alert；
- runbook update。

### 18.4 Hotfix

Hotfix 允许缩短流程，但不得取消记录。

Hotfix 后必须补充：

- incident / bug issue；
- root cause；
- regression test；
- release note；
- postmortem if production impact；
- follow-up technical debt ticket。

NIST SSDF 的目标之一是减少已发布软件漏洞数量、降低未修复漏洞影响，并处理根因防止复发——这与 Hotfix 后补充根因和回归测试的要求一致。

---

## 19. AI 辅助工程规则

辉夜计划允许 AI 辅助开发，但必须明确责任边界。

### 19.1 允许使用 AI 辅助

- 生成草稿代码；
- 生成测试草案；
- 解释错误；
- 总结 PR；
- 生成文档草稿；
- 辅助迁移脚本；
- 生成评测样例草稿。

### 19.2 禁止

- 提交作者无法解释的代码；
- 提交未经验证的 AI 生成测试；
- 用 AI 生成代码绕过 license / provenance 审查；
- 将 secret、私有数据、未公开设计输入外部 AI 服务；
- 让 AI 自动批准 PR、自动合并、自动发布；
- 让 AI 对高风险 Agent / 具身权限作最终裁决。

### 19.3 硬规则

> AI-generated does not mean review-exempt. Human author remains fully responsible.

---

## 20. 工具与自动化

### 20.1 GitHub Actions 推荐流水线

标准 job 结构：

```text
pull_request:
  validate-metadata
  install
  format
  lint
  typecheck
  unit-test
  integration-test
  build
  dependency-review
  secret-scan
  license-check

push main:
  full-test
  build-artifacts
  container-build
  sbom
  provenance
  publish-preview

release tag:
  release-build
  sign
  attest
  publish
  deploy-staging
  smoke-test
  promote-production
```

### 20.2 推荐 CI 策略

- 使用 lockfile 安装依赖；
- 使用 matrix 测试关键语言版本 / OS / runtime；
- 复用 workflow，避免每个仓库复制复杂逻辑；
- 缓存依赖，但不得缓存 secret；
- 生成 artifact 和报告；
- 高风险部署使用 environment protection；
- release workflow 只能从受保护分支或 tag 触发；
- 外部贡献者 workflow 需要受控批准。

### 20.3 Workflow 状态与标签

统一 GitHub labels：

**状态标签：**

```text
status:ready
status:in-progress
status:blocked
status:needs-review
status:needs-design
status:needs-rfc
status:needs-security-review
status:needs-ai-review
status:needs-embodiment-review
status:ready-to-merge
status:ready-to-release
status:released
status:verified
status:stale
status:archived
```

**类型标签：**

```text
type:bug
type:feature
type:refactor
type:docs
type:test
type:infra
type:api
type:frontend
type:backend
type:agent
type:model
type:data
type:embodiment
type:security
```

**风险标签：**

```text
risk:S0
risk:S1
risk:S2
risk:S3
risk:S4
risk:S5
risk:blocked
```

### 20.4 Kaguya Engineering Agents

以下 Agent 可在工程工作流中提供辅助，但一律为咨询和自动化角色，不得自动批准、自动合并或替代人类责任判断：

| Agent | 职能 | 权限边界 |
|-------|------|----------|
| **Kaguya CI Guardian** | 监控 CI 状态、标记 flaky test、通知阻断 | 可评论、可标记、不可合并 |
| **Kaguya Release Steward** | 检查 Release Readiness Checklist、生成发布摘要 | 可生成 checklist、不可批准发布 |
| **Kaguya Dependency Watcher** | 监控依赖更新、安全公告、license 变化 | 可创建 Issue、不可自动升级 |
| **Kaguya Eval Reporter** | 汇总 AI eval 结果、标记回归 | 可评论 PR、不可批准 |

> Agent 可以提醒、汇总、检查和生成报告，不得自动批准 PR、自动合并、自动发布或对高风险权限作最终裁决。

---

## 21. Definition of Done

### 21.1 通用工程事项

一个工程事项只有满足以下条件，才能标记为 Done：

- 代码或产物已合并；
- 必要测试已通过；
- 必要 Review 已完成；
- 文档已更新；
- 变更日志或 Release Note 已更新；
- 相关 Issue / PR / RFC / ADR 已互相链接；
- 部署或发布已完成，或明确说明无需部署；
- post-deploy smoke test 已通过；
- 监控、告警、日志或 runbook 已更新；
- Owner 已接受长期维护责任；
- 后续问题已记录。

### 21.2 研究 / AI / 数据事项

在通用条件之上，还应增加：

- 实验配置归档；
- 数据版本归档；
- 模型 / prompt / policy 版本归档；
- eval report 归档；
- 已知失败模式归档。

### 21.3 具身事项

在通用条件之上，还应增加：

- 仿真验证归档；
- 物理测试记录归档；
- HITL / E-Stop 检查完成；
- 风险边界归档；
- 人类接管路径验证。

---

## 22. 反模式

以下行为属于工程工作流反模式：

1. 没有 Issue / RFC / ADR 就开始重大实现；
2. 原型代码无审查进入生产；
3. PR 里首次讨论架构方向；
4. main 分支不可构建；
5. CI 失败后靠人工口头放行；
6. 测试只覆盖 happy path；
7. E2E 测试过多、过慢、过脆；
8. 只修 Bug，不补回归测试；
9. 引入依赖但不解释理由和许可证；
10. Dockerfile 中写入 secret；
11. 发布没有 rollback plan；
12. 部署后不看监控；
13. release artifact 无法追溯到 commit；
14. Agent 代码变化没有 eval；
15. 数据变化没有 schema / quality validation；
16. 具身动作没有仿真和急停验证；
17. Hotfix 后不补记录和根因分析；
18. 长期依赖单一维护者的本地知识。

---

## 23. 修订

本文只能通过公开 RFC 修订，修订需写明是工程规模变了、老冲突总解不开，还是某条规则被证明在害事。与 `01-Foundation/01-Principles.md` 的"冲突与修订"一致：当本文与 RFC 流程、安全审查或组织权限冲突时，以对应专项文档为准；当与法律、安全伦理底线冲突时，底线优先。旧版存于版本控制，随时可查。

只有本文建立的链路——Design → Decision → Implementation → Verification → Review → Build → Release → Deploy → Observe → Improve——被守住，辉夜计划才不会陷入三种常见失败：**原型无门禁变成生产依赖；Agent / 数据 / 模型 / 具身变更缺少专项验证；正式产物无法追溯到代码、配置、数据、构建过程和 Owner**。
