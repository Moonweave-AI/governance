# RFC プロセス

> 本文は輝夜計画の重大変更に対する正式意思決定プロセスであり、通常の「提案テンプレート」ではありません。アイデアが長期アーキテクチャ、公開インターフェース、リポジトリ横断契約、AI Agent 行動、セキュリティ境界、具身制御、組織ガバナンス、長期保守責任に影響する場合、RFC プロセスを通じて公開論証、レビュー、決定、アーカイブ、実装追跡を完了する必要があります。小変更は Issue / PR、大変更は構造化設計とコミュニティレビューを先に行います。

---

## 1. 目的

RFC は輝夜計画が重大変更を扱う正式メカニズムです。実装前に問題、案、トレードオフ、リスク、移行、責任を公開で明確にし、長期進化のための追跡可能な決定記録を残します。

本文は以下に答えます：どの変更に RFC が必要か、どれに不要か、誰が起案できるか、誰が推進するか、誰がレビューするか、誰が裁定するか、どう議論するか、いつ Final Comment Period に入るか、合意形成とは何か、受理が意味すること、実装をどう追跡するか、RFC は変更可能か。

---

## 2. RFC と他協業メカニズムの関係

| メカニズム | 用途 |
| ---------- | ---- |
| **Issue** | 具体的問題、タスク、Bug、要件議論 |
| **Discussion** | 初期アイデア、オープン質問、コミュニティフィードバック |
| **Planning** | Idea から Prototype / Engineering / Release へのプロジェクト推進 |
| **RFC** | 重大変更の正式提案、論証、決定 |
| **ADR** | すでに下されたアーキテクチャ決定の記録 |
| **Design Doc** | 受理された方向の下での詳細エンジニアリング設計 |
| **PR** | コード、ドキュメント、設定の実装 |
| **Release Note** | ユーザーとメンテナーへの公開変更の説明 |

一文の境界：

> RFC は「こうすべきか、なぜか」を記録する。ADR は「どのようなアーキテクチャ決定を下したか」を記録する。Design Doc は「具体的にどう実装するか」を記録する。PR は「実際の変更は何か」を記録する。Release Note は「利用者にどのような影響があったか」を記録する。

Accepted / Rejected / Superseded / Final の RFC は原則として大幅変更しません——歴史記録であり、正式な振る舞いは対応する標準、規範、ADR で維持します。

---

## 3. RFC が必要な場合

**いずれか一つ**でも該当すれば、RFC は**必須**です：

1. 公共 API、プロトコル、Schema、状態機械、ドメイン契約の変更；
2. 新しい長期インフラ、ランタイム、スケジューリングシステム、データパイプライン、モデルサービスの導入；
3. 2 つ以上のリポジトリ、Area、チーム責任域を横断；
4. コア技術スタック、フレームワーク、モデル、データベース、メッセージングシステム、デプロイ模式の導入、置換、非推奨；
5. セキュリティ、プライバシー、権限、データ保持、長期記憶、コンプライアンス境界への影響；
6. 高自律 Agent 行動、ツール呼び出し権限、長期記憶書き込み、外部システム書き込み操作の導入；
7. 具身端末、センサー、アクチュエーター、シミュレーションから現実への移行、物理安全への影響；
8. 破壊的変更、移行コスト、互換性リスク、長期保守責任の発生；
9. 組織ガバナンス、ロール権限、原則、セキュリティ倫理境界、コミュニティルールの変更；
10. 公開標準、SDK、プロトコル、長期 Roadmap、正式リリース能力など対外コミットメントの確立；
11. 高コスト、ロールバック困難、強いバインドのアーキテクチャ選択の導入；
12. コアシステムまたは公共能力の廃止、置換、アーカイブ。

---

## 4. RFC が不要な場合

通常 RFC 不要：

