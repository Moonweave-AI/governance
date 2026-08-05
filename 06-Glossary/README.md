---
type: glossary
status: Active
owner: Moonweave AI Governance Maintainers
created: 2026-07-22
updated: 2026-08-05
last_reviewed: 2026-08-05
review_cycle_days: 180
summary: "Authoritative glossary: Glossary."
canonical: ./README.md
related: []
supersedes: []
superseded_by: []
---
# Glossary

> **Language**: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

This directory provides definitions for all key concepts, methods, and terms used throughout the Moonweave/Kaguya Project governance documents.

## Language Versions

| Language | Directory |
|----------|-----------|
| **English** (default) | [`en/`](en/) |
| **中文** | [`zh/`](zh/) |
| **日本語** | [`ja/`](ja/) |

## Categories

| # | English | 中文 | 日本語 |
|---|---------|------|--------|
| 01 | [Governance & Process](en/01-governance-and-process.md) | [治理与流程](zh/01-governance-and-process.md) | [ガバナンスとプロセス](ja/01-governance-and-process.md) |
| 02 | [Engineering & Development](en/02-engineering-and-development.md) | [工程与开发](zh/02-engineering-and-development.md) | [エンジニアリングと開発](ja/02-engineering-and-development.md) |
| 03 | [Quality & Testing](en/03-quality-and-testing.md) | [质量与测试](zh/03-quality-and-testing.md) | [品質とテスト](ja/03-quality-and-testing.md) |
| 04 | [Security & Compliance](en/04-security-and-compliance.md) | [安全与合规](zh/04-security-and-compliance.md) | [セキュリティとコンプライアンス](ja/04-security-and-compliance.md) |
| 05 | [AI, Agent & Data](en/05-ai-agent-and-data.md) | [AI、Agent 与数据](zh/05-ai-agent-and-data.md) | [AI・エージェント・データ](ja/05-ai-agent-and-data.md) |
| 06 | [Infrastructure & Operations](en/06-infrastructure-and-operations.md) | [基础设施与运维](zh/06-infrastructure-and-operations.md) | [インフラストラクチャと運用](ja/06-infrastructure-and-operations.md) |
| 07 | [Embodiment & Robotics](en/07-embodiment-and-robotics.md) | [具身智能与机器人](zh/07-embodiment-and-robotics.md) | [身体性知能とロボティクス](ja/07-embodiment-and-robotics.md) |
| 08 | [Documentation & Knowledge](en/08-documentation-and-knowledge.md) | [文档与知识管理](zh/08-documentation-and-knowledge.md) | [ドキュメンテーションと知識管理](ja/08-documentation-and-knowledge.md) |

## Usage

- **Default language is English.** Switch to `zh/` or `ja/` for Chinese or Japanese versions.
- All three versions cover the same terms in the same structure.
- Terms are organized by domain, not alphabetically—find the relevant domain first.
- Each entry provides the English term as heading, the localized name, and a concise explanation.

```mermaid
flowchart
    X["Encountering an unfamiliar term"] --> L{"Select language version"}
    L --> EN["en/<category>.md<br/>English default"]
    L --> ZH["zh/<category>.md<br/>中文"]
    L --> JA["ja/<category>.md<br/>日本語"]
    EN --> C{"Find by category"}
    ZH --> C
    JA --> C
    C --> G1["Governance & Process"]
    C --> G2["Engineering & Development"]
    C --> G3["Quality & Testing"]
    C --> G4["Security & Compliance"]
    C --> G5["AI / Agent / Data"]
    C --> G6["Infrastructure & Operations"]
    C --> G7["Embodiment & Robotics"]
    C --> G8["Documentation & Knowledge"]
    G1 --> TERM["Glossary entry<br/>English term / Localized name / Concise explanation"]
    G2 --> TERM
    G3 --> TERM
    G4 --> TERM
    G5 --> TERM
    G6 --> TERM
    G7 --> TERM
    G8 --> TERM
    TERM --> DOC["Back to related governance / engineering / documentation pages"]
```
