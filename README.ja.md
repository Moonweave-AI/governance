# Moonweave AI Governance · Moonweave AI ガバナンスリポジトリ

> **言語**: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

本リポジトリは Moonweave/Kaguya Project（輝夜計画）の原則、組織構造、コラボレーションプロトコル、エンジニアリングワークフロー、品質基準、知識管理プラクティスを定義します——これは自律 Agent、AI インフラ、具身知能を統合する長期ライフサイクルの AI アーキテクチャです。

これはコードではありません。これはプロジェクトの運用システムです。ソフトウェア、AI/Agent システム、データパイプライン、モデルサービス、具身ロボティクスにわたるエンジニアリングを安全、トレーサブル、持続可能にするためのルール、プロセス、標準です。

## 構造概要

```mermaid
flowchart LR
    A["Moonweave AI Governance<br/>Moonweave AI ガバナンス運用システム"]
    A --> F["01-Foundation<br/>基盤"]
    A --> G["02-Governance<br/>ガバナンス"]
    A --> C["03-Collaboration<br/>コラボレーション"]
    A --> E["04-Engineering<br/>エンジニアリング"]
    A --> K["05-Knowledge<br/>知識蓄積"]
    A --> L["06-Glossary<br/>用語集"]
    F --> F1["Principles<br/>ミッション、原則、約束、衝突裁定"]
    F --> F2["Security & Ethics<br/>セキュリティ、プライバシー、コンプライアンス、倫理境界"]
    G --> G1["Organization<br/>役割、権限、Owner、エスカレーション経路"]
    G --> G2["Community<br/>貢献者成長、コミュニティ健全性、行動規範"]
    C --> C1["Communication<br/>プラットフォーム分担、事実源、会議、Agent プッシュ"]
    C --> C2["Planning<br/>Idea から Operation への計画フロー"]
    C --> C3["RFC Process<br/>重大変更意思決定フロー"]
    E --> E1["Workflow<br/>工程実行フロー"]
    E --> E2["Quality Assurance<br/>品質証拠とゲート"]
    E --> E3["Standards<br/>API / フロントエンド / バックエンド / AI システム標準"]
    K --> K1["Documentation Guide<br/>ドキュメントと知識資産管理"]
    K --> K2["RFC Archive<br/>重大提案ヒストリー"]
    K --> K3["ADR Archive<br/>アーキテクチャ意思決定ヒストリー"]
    K --> K4["Research Logs<br/>実験、論文、データ記録"]
    L --> L1["Governance & Process"]
    L --> L2["Engineering & Development"]
    L --> L3["Quality & Testing"]
    L --> L4["Security & Compliance"]
    L --> L5["AI / Agent / Data"]
    L --> L6["Infrastructure & Operations"]
    L --> L7["Embodiment & Robotics"]
    L --> L8["Documentation & Knowledge"]
```

## Idea から Operation へのワークフロー

```mermaid
flowchart TB
    I["Idea / 要件 / 問題"] --> P["Planning<br/>やる価値があるか判断"]
    P --> R{"重大変更か？"}
    R -- "はい" --> RFC["RFC Process<br/>公開論証と裁定"]
    R -- "いいえ" --> W["Workflow<br/>工程実行"]
    RFC --> ADR["ADR<br/>アーキテクチャ意思決定の記録"]
    ADR --> W
    W --> QA["Quality Assurance<br/>品質証拠とゲート"]
    QA --> S{"セキュリティ / AI / 具現リスクをトリガするか？"}
    S -- "はい" --> SE["Security & Ethics<br/>専用審査 / Stop-Ship"]
    S -- "いいえ" --> REL["Release / Deploy"]
    SE -->|通過| REL
    SE -->|ブロック| FIX["是正 / 例外 / 終了"]
    REL --> OP["Operation<br/>運用、監視、フィードバック"]
    OP --> K["Knowledge<br/>ドキュメント、Runbook、Postmortem、Research Log"]
    K --> IMP["Improve / Retire<br/>反復または退役"]
    IMP --> P
```

## ドキュメント関係

```mermaid
flowchart TB
    P["Principles<br/>原則：なぜこうするか"]
    SE["Security & Ethics<br/>セキュリティと倫理：越えられない境界"]
    ORG["Organization<br/>組織：誰が責任を持ち、誰が裁定するか"]
    COM["Communication<br/>コミュニケーション：どこで話し、どこに沈殿させるか"]
    PLAN["Planning<br/>計画：Idea がどうプロジェクトになるか"]
    RFC["RFC Process<br/>重大変更をどう決定するか"]
    WF["Workflow<br/>エンジニアリング：どう実装するか"]
    QA["Quality Assurance<br/>品質：どんな証拠が十分か"]
    DOC["Documentation Guide<br/>知識：どう記録し引き継ぐか"]
    GLO["Glossary<br/>用語集：共通言語"]
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
    GLO -.用語統一.-> P
    GLO -.用語統一.-> SE
    GLO -.用語統一.-> ORG
    GLO -.用語統一.-> COM
    GLO -.用語統一.-> PLAN
    GLO -.用語統一.-> RFC
    GLO -.用語統一.-> WF
    GLO -.用語統一.-> QA
    GLO -.用語統一.-> DOC
```