1. 明確な Bug 修正で、公共振る舞いまたは互換性を変更しない；
2. ドキュメント、スペル、形式、例、コメントの改善；
3. 外部意味を変更しない局部リファクタ；
4. テスト追加、CI 最適化、静的解析改善；
5. アーキテクチャ、副作用、互換性変化のない局部性能最適化；
6. 単一リポジトリ内部実装のみに影響し、Owner が明示同意；
7. 既存 RFC / ADR でカバーされる実装詳細。

> RFC 要否が不明な場合、デフォルトで RFC Triage Issue を作成し、対応 Owner / Maintainer が判断します。

---

## 5. RFC 種別

| 種別 | 用途 | 決定責任 |
| ---- | ---- | -------- |
| **Engineering RFC** | アーキテクチャ、インフラ、サービス、ツールチェーン、エンジニアリング標準 | Maintainer Council / Area Maintainer |
| **API / Protocol RFC** | 公共 API、Schema、プロトコル、状態機械、互換戦略 | API Owner + 関連 Area Owner |
| **AI System RFC** | Agent アーキテクチャ、モデルライフサイクル、ツール呼び出し、記憶、評価 | AI Systems Owner + Security Reviewer |
| **Embodiment RFC** | 具身端末、シミュレーション、センサー、アクチュエーター、物理動作権限 | Embodiment Owner + Safety Reviewer |
| **Research RFC** | 長期研究路線、評価ベンチマーク、データセット標準、再現プロトコル | Research Owner |
| **Security / Ethics RFC** | セキュリティ境界、プライバシールール、高リスク行動、開示メカニズム | Security Owner + Stewardship Council |
| **Governance RFC** | 原則、組織、ロール、コミュニティルール、プロセス改訂 | Stewardship Council |
| **Informational RFC** | 背景、調査、方向説明の記録——直接強制規範を生まない | 記録のみ、強制決定なし |

---

## 6. ロール

### 6.1 Author

RFC の主執筆者。責務：RFC 執筆；背景、データ、代替案、リスクの収集；Review への応答；RFC 状態の維持；解決済み・未解決問題の記録。

### 6.2 Champion

RFC の推進者。Author は Champion になり得ますが、同一である必要はありません。責務：RFC 推進に値するか判断；議論の組織；Reviewer の調整；FCP 進入の推進；合意形成の支援；結果のアーカイブ確保。各 RFC には champion が必須です。

### 6.3 Sponsor

作者がプロセスに入るのを助ける人——外部コントリビューターや新人に特に適します。責務：提案が RFC に適するか判断；作者のプロセス理解支援；正しい Reviewer の発見支援；形式・プロセス問題による不必要なブロック防止。

### 6.4 RFC Editor

プロセスと形式を担い、技術裁定は担いません。責務：RFC 番号割当；テンプレート完全性チェック；状態フィールド維持；RFC Index 維持；アーカイブ、リネーム、実装 Issue リンク支援；RFC メタデータの検索可能性確保。初期レビューは構造、形式、タイトル、言語、完全性に焦点——技術受理の可否ではありません。

### 6.5 Required Reviewers

RFC 種別とリスク等級に応じて指定。最低ルール：

> 各 RFC には少なくとも：関連 Area Reviewer 1 名；Owner または Maintainer 1 名；非作者 Reviewer 1 名が必要です。セキュリティ、プライバシー、AI Agent、長期記憶、具身、公共プロトコル、破壊的変更を含む場合、対応する専門 Reviewer を追加する必要があります。指定 Reviewer は提案本文の作者であってはならず、関連専門能力を持つ必要があります。

### 6.6 Decision Owner

最終裁定者または裁定組織：

- 単一 Area RFC：対応 Area Owner / Maintainer が裁定；
- Area 横断 RFC：Maintainer Council が裁定；
- Security / Ethics RFC：Security Owner + Stewardship Council が裁定；
- Governance RFC：Stewardship Council が裁定；
- 重大争点で収束不能：Stewardship Council が最終裁定。

