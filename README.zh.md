# Moonweave AI Governance · 辉夜计划治理仓库

> **语言**：[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

本仓库为 Moonweave/Kaguya Project（辉夜计划）定义原则、组织结构、协作协议、工程工作流、质量标准与知识管理实践——这是一个整合自主 Agent、AI 基础设施与具身智能的长生命周期 AI 架构。

这不是代码。这是项目的运行系统：使软件、AI/Agent 系统、数据流水线、模型服务与具身机器人之上的工程能够安全、可追溯、可持续开展的规则、流程与标准。

## 结构概览

```mermaid
flowchart LR
    A["Moonweave AI Governance<br/>辉夜计划组织运行系统"]
    A --> F["01-Foundation<br/>根基"]
    A --> G["02-Governance<br/>治理"]
    A --> C["03-Collaboration<br/>协作"]
    A --> E["04-Engineering<br/>工程"]
    A --> K["05-Knowledge<br/>知识沉淀"]
    A --> L["06-Glossary<br/>术语表"]
    F --> F1["Principles<br/>使命、原则、承诺、冲突裁决"]
    F --> F2["Security & Ethics<br/>安全、隐私、合规、伦理边界"]
    G --> G1["Organization<br/>角色、权限、Owner、升级路径"]
    G --> G2["Community<br/>贡献者成长、社区健康、行为准则"]
    C --> C1["Communication<br/>平台分工、事实源、会议、Agent 推送"]
    C --> C2["Planning<br/>Idea 到 Operation 的规划流程"]
    C --> C3["RFC Process<br/>重大变更决策流程"]
    E --> E1["Workflow<br/>工程执行流程"]
    E --> E2["Quality Assurance<br/>质量证据与门禁"]
    E --> E3["Standards<br/>API / 前端 / 后端 / AI 系统标准"]
    K --> K1["Documentation Guide<br/>文档与知识资产管理"]
    K --> K2["RFC Archive<br/>重大提案历史"]
    K --> K3["ADR Archive<br/>架构决策历史"]
    K --> K4["Research Logs<br/>实验、论文、数据记录"]
    L --> L1["Governance & Process"]
    L --> L2["Engineering & Development"]
    L --> L3["Quality & Testing"]
    L --> L4["Security & Compliance"]
    L --> L5["AI / Agent / Data"]
    L --> L6["Infrastructure & Operations"]
    L --> L7["Embodiment & Robotics"]
    L --> L8["Documentation & Knowledge"]
```

## Idea 到 Operation 工作流

```mermaid
flowchart TB
    I["Idea / 需求 / 问题"] --> P["Planning<br/>判断是否值得做"]
    P --> R{"是否重大变更？"}
    R -- "是" --> RFC["RFC Process<br/>公开论证与裁决"]
    R -- "否" --> W["Workflow<br/>工程执行"]
    RFC --> ADR["ADR<br/>记录架构决策"]
    ADR --> W
    W --> QA["Quality Assurance<br/>质量证据与门禁"]
    QA --> S{"触发安全 / AI / 具身风险？"}
    S -- "是" --> SE["Security & Ethics<br/>专项审查 / Stop-Ship"]
    S -- "否" --> REL["Release / Deploy"]
    SE -->|通过| REL
    SE -->|阻断| FIX["整改 / 例外 / 终止"]
    REL --> OP["Operation<br/>运行、监控、反馈"]
    OP --> K["Knowledge<br/>文档、Runbook、Postmortem、Research Log"]
    K --> IMP["Improve / Retire<br/>迭代或退役"]
    IMP --> P
```

## 文档关系

```mermaid
flowchart TB
    P["Principles<br/>原则：为什么这样做"]
    SE["Security & Ethics<br/>安全伦理：哪些边界不能突破"]
    ORG["Organization<br/>组织：谁负责、谁裁决"]
    COM["Communication<br/>沟通：在哪说、沉淀到哪里"]
    PLAN["Planning<br/>规划：Idea 如何成为项目"]
    RFC["RFC Process<br/>重大变更如何决策"]
    WF["Workflow<br/>工程：如何实现"]
    QA["Quality Assurance<br/>质量：什么证据足够"]
    DOC["Documentation Guide<br/>知识：如何记录与传承"]
    GLO["Glossary<br/>术语：统一语言"]
    P --> SE
    P --> ORG
    P --> COM
    P --> PLAN
    P --> WF
    P --> QA
    P --> DOC
    SE --> PLAN
    SE --> RFC
    SE --> WF
    SE --> QA
    ORG --> COM
    ORG --> RFC
    ORG --> WF
    COM --> PLAN
    COM --> RFC
    COM --> DOC
    PLAN --> RFC
    PLAN --> WF
    RFC --> WF
    RFC --> DOC
    WF --> QA
    WF --> DOC
    QA --> WF
    QA --> DOC
    DOC --> ORG
    DOC --> PLAN
    DOC --> RFC
    DOC --> WF
    DOC --> QA
    GLO -.统一术语.-> P
    GLO -.统一术语.-> SE
    GLO -.统一术语.-> ORG
    GLO -.统一术语.-> COM
    GLO -.统一术语.-> PLAN
    GLO -.统一术语.-> RFC
    GLO -.统一术语.-> WF
    GLO -.统一术语.-> QA
    GLO -.统一术语.-> DOC
```

## 目录结构

```text
01-Foundation/          原则与安全伦理基线
02-Governance/          组织、角色与社区规则
03-Collaboration/       沟通、规划与 RFC 流程
04-Engineering/         工作流、质量保障与技术标准
05-Knowledge/           文档规范与知识资产管理
06-Glossary/            英 / 中 / 日 术语定义
governance-skills/      Agent Skills、命令、模板、CLI 与平台适配器
                        将本治理体系编译为可调用、可检查的工具
```

| 章节 | 中文 |
|---------|------|
| **01-Foundation** | [原则](01-Foundation/01-Principles.md) · [安全伦理](01-Foundation/02-Security-Ethics.md) |
| **02-Governance** | [组织](02-Governance/01-Organization.md) · [社区](02-Governance/02-Community.md) |
| **03-Collaboration** | [沟通](03-Collaboration/01-Communication.md) · [规划](03-Collaboration/02-Planning.md) · [RFC](03-Collaboration/03-RFC-Process.md) |
| **04-Engineering** | [工作流](04-Engineering/01-Workflow.md) · [质量](04-Engineering/02-Quality-Assurance.md) |
| **05-Knowledge** | [文档规范](05-Knowledge/01-Documentation-Guide.md) |
| **06-Glossary** | [中文](06-Glossary/README.zh.md) |
| **governance-skills** | [Skills](governance-skills/README.zh.md) — Agent Skills、CLI 与平台适配器 |

## 关键概念

- **所有工程变更必须可追溯、可复现、可评审、可验证、可回滚。**
- **风险决定流程强度**——低风险可回滚变更走轻量流程；生产、AI 与具身系统走重量级流程。
- **质量是证据，不是感觉**——每一条系统主张都必须有可核查的证明。
- **原型不得静默地成为生产依赖。**
- **AI / Agent / 具身变更需要传统软件测试之外的专项验证。**

## 使用方式

- **启动新项目** → 阅读 [Principles](01-Foundation/01-Principles.md)，再读 [Workflow](04-Engineering/01-Workflow.md) §5（Engineering Ready）。
- **提出重大变更** → 阅读 [RFC Process](03-Collaboration/03-RFC-Process.md)。
- **执行工程任务** → 阅读 [Workflow](04-Engineering/01-Workflow.md)。
- **了解质量要求** → 阅读 [Quality Assurance](04-Engineering/02-Quality-Assurance.md)。
- **撰写文档** → 阅读 [Documentation Guide](05-Knowledge/01-Documentation-Guide.md)。
- **遇到陌生术语** → 查阅 [Glossary](06-Glossary/README.zh.md)。

## 语言版本

所有文档提供三种语言：

| 语言 | 路径 | 说明 |
|----------|------|-------|
| **中文** | 各章节根目录（如 `01-Foundation/01-Principles.md`） | 完整翻译 |
| **English** | `en/` 子目录（如 `01-Foundation/en/01-Principles.md`） | 主版本 / 权威版本 |
| **日本語** | `ja/` 子目录（如 `01-Foundation/ja/01-Principles.md`） | 完整翻译 |

本 README 的三语版本：[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)。[Glossary](06-Glossary/README.zh.md) 采用同样的 `en/` / `zh/` / `ja/` 结构，以英文为默认。

## 状态

**Active**——本仓库处于活跃开发中。Foundation、Governance、Collaboration、Engineering、Knowledge 各章节已完成。技术标准目录（`04-Engineering/standards/`）尚待完善，仍在持续补充。

## License

[MIT](LICENSE)

## Ownership

由 Moonweave AI 核心团队维护。治理文档的变更需按 [03-Collaboration/03-RFC-Process.md](03-Collaboration/03-RFC-Process.md) 中定义的 RFC 流程批准。
