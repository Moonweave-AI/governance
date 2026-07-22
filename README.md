# Moonweave AI Governance · Moonweave AI Governance Repository

> **Language**: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

This repository defines the principles, organizational structure, collaboration protocols, engineering workflows, quality standards, and knowledge management practices for the Moonweave/Kaguya Project — a long-lifecycle AI architecture integrating autonomous agents, AI infrastructure, and embodied intelligence.

This is not code. This is the project's operating system: the rules, processes, and standards that enable safe, traceable, and sustainable engineering across software, AI/Agent systems, data pipelines, model services, and embodied robotics.

## Structure Overview

```mermaid
flowchart LR
    A["Moonweave AI Governance<br/>Moonweave AI Governance Operating System"]
    A --> F["01-Foundation<br/>Foundation"]
    A --> G["02-Governance<br/>Governance"]
    A --> C["03-Collaboration<br/>Collaboration"]
    A --> E["04-Engineering<br/>Engineering"]
    A --> K["05-Knowledge<br/>Knowledge"]
    A --> L["06-Glossary<br/>Glossary"]
    F --> F1["Principles<br/>Mission, Principles, Commitments, Conflict Resolution"]
    F --> F2["Security & Ethics<br/>Security, Privacy, Compliance, Ethics Boundaries"]
    G --> G1["Organization<br/>Roles, Permissions, Owner, Escalation Path"]
    G --> G2["Community<br/>Contributor Growth, Community Health, Code of Conduct"]
    C --> C1["Communication<br/>Platform Roles, Source of Truth, Meetings, Agent Push"]
    C --> C2["Planning<br/>Planning Flow from Idea to Operation"]
    C --> C3["RFC Process<br/>Major Change Decision Process"]
    E --> E1["Workflow<br/>Engineering Execution Flow"]
    E --> E2["Quality Assurance<br/>Quality Evidence and Gates"]
    E --> E3["Standards<br/>API / Frontend / Backend / AI Systems Standards"]
    K --> K1["Documentation Guide<br/>Documentation and Knowledge Asset Management"]
    K --> K2["RFC Archive<br/>Major Proposal History"]
    K --> K3["ADR Archive<br/>Architecture Decision History"]
    K --> K4["Research Logs<br/>Experiments, Papers, Data Records"]
    L --> L1["Governance & Process"]
    L --> L2["Engineering & Development"]
    L --> L3["Quality & Testing"]
    L --> L4["Security & Compliance"]
    L --> L5["AI / Agent / Data"]
    L --> L6["Infrastructure & Operations"]
    L --> L7["Embodiment & Robotics"]
    L --> L8["Documentation & Knowledge"]
```

## Idea to Operation Workflow

```mermaid
flowchart TB
    I["Idea / Need / Problem"] --> P["Planning<br/>Decide if worth doing"]
    P --> R{"Major change?"}
    R -- "Yes" --> RFC["RFC Process<br/>Public deliberation and decision"]
    R -- "No" --> W["Workflow<br/>Engineering execution"]
    RFC --> ADR["ADR<br/>Record architecture decision"]
    ADR --> W
    W --> QA["Quality Assurance<br/>Quality evidence and gates"]
    QA --> S{"Triggers security / AI / embodiment risk?"}
    S -- "Yes" --> SE["Security & Ethics<br/>Specialized review / Stop-Ship"]
    S -- "No" --> REL["Release / Deploy"]
    SE -->|Pass| REL
    SE -->|Block| FIX["Fix / Exception / Terminate"]
    REL --> OP["Operation<br/>Operation, monitoring, feedback"]
    OP --> K["Knowledge<br/>Docs, Runbook, Postmortem, Research Log"]
    K --> IMP["Improve / Retire<br/>Iterate or retire"]
    IMP --> P
```

## Document Relationships