---

## 7. ライフサイクル状態

```text
Idea → Pre-RFC → Draft → Review → Final Comment Period
  → Accepted / Rejected / Deferred / Withdrawn
  → Active / Implementable → Implemented / Final
  → Superseded / Obsolete
```

| 状態 | 意味 |
| ---- | ---- |
| **Idea** | まだ RFC 形成前、初期アイデアのみ |
| **Pre-RFC** | RFC 必要の可能性確認済み、背景と範囲収集中 |
| **Draft** | RFC 草案形成済み、まだ正式レビュー前 |
| **Review** | RFC が形式チェック通過、正式レビュー中 |
| **Final Comment Period (FCP)** | 最終評議期、ブロッキング異議の最終収集 |
| **Accepted** | 方向受理、実装計画に入れる |
| **Rejected** | 拒否、理由記録必須 |
| **Deferred** | 延期、通常 Owner、証拠、リソース、タイミング不足 |
| **Withdrawn** | 作者が自主的に撤回 |
| **Active / Implementable** | 受理済み、実装追跡中 |
| **Implemented / Final** | 着地・検証済み |
| **Superseded** | 後続 RFC に置換 |
| **Obsolete** | 不再適用、歴史記録のみ |

---

## 8. 提出プロセス

```text
Pre-RFC Issue → Draft Markdown → RFC PR → Editor Check → Review → FCP → Decision → Merge / Close → Implementation Tracking
```

### 8.1 Pre-RFC

入口：GitHub Discussion；GitHub Issue；Planning Discovery；Research Log；Incident Postmortem；Security Review；Maintainer 提案；Community feedback；Agent 自動発見のアーキテクチャギャップ。

Pre-RFC の目標は完全な案の執筆ではなく、以下を確認することです：本当に RFC が必要か；問題は明確か；影響範囲は十分に重大か；重複 RFC / ADR / Issue はないか；明らかなセキュリティ、コンプライアンス、出所ブロックはないか；Champion / Sponsor / Owner が見つかるか。正式執筆前に公開でアイデアを検証し、明らかに不適または重複なアイデアへの過度投入を避けます。

### 8.2 Draft

推奨命名：`05-Knowledge/rfc/0000-short-title.md`（番号付与前は `drafts/` 可）、通過後 `05-Knowledge/rfc/0007-short-title.md` に変更。

番号ルール：RFC 番号は RFC Editor が割当；草案段階は 0000；正式 Review または Accepted 後は固定番号；一度割当後、番号再利用不可。

### 8.3 Submit

1. 作者が RFC テンプレートから Markdown ファイルを作成；
2. `moonweave-guidelines` リポジトリに提出；
3. Pull Request 形式で RFC をオープン；
4. PR タイトルは `[RFC] short title`；
5. PR は Pre-RFC Issue / Discussion / Planning item にリンク必須；
6. RFC Editor が形式とメタデータをチェック；
7. 形式チェック通過後 Review に入る。

Issue ではなく PR を使用：バージョン履歴が明確；コメントを段落ごとに；レビュー状態可視；CODEOWNERS で関連 Reviewer 依頼可；merge で正式アーカイブを表現。

---

## 9. Review 要件

Review は問題、トレードオフ、リスクを中心とし、潤色だけではありません。確認必須：問題は実在するか；目標と非目標は明確か；案は十分具体か；代替案は真剣に比較されたか；セキュリティ、プライバシー、コンプライアンス、IP リスクは説明されたか；AI / Agent リスクは説明されたか；具身リスクは説明されたか；移行、互換、ロールバックは可能か；テスト、評価、可観測性は可能か；Owner、DRI、実装パスは明確か；複数 RFC への分割が必要か。

### レビューマトリクス