## ディレクトリ構造

```text
01-Foundation/          原則とセキュリティ倫理基線
02-Governance/          組織、役割、コミュニティルール
03-Collaboration/       コミュニケーション、計画、RFC プロセス
04-Engineering/         ワークフロー、品質保証、技術標準
05-Knowledge/           ドキュメントガイドと知識資産管理
06-Glossary/            英 / 中 / 日 の用語定義
governance-skills/      Agent Skills・コマンド・テンプレート・CLI・プラットフォームアダプタ
                        本ガバナンス体系を呼出可能・検査可能なツールへコンパイル
```

| セクション | 日本語 |
|---------|--------|
| **01-Foundation** | [原則](01-Foundation/ja/01-Principles.md) · [セキュリティ](01-Foundation/ja/02-Security-Ethics.md) |
| **02-Governance** | [組織](02-Governance/ja/01-Organization.md) · [コミュニティ](02-Governance/ja/02-Community.md) |
| **03-Collaboration** | [コミュニケーション](03-Collaboration/ja/01-Communication.md) · [プランニング](03-Collaboration/ja/02-Planning.md) · [RFC](03-Collaboration/ja/03-RFC-Process.md) |
| **04-Engineering** | [ワークフロー](04-Engineering/ja/01-Workflow.md) · [品質](04-Engineering/ja/02-Quality-Assurance.md) |
| **05-Knowledge** | [ドキュメント](05-Knowledge/ja/01-Documentation-Guide.md) |
| **06-Glossary** | [日本語](06-Glossary/README.ja.md) |
| **governance-skills** | [Skills](governance-skills/README.ja.md) — Agent Skills・CLI・プラットフォームアダプタ |

## 主要概念

- **すべてのエンジニアリング変更はトレーサブル、再現可能、レビュー可能、検証可能、リバース可能でなければならない。**
- **リスクがプロセス強度を決める**——低リスクでリバース可能な変更は軽量プロセス、本番・AI・具身システムは重量級プロセス。
- **品質は証拠であり、感覚ではない**——すべてのシステム主張には検証可能な証明が伴う必要がある。
- **プロトタイプが暗黙に本番依存になってはならない。**
- **AI / Agent / 具身変更には従来のソフトウェアテストを超えた専用検証が必要。**

## 使い方

- **新規プロジェクトを始める** → [Principles](01-Foundation/ja/01-Principles.md) を読み、次に [Workflow](04-Engineering/ja/01-Workflow.md) §5（Engineering Ready）を読む。
- **重大な変更を提案する** → [RFC Process](03-Collaboration/ja/03-RFC-Process.md) を読む。
- **エンジニアリングタスクを実装する** → [Workflow](04-Engineering/ja/01-Workflow.md) を読む。
- **品質要件を理解する** → [Quality Assurance](04-Engineering/ja/02-Quality-Assurance.md) を読む。
- **ドキュメントを書く** → [Documentation Guide](05-Knowledge/ja/01-Documentation-Guide.md) を読む。
- **見慣れない用語に出会ったら** → [Glossary](06-Glossary/README.ja.md) を参照する。

## 言語

すべてのドキュメントは三言語で提供されます：

| 言語 | パス | 備考 |
|----------|------|-------|
| **中文 (中国語)** | 各セクションのルート（例: `01-Foundation/01-Principles.md`） | 主/権威バージョン |
| **English** | `en/` サブディレクトリ（例: `01-Foundation/en/01-Principles.md`） | 完全翻訳 |
| **日本語** | `ja/` サブディレクトリ（例: `01-Foundation/ja/01-Principles.md`） | 完全翻訳 |

本 README の三言語版：[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)。[Glossary](06-Glossary/README.ja.md) は同じ `en/` / `zh/` / `ja/` 構造を用い、英語をデフォルトとします。

## ステータス

**Active**——本リポジトリは活発に開発中です。Foundation、Governance、Collaboration、Engineering、Knowledge の各セクションは完成しています。技術標準ディレクトリ（`04-Engineering/standards/`）はまだ整備中で、継続的に拡充されています。

## License

[MIT](LICENSE)

## Ownership

Moonweave AI コアチームが保守します。ガバナンス文書の変更には [03-Collaboration/03-RFC-Process.md](03-Collaboration/ja/03-RFC-Process.md) で定義される RFC プロセスの承認が必要です。