```mermaid
flowchart TB
    P["Principles<br/>Principles: why we do this"]
    SE["Security & Ethics<br/>Security & Ethics: which boundaries cannot be crossed"]
    ORG["Organization<br/>Organization: who is responsible, who decides"]
    COM["Communication<br/>Communication: where to discuss, where to persist"]
    PLAN["Planning<br/>Planning: how an idea becomes a project"]
    RFC["RFC Process<br/>How major changes are decided"]
    WF["Workflow<br/>Engineering: how to implement"]
    QA["Quality Assurance<br/>Quality: what evidence is sufficient"]
    DOC["Documentation Guide<br/>Knowledge: how to record and hand down"]
    GLO["Glossary<br/>Glossary: shared language"]
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
    GLO -.shared terminology.-> P
    GLO -.shared terminology.-> SE
    GLO -.shared terminology.-> ORG
    GLO -.shared terminology.-> COM
    GLO -.shared terminology.-> PLAN
    GLO -.shared terminology.-> RFC
    GLO -.shared terminology.-> WF
    GLO -.shared terminology.-> QA
    GLO -.shared terminology.-> DOC
```

## Directory Structure

```text
01-Foundation/          Principles and security-ethics baseline
02-Governance/          Organization, roles, and community rules
03-Collaboration/       Communication, planning, and RFC process
04-Engineering/         Workflow, quality assurance, and technical standards
05-Knowledge/           Documentation guide and knowledge asset management
06-Glossary/            Term definitions in English, Chinese, and Japanese
```

| Section | English |
|---------|---------|
| **01-Foundation** | [Principles](01-Foundation/en/01-Principles.md) · [Security & Ethics](01-Foundation/en/02-Security-Ethics.md) |
| **02-Governance** | [Organization](02-Governance/en/01-Organization.md) · [Community](02-Governance/en/02-Community.md) |
| **03-Collaboration** | [Communication](03-Collaboration/en/01-Communication.md) · [Planning](03-Collaboration/en/02-Planning.md) · [RFC](03-Collaboration/en/03-RFC-Process.md) |
| **04-Engineering** | [Workflow](04-Engineering/en/01-Workflow.md) · [Quality](04-Engineering/en/02-Quality-Assurance.md) |
| **05-Knowledge** | [Documentation](05-Knowledge/en/01-Documentation-Guide.md) |
| **06-Glossary** | [English](06-Glossary/README.md) |

## Key Concepts

- **All engineering changes must be traceable, reproducible, reviewable, verifiable, and reversible.**
- **Risk determines process intensity** — lightweight for low-risk reversible changes; heavyweight for production, AI, and embodied systems.
- **Quality is evidence, not feeling** — every system claim must be backed by checkable proof.
- **Prototypes must not silently become production dependencies.**
- **AI/Agent/Embodied changes require specialized validation beyond traditional software testing.**

## How to Use This Repository

- **Starting a new project** → Read [Principles](01-Foundation/en/01-Principles.md), then [Workflow](04-Engineering/en/01-Workflow.md) §5 (Engineering Ready).
- **Proposing a significant change** → Read [RFC Process](03-Collaboration/en/03-RFC-Process.md).
- **Implementing an engineering task** → Read [Workflow](04-Engineering/en/01-Workflow.md).
- **Understanding quality requirements** → Read [Quality Assurance](04-Engineering/en/02-Quality-Assurance.md).
- **Writing documentation** → Read [Documentation Guide](05-Knowledge/en/01-Documentation-Guide.md).
- **Encountering an unfamiliar term** → Check the [Glossary](06-Glossary/README.md).

## Languages

All documents are available in three languages:

| Language | Path | Notes |
|----------|------|-------|
| **中文 (Chinese)** | `zh/` companion files & section roots (e.g., `01-Foundation/01-Principles.md`) | Full translation |
| **English** | `en/` subdirectory (e.g., `01-Foundation/en/01-Principles.md`) | Primary/canonical version |
| **日本語 (Japanese)** | `ja/` subdirectory (e.g., `01-Foundation/ja/01-Principles.md`) | Full translation |

This README in three languages: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md). The [Glossary](06-Glossary/README.md) uses the same `en/` / `zh/` / `ja/` structure with English as default.

## Status

**Active** — This repository is under active development. Foundation, Governance, Collaboration, Engineering, and Knowledge sections are complete. The technical standards directory (`04-Engineering/standards/`) is still being refined and continues to be expanded.

## License

[MIT](LICENSE)

## Ownership

Maintained by the Moonweave AI core team. Changes to governance documents require RFC process approval as defined in [03-Collaboration/03-RFC-Process.md](03-Collaboration/en/03-RFC-Process.md).