| RFC 種別 | 必須レビュー |
| -------- | ------------ |
| Engineering RFC | Area Maintainer、Owner、独立 Reviewer 少なくとも 1 名 |
| API / Protocol RFC | API Owner、フロントエンド代表、バックエンド代表、互換性 Reviewer |
| AI System RFC | AI Owner、Security Reviewer、Evaluation Reviewer、Data/Memory Reviewer |
| Embodiment RFC | Embodiment Owner、Safety Reviewer、Hardware/Simulation Reviewer、Security Reviewer |
| Research RFC | Research Owner、Reproducibility Reviewer、Data Reviewer |
| Security / Ethics RFC | Security Owner、Privacy Reviewer、Stewardship Council |
| Governance RFC | Stewardship Council、Maintainer Council、Community Reviewer |

Security、Privacy、AI Safety、Embodiment Safety、Architecture、Community Impact に対する横断レビュー——RFC 成熟過程で継続的に求め、最後に後付けしない。

硬いルール：

> 作者は唯一の Reviewer であってはならない。Champion は自分の RFC を単独裁定してはならない。セキュリティ、プライバシー、具身、人身リスク、未許可資産を含む RFC は、通常の技術多数意見で専門レビューを迂回してはならない。

---

## 10. Final Comment Period

FCP は「最終評議期」であり、無限議論の再開ではありません。

**トリガー**：Decision Owner が RFC が十分成熟し、主要問題が処理されたと判断したとき、FCP を開始できます。

**推奨期間**：

- 通常 RFC：7 暦日；
- Area 横断 / API / Infra RFC：10–14 暦日；
- Security / AI / Embodiment / Governance RFC：14–21 暦日；
- 緊急 RFC：短縮可だが理由明記必須。

**FCP 開始前に要約コメント必須**：現行案；解決済み問題；受け入れた代償；不採用代替案；既知リスク；未解決異議の有無；期待裁定（Accept / Reject / Defer）。重大修正は新 FCP をトリガーし得ます。

---

## 11. 合意形成と裁定

**Rough Consensus + Responsible Decision** を採用：

```text
十分な議論 → 実質的異議の処理 → 未解決分岐の記録 → Decision Owner が裁定 → 上訴パス保留
```

**合意が意味しないこと**：多数決；全員同意；コメントなし；沈黙による自動通過；上級者が決める；作者が最後まで粘れば勝つ。

**有効な異議は**：具体的；理解可能；プロジェクト原則、目標、リスク、事実に関連；なぜ受理をブロックするか説明可能；できれば代替案、修正提案、検証可能条件を提示。

**裁定**：FCP 終了後、Decision Owner が `Accepted / Rejected / Deferred / Withdrawn / Needs Revision / Split Required` を下します。裁定は RFC PR 最終コメントに書き、RFC ファイルに記録：

```text
Decision:
Decision Owner:
Decision Date:
Resolution Link:
Accepted Trade-offs:
Rejected Alternatives:
Unresolved Concerns:
Follow-up Issues:
```

合意は多数決でも全員満足でもありません。鍵は実質的異議を真剣に処理し、反対者に関心が採用されなかった理由を説明することです。賛成/反対の数だけでは重要少数意見がノイズに埋もれます。

**上訴パス**：裁定に不服な場合、上位決定主体へエスカレーション（Area → Maintainer Council → Stewardship Council）。最終上訴機関は `../../02-Governance/ja/01-Organization.md` §12 参照。

---

## 12. Accepted 以降

> RFC Accepted は方向が受理され、実装計画に入れることを意味するのみです。関連コード、設定、モデル、サービス、具身行動が PR Review、セキュリティレビュー、品質ゲート、リリースプロセスを迂回できる意味ではありません。RFC active は rubber stamp ではなく、最終マージを保証しません。

Accepted 後に作成または更新必須：Implementation Issue；GitHub Project item；Owner / DRI；ADR（アーキテクチャ決定が形成された場合）；standards ドキュメント（標準変更の場合）；release checklist（リリース影響の場合）；migration issue（互換性関与の場合）；security review issue（セキュリティ関与の場合）；evaluation issue（AI / Agent 関与の場合）；embodied safety checklist（物理実行関与の場合）。

