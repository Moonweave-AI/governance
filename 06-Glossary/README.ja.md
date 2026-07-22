# 用語集

> **言語**：[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

本ディレクトリは、輝夜計画ガバナンス文書で使用されるすべての主要概念・手法・用語の定義を提供します。

## 言語バージョン

| 言語 | ディレクトリ |
|----------|-----------|
| **English**（デフォルト） | [`en/`](en/) |
| **中文** | [`zh/`](zh/) |
| **日本語** | [`ja/`](ja/) |

## カテゴリ

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

## 使い方

- **デフォルト言語は英語です。** 中国語版は `zh/`、日本語版は `ja/` をご参照ください。
- 3つのバージョンは同じ用語を同じ構造でカバーしています。
- 用語は分野別に編成されており、アルファベット順ではありません——該当分野を先に探してください。
- 各エントリは英語の用語を見出しとし、ローカライズ名と簡潔な説明を示します。

```mermaid
flowchart
    X["見慣れない用語に出会った"] --> L{"言語版を選択"}
    L --> EN["en/<category>.md<br/>English default"]
    L --> ZH["zh/<category>.md<br/>中文"]
    L --> JA["ja/<category>.md<br/>日本語"]
    EN --> C{"カテゴリ別に検索"}
    ZH --> C
    JA --> C
    C --> G1["ガバナンスとプロセス"]
    C --> G2["エンジニアリングと開発"]
    C --> G3["品質とテスト"]
    C --> G4["セキュリティとコンプライアンス"]
    C --> G5["AI / Agent / データ"]
    C --> G6["インフラと運用"]
    C --> G7["具現知能とロボット工学"]
    C --> G8["ドキュメントと知識管理"]
    G1 --> TERM["用語エントリ<br/>英語の用語 / ローカライズ名 / 簡潔な説明"]
    G2 --> TERM
    G3 --> TERM
    G4 --> TERM
    G5 --> TERM
    G6 --> TERM
    G7 --> TERM
    G8 --> TERM
    TERM --> DOC["関連するガバナンス / エンジニアリング / ドキュメントページに戻る"]
```