「RFC → 標準 → 実装」の三段式を形成：通過後 spec 統合 issue を作成；規範統合後、関連実装の backlog issue を作成。

---

## 13. Rejected / Deferred / Withdrawn

拒否、延期、撤回は理由を記録し、歴史記録を保持する必要があります：

- **Rejected**：拒否理由と不採用代替案を記録し、同一争点の反復を避ける。
- **Deferred**：延期理由（Owner、証拠、リソース、タイミング不足）と再評価条件を記録。
- **Withdrawn**：作者が自主的に撤回、撤回理由を記録。

拒否された RFC も RFC Index に残し、歴史記録と重複防止参照とします。

---

## 14. 改訂、廃止、置換

Accepted / Rejected / Superseded / Final の RFC は原則実質変更しません。後続設計が重大変化した場合、Amendment RFC または新 RFC を提出し、旧 RFC に `superseded_by` をマーク。

許可される小修正：スペル；リンク；状態；implementation issue；ADR リンク；release リンク；決定意味を変えない明確な注釈。

実質改訂は以下に従う必要があります：

```text
Revision PR → Reviewer check → 必要に応じ FCP → Decision Owner approval
```

---

## 15. RFC と ADR の関係

> RFC が受理されアーキテクチャ決定をもたらす場合、ADR を生成または更新する必要があります。RFC は提案プロセスとトレードオフを説明；ADR は最終アーキテクチャ決定とその帰結を説明します。

| RFC 状態 | ADR アクション |
| -------- | -------------- |
| Accepted Engineering RFC | ADR 作成 |
| Accepted API / Protocol RFC | API 標準更新 + 場合により ADR 作成 |
| Accepted AI System RFC | AI Systems 標準更新 + 場合により ADR 作成 |
| Accepted Embodiment RFC | Safety / Embodiment 標準更新 + ADR 作成 |
| Rejected RFC | 通常 ADR 作成しないが RFC 記録は保持 |
| Superseded RFC | 関連 ADR 状態を更新 |

---

## 16. ファストトラックと緊急経路

### 16.1 Fast-track RFC

適用：十分な合意既存；低リスク；小範囲；既存プロセスの明らかな欠陥修正；セキュリティ、プライバシー、具身、公共プロトコル、破壊的変更を含まない。

プロセス：`Draft → Review → 3–5 日 FCP → Decision`。

### 16.2 Emergency RFC

適用：セキュリティ事故；本番中断；コンプライアンスリスク；具身リスク；高危脆弱性；重大外部依存失効。

ルール：緊急 RFC は Owner / Security Owner / Stewardship Council による一時決定を先に行えるが、事後に RFC または ADR で背景、リスク、決定、代替案、後続修正を補完記録する必要があります。高リスクリリースには明確なチェックポイントが必要ですが、実エンジニアリングでは緊急時にも追跡可能な決定記録を残す必要があります。

---

## 17. プラットフォームと自動化

### 17.1 GitHub

- RFC は PR 形式で `moonweave-guidelines` に提出；
- RFC PR は `[RFC]` プレフィックス；
- すべての RFC PR は自動で `Moonweave RFC Pipeline` Project に入る；
- label で種別、状態、リスク、Area を表現；
- CODEOWNERS で関連 Reviewer を自動依頼；
- FCP 開始・終了は RFC Editor または Bot がマーク；
- 通過後 `05-Knowledge/rfc/` に merge。

推奨ラベル：

```text
rfc / rfc:pre / rfc:draft / rfc:review / rfc:fcp / rfc:accepted / rfc:rejected / rfc:deferred / rfc:withdrawn
type:engineering / type:api-protocol / type:ai-system / type:embodiment / type:research / type:security / type:governance
risk:S0 ... risk:S5
area:agent / area:infra / area:frontend / area:backend / area:embodiment / area:research
needs:security-review / needs:privacy-review / needs:ai-safety-review / needs:embodiment-review / needs:owner / needs:decision
```

### 17.2 飞书

飞书 はリマインダー、調整、会議のみ——事実源ではありません。`mw-rfc-review`（レビューリマインダー）、`mw-engineering`（エンジニアリング RFC 通知）、`mw-security-private`（セキュリティ機微 RFC）、`mw-embodiment`（具身 RFC レビュー）、`mw-announcements`（Accepted / Rejected / FCP 公告）。

ルール：飞书 で形成された RFC 結論は GitHub PR または RFC ファイルに書き戻す必要があります。飞书 投票、リアクション、口頭同意は RFC 決定根拠になれません。

### 17.3 Notion

索引と閲覧ビューは維持可だが RFC 原文の事実源ではない：RFC Index；RFC Calendar；RFC Review Queue；RFC Decision Summary；Area RFC Map。

### 17.4 Agent：Kaguya RFC Steward

機能：RFC テンプレート完全性チェック；Owner / Champion / risk_level 欠如をマーク；RFC PR を Project に自動追加；type と area に応じ Reviewer 依頼；FCP 開始、残り 48 時間、終了をリマインド；オープン問題を集約；stale RFC を検出；decision summary 草案を生成；Accepted 後 implementation issue 草案を作成。

制限：

> Agent は RFC を自動受理、拒否、マージしてはならない。Agent は Decision Owner を代替してはならない。Agent はセキュリティ機微 RFC の内容を通常チャネルに漏洩してはならない。

### 17.5 RFC Pipeline フィールド

| フィールド | 型 | 説明 |
| ---------- | -- | ---- |
| `RFC ID` | Text | RFC-0000 / RFC-0007 |
| `Status` | Single select | Pre / Draft / Review / FCP / Accepted / Rejected / Deferred / Active / Final |
| `Type` | Single select | Engineering / API / AI / Embodiment / Research / Security / Governance |
| `Risk` | Single select | S0–S5 |
| `Area` | Single select | Agent / Infra / Frontend / Backend / Embodiment / Research / Security |
| `Champion` | User/Text | 推進者 |
| `Decision Owner` | User/Text | 裁定者 |
| `Required Reviewers` | Text | 必須レビューロール |
| `FCP Start` | Date | 最終評議開始 |
| `FCP End` | Date | 最終評議終了 |
| `Implementation Issue` | URL | 通過後の実装追跡 |
| `ADR` | URL | アーキテクチャ決定形成時 |
| `Next Review` | Date | 次回レビュー日 |
| `Blocking Issues` | Text | ブロッキング問題 |

---

## 18. 通過と拒否基準

### 18.1 通過基準

RFC は以下をすべて満たす場合にのみ受理できます：

1. 問題が実在し、解決に値する；
2. 提案範囲が明確；
3. 目標と非目標が明示；
4. 案が十分具体で実装を導ける；
5. 主要代替案が比較済み；
6. 既知リスクが記録され緩和策あり；
7. 互換、移行、ロールバック戦略が明確；
8. 必要なセキュリティ、プライバシー、AI、具身、運用レビュー完了；
9. 必要 Reviewer がレビュー済み；
10. 実質的異議が処理、説明、または記録済み；
11. 明確な Owner / DRI あり；
12. 受理後の次ステップが実行可能。

### 18.2 拒否または延期基準

1. 問題が成立せず、または証拠不足；
2. 案が広すぎ、実行不能、または検証不能；
3. 原則、セキュリティ倫理、コンプライアンス境界に明らかに違反；
4. Owner / DRI なし；
5. 移行または保守コストが明らかに利益を上回る；
6. 代替案が明らかに単純または低リスク；
7. 実質的異議が未処理；
8. 先に実験、評価、プロトタイプ検証が必要。

---

## 19. RFC テンプレート

テンプレートファイルは `05-Knowledge/rfc/0000-template.md`（または `templates/rfc-template.md`）。完全構造：

```markdown
---
rfc: RFC-0000
title:
status: Draft
type: Engineering | API-Protocol | AI-System | Embodiment | Research | Security-Ethics | Governance | Informational
authors:
champion:
sponsor:
decision_owner:
area:
risk_level: S0 | S1 | S2 | S3 | S4 | S5
created:
updated:
fcp_start:
fcp_end:
decision_date:
related_issues:
related_prs:
related_adrs:
supersedes:
superseded_by:
---

# RFC-0000: Title

## 1. Summary
## 2. Motivation
## 3. Goals
## 4. Non-goals
## 5. Background
## 6. Proposal
## 7. Detailed Design
## 8. Alternatives Considered
## 9. Compatibility and Migration
## 10. Security, Privacy and IP Impact
## 11. AI / Agent Impact
## 12. Embodiment Impact
## 13. Observability and Operations
## 14. Test and Evaluation Plan
## 15. Rollout and Rollback Plan
## 16. Documentation and Education
## 17. Implementation Plan
## 18. Drawbacks and Risks
## 19. Unresolved Questions
## 20. Rejected Ideas
## 21. Decision (FCP 後に記入)
```

テンプレートは動機、仕様、理由、互換、セキュリティ、参照実装、却下した案の要件に加え、テスト、卒業基準、昇格/降格、バージョン偏差、本番準備の要件を統合しています。輝夜計画向けに AI / Agent、長期記憶、資産出所、具身安全影響を追加しています。

---

## 20. アンチパターン

以下は RFC アンチパターンです：

1. 小問題を RFC で Issue に代替；
2. 実行可能な案なしに抽象ビジョンを RFC に積み上げる；
3. PR で重大アーキテクチャを争い RFC を迂回；
4. Owner / Champion のない RFC；
5. 代替案を書かない RFC；
6. 利益のみで代償を書かない RFC；
7. RFC 通過後 implementation issue なし；
8. RFC Accepted を実装自動マージ許可と見なす；
9. 飞书 投票または私聊で RFC を決定；
10. 沈黙を合意と見なす；
11. 少数異議未処理で通過宣言；
12. RFC が長期 Draft で誰も推進しない；
13. セキュリティ、プライバシー、具身リスクを実装段階まで先送り；
14. 重大修正で Review / FCP を再開しない；
15. Rejected RFC に理由なしで同一争点が反復。

---

## 21. コアルールと改訂

最も重要な 5 条のコアルール：

1. 重大変更は RFC 先、実装後。
2. RFC には Champion、Owner、Decision Owner が必須。
3. 合意は投票ではない；実質的異議は処理・記録必須。
4. Accepted は方向通過のみ——実装自動マージではない。
5. RFC の結果は ADR、Implementation Issue、Project、Release に接続必須。

本文は Governance RFC による改訂のみ可能です（本文が定義するプロセスが自身に適用されることの体現）。`../../01-Foundation/ja/01-Principles.md` の「衝突と改訂」と一致：本文が組織権限またはセキュリティルールと衝突する場合、対応する専門ドキュメントが優先します。法務、セキュリティ倫理の最低限の基準と衝突する場合、その基準が優先します。旧版はバージョン管理に保存され、いつでも参照できます。

このメカニズムは Rust の軽量 Markdown RFC、Python の状態と歴史記録、Go の「先に短い issue、必要なら設計ドキュメント」、Kubernetes の本番準備意識、OpenTelemetry の「RFC → 規範 → 実装」連鎖、TC39 の段階成熟度と reviewer sign-off、IETF の rough consensus 理解を取り入れ——輝夜計画の長期進化に奉仕し、形式化負担を作るものではありません。
