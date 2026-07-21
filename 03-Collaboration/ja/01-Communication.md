# コミュニケーション規範

> 本文は、プロジェクトの組織コミュニケーションシステム設計を示します。「どの事柄をどのプラットフォームで話すか、どの情報を必ず記録に残すか、どのコミュニケーションは一時的でよいか、どの結論を GitHub / Notion / RFC / ADR に戻す必要があるか、会議で記録と追跡をどう作成するか、Agent の自動プッシュで何ができて何ができないか、引き継ぎ・欠席・事故・エスカレーションをどう扱うか」を扱います。

一つの中核的判断：

> **チャットツールは迅速なコミュニケーションを担い、GitHub はエンジニアリングの事実を担い、Notion / ナレッジベースは組織の記憶を担い、カレンダーはリズムを担い、Agent はリマインダーとルーティングを担う——ただし、いずれも事実源（ソース・オブ・トゥルース）にはならない。**

---

## 1. 目的と適用範囲

本文は、輝夜計画における日常協業、エンジニアリング開発、研究推進、コミュニティ参加、会議、インシデント対応、ナレッジの蓄積、自動通知におけるコミュニケーション方式を定義します。

本文は以下に適用されます：

- GitHub Issues / Pull Requests / Discussions / Projects；
- 飞书（Feishu / Lark）のグループチャット、DM、カレンダー、会議、ドキュメント、ボット；
- Notion または同等のナレッジベース；
- 微信群と Discord コミュニティ（対外交流）；
- RFC / ADR / Research Logs；
- 自動通知、Agent プッシュ、運用アラート；
- 公開コミュニティスペースと内部協業スペース。

本文は `01-Organization.md` のロール権限定義、`03-RFC-Process.md` の正式意思決定プロセス、`02-Security-Ethics.md` のセキュリティ開示とインシデント処理ルールに代わるものではありません。

---

## 2. コミュニケーション原則

1. **非同期優先、同期は補完** — デフォルトは追跡可能な非同期コミュニケーションを優先します。会議、音声、インスタントチャットは、迅速な確認、対立の収束、インシデント対応、高帯域の議論にのみ用います。
2. **重要な結論には権威あるリンクが必須** — プロジェクト方向、公開インターフェース、リリース、セキュリティ境界、ロードマップ、Owner、権限、コミュニティメンバーの権益に影響する結論は、必ず GitHub Issue、PR、RFC、ADR、Notion の権威ページ、または会議記録に戻す必要があります。チャット内の結論だけでは組織の事実を構成しません。
3. **単一の事実源** — 各テーマには権威ある事実源は一つだけです。チャット、議事録、タスクボード、自動プッシュは事実源を参照できますが、互いに矛盾する並行の事実を作ってはなりません。

   | 情報種別 | 権威ある事実源 |
   | -------- | -------------- |
   | コード変更 | GitHub PR |
   | Bug / Feature / Task | GitHub Issue |
   | リポジトリ横断の計画 | GitHub Project / Planning ドキュメント |
   | 重大な技術提案 | RFC |
   | 受理済みアーキテクチャ決定 | ADR |
   | 長期の組織ナレッジ | Notion / Wiki verified page |
   | 会議の結論 | 議事録 + 関連 Issue/RFC/ADR |
   | セキュリティインシデント | セキュリティインシデント記録（通常の公開 Issue ではない） |
   | リリースの事実 | Release notes / Changelog |

4. **公開優先、プライベートは境界を持つ** — デフォルトは公開またはチーム可視のスペースでコミュニケーションします。セキュリティ脆弱性、プライバシー、法務、行動規範、未公開の提携、認証情報、個人事情、高リスクな具身インシデントに関わる場合のみ、制限付きスペースに入ります。
5. **チャットはタスクシステムではない** — 飞书 / 微信 / Discord のチャットはリマインドと調整に使えますが、タスク、決定、リスク、技術的負債、成果物の唯一の記録としてはなりません。タスクが生まれた → GitHub Issue / Notion Task / RFC action item に変換；技術的結論が生まれた → Issue comment / PR comment / RFC update / ADR に変換。
6. **自動化は人に奉仕し、逆に支配しない** — Agent とボットは忘却の防止、情報のルーティング、リスクの可視化、要約の生成に使います。低品質で高頻度、設定不可のプッシュでノイズを作ってはなりません。
7. **コミュニケーションは引き継ぎを支援しなければならない** — 長期タスク、Owner 責任、インシデント対応、リポジトリ横断の推進事項は、担当者が不在でも引き継げなければなりません。前進し、すべてを記録し、所有権を次の人に移し、他の作業を続けます。

---

## 3. プラットフォーム分担

各プラットフォームの役割を明確にしないと、後期に GitHub、Notion、飞书群、会議の口頭説明がそれぞれ別バージョンになり、どれが参照すべきか分からなくなります。

| プラットフォーム | 役割 | 担わないもの |
| ---------------- | ---- | ------------ |
| **GitHub** | エンジニアリングの事実源：Issue、PR、Discussion、Project、RFC、ADR、Release | 雑談、内部の機密事項 |
| **飞书** | 内部リアルタイムコミュニケーション、会議、カレンダー、リマインダー、ボット通知、インシデント連携 | 長期の事実源、アーキテクチャの最終記録 |
| **Notion / Wiki** | 内部組織ナレッジ、プロジェクト索引、Owner Registry、会議アーカイブ、Onboarding、Runbook | Code Review、正式なエンジニアリング変更 |
| **Guidelines Repo** | 公開原則、ガバナンス、協業、エンジニアリング標準、RFC/ADR アーカイブ | 一時的なタスク管理 |
| **微信群** | 中文コミュニティの対外交流、興味討論、新人案内 | エンジニアリングの事実、決定、セキュリティ開示 |
| **Discord** | 国際コミュニティの対外交流、興味討論、音声/動画コミュニティ活動 | エンジニアリングの事実、決定、セキュリティ開示 |
| **Calendar** | 会議リズム、公開コミュニティ会議、レビューウィンドウ、リリースウィンドウ | 決定テキストそのもの |
| **Agent / Bot Layer** | イベントルーティング、要約、リマインダー、状態チェック | 事実の裁定、権限の代替、人間の責任の代替 |

事実源ルール：

> GitHub はエンジニアリング活動の事実源です。Notion は内部組織ナレッジの事実源です。Guidelines Repo は組織ルールの事実源です。飞书 は内部コミュニケーションと通知チャネルであり、事実源ではありません。微信と Discord はコミュニティ交流の入口であり、事実源ではありません。Agent はルーターであり、裁定者ではありません。

微信と Discord は輝夜計画に興味を持つ外部参加者向けで、興味討論、Q&A、新人案内、コミュニティ活動を担います。そこで得られた価値ある技術的結論は、参加者または Maintainer により GitHub Issue / Discussion / RFC に書き戻す必要があります。書き戻されないものはプロジェクトの事実を構成しません。

---

## 4. 情報分級とコミュニケーションチャネル

| シナリオ | デフォルトプラットフォーム | 必ず記録する場所 |
| -------- | -------------------------- | ---------------- |
| Bug | GitHub Issue | Issue |
| Feature | GitHub Issue / Discussion | Issue / RFC |
| Code review | GitHub PR | PR |
| アーキテクチャ争点 | GitHub Issue → RFC | RFC / ADR |
| リリース準備 | GitHub Project + 飞书リマインダー | Release checklist |
| 研究討論 | GitHub Discussion / Notion | Research log |
| 実験結果 | Notion / repo research log | Research log |
| 日常調整 | 飞书 | 必要に応じ Issue |
| 決定会議 | 飞书会議 | Meeting notes + Issue/RFC/ADR |
| インシデント対応 | 飞书 incident channel | Incident report / Postmortem |
| セキュリティ脆弱性 | 非公開セキュリティチャネル | Security advisory / private issue |
| 組織公告 | 飞书公告 + GitHub/Notion | Announcement record |
| コミュニティ Q&A | GitHub Discussions / 微信 / Discord | Discussion |
| Roadmap | GitHub Project / Notion | Project / Planning doc |
| Owner 変更 | Notion Owner Registry + PR | Organization record |

---

## 5. GitHub コミュニケーション規範

### 5.1 Issues

使用場面：Bug 報告；Feature request；タスク追跡；研究再現問題；ドキュメント欠落；技術的負債；リポジトリ横断依存；セキュリティ以外の公開可能な問題。

Issue には以下を含める必要があります：Background / Context；Expected outcome；Scope；Owner / DRI；Status；Related PR / RFC / ADR；Risk level；Deadline or review date (if applicable)。

### 5.2 Pull Requests

PR は実装の議論空間であり、大規模な方向性の争いの場ではありません。

議論してよい内容：実装の正しさ；テスト；保守性；インターフェース互換；ドキュメント更新；セキュリティリスク；既存 RFC / ADR への適合。

展開すべきでない内容：システム全体の書き直しの是非；長期技術路線の変更；公共プロトコルの変更；新規ワーキンググループの設立；組織ルールの変更——これらは RFC、ADR、Planning に回します。

### 5.3 Discussions

適する内容：オープンな質問；ユーザーフィードバック；技術方向の事前議論；コミュニティ Q&A；初期アイデア；非コミット型の議論。

適さない内容：セキュリティ脆弱性の開示；すでに実行が必要なタスク；Owner が必要な成果物；高リスクな決定；リリースブロッキング事項。

### 5.4 GitHub Projects

リポジトリ横断計画に使用：Roadmap；Milestone；Release train；RFC pipeline；Research milestone；Security review queue；Embodied test pipeline。

推奨フィールド：

| フィールド | 説明 |
| ---------- | ---- |
| Area | Agent / Infra / Frontend / Backend / Embodiment / Research / Docs |
| Type | Bug / Feature / RFC / ADR / Experiment / Security / Release |
| Priority | P0 / P1 / P2 / P3 |
| Risk | S0–S5 |
| Owner | 現在の担当者 |
| Status | Backlog / Ready / In Progress / Review / Blocked / Done |
| Target Milestone | 所属フェーズ |
| Last Update | 最終状態更新日時 |
| Blocking | 他作業をブロックするか |

### 5.5 GitHub 通知戦略

各コアメンバーは GitHub notification を設定し、少なくとも以下をフォローします：担当リポジトリ；所属 Area；Review 依頼 PR；@mention された Issue / PR / Discussion；Release；Security alerts。

---

## 6. 飞书コミュニケーション規範

飞书 は内部リアルタイムコミュニケーション + カレンダー + 会議 + 自動通知の入口です。

### 6.1 グループ設計

固定命名ルール：

```text
mw-announcements
mw-general
mw-engineering
mw-research
mw-agent
mw-infra
mw-frontend-backend
mw-embodiment
mw-security-private
mw-incidents
mw-rfc-review
mw-releases
mw-community
mw-random
wg-<working-group-name>
area-<area-name>
project-<project-name>
```

### 6.2 グループ種別

| グループ | 用途 | 権限 |
| -------- | ---- | ---- |
| `mw-announcements` | 組織レベル公告、リリース、ガバナンス変更 | Owner / Maintainer のみ発言可 |
| `mw-general` | 日常同期、軽量な質問 | 全員 |
| `mw-engineering` | エンジニアリング協業、技術調整 | エンジニアリングメンバー |
| `mw-research` | 論文、実験、再現議論 | 研究メンバー |
| `mw-security-private` | セキュリティ脆弱性、認証情報漏洩、プライバシーインシデント | 制限付き |
| `mw-incidents` | 本番インシデント、サービス中断、具身異常 | 制限付きまたはインシデントごとに開放 |
| `mw-rfc-review` | RFC レビューリマインダーと収束 | Maintainer / Reviewer |
| `wg-*` | ワーキンググループの一時コミュニケーション | WG メンバー |
| `project-*` | 具体プロジェクトの推進 | プロジェクトメンバー |

### 6.3 飞书コミュニケーションの硬いルール

1. 飞书 で記録なしの最終技術決定をしてはなりません。
2. 通常グループで鍵、token、本番設定、ユーザープライバシー、未公開セキュリティ脆弱性を送ってはなりません。
3. 私聊（DM）で公開協業を代替してはなりません。私聊で形成した結論は必ず書き戻します。
4. 非緊急事項に @all / @here を使ってはなりません。
5. 複数グループで同一技術争点を繰り返し議論してはなりません。Issue / RFC に戻します。
6. すべてのボットは Owner、権限、対象群、トリガーイベント、無効化方法を登録する必要があります。

### 6.4 飞书メッセージ形式

**ヘルプ依頼**

```markdown
[Help Needed]
Context:
Problem:
What I tried:
Link:
Needed from:
Deadline:
```

**決定リマインダー**

```markdown
[Decision Needed]
Topic:
Options:
Recommended option:
Trade-offs:
Decision owner:
Deadline:
Canonical link:
```

**状態更新**

```markdown
[Status Update]
Project:
Owner:
Last progress:
Blockers:
Next step:
Risk:
Links:
```

**インシデントメッセージ**

```markdown
[Incident]
Severity:
Affected system:
Start time:
Current impact:
Incident DRI:
Live doc / issue:
Next update time:
```

---

## 7. Notion / Wiki 規範

Notion は GitHub のエンジニアリング事実に代わるものではなく、内部ナレッジの整理を担います。

### 7.1 推奨用途

Organization Overview；Owner Registry；Onboarding；Meeting Index；Project Brief；Internal Roadmap；Research Reading List；Runbook；Access Map；Communication Directory；Glossary；Decision Index。

### 7.2 ページメタデータ

すべての正式ページには以下が必要です：

```text
Owner:
Status: Draft / Active / Deprecated / Archived
Visibility: Public / Internal / Restricted
Sensitivity: Normal / Confidential / Security / Personal Data
Last Reviewed:
Next Review:
Related GitHub Issue / RFC / ADR:
Canonical: yes / no
```

### 7.3 Verified Page ルール

以下のページは Verified Page または同等の仕組みを使う必要があります：Owner Registry；Onboarding Guide；Release Calendar；Security Contact；Incident Runbook；Access Request Guide；Communication Directory；Project Index；Active Roadmap。verification 期限切れ後、Owner はリマインダーを受け取り、再レビューする必要があります。

### 7.4 Notion と GitHub の境界

Notion は背景の説明、リソースの索引、ナレッジの整理を担います。GitHub はエンジニアリング事実、コード変更、Review、RFC、ADR、Release を保持します。Notion ページにエンジニアリング決定が含まれる場合、RFC / ADR へリンクすべきです。RFC / ADR が背景ナレッジを必要とする場合、Notion ページへ逆リンクできます。

---

## 8. カレンダー、会議、議事録

### 8.1 カレンダーシステム

内部カレンダーは飞书カレンダーを使用します。公開コミュニティ会議は Google Calendar / iCalendar 購読に同期し、外部参加者の参加を容易にできます。

### 8.2 カレンダー命名

```text
Moonweave - Governance
Moonweave - Engineering
Moonweave - Research
Moonweave - RFC Review
Moonweave - Release
Moonweave - Community
Moonweave - Security / Incident
```

### 8.3 会議作成ルール

> アジェンダがなければ会議を開きません。DRI がなければ会議を開きません。期待されるアウトプットがなければ会議を開きません。非同期で解決できる問題は、デフォルトで会議を作成しません。

### 8.4 会議招待に必須の項目

```text
Title:
Purpose:
Expected output:
DRI:
Required participants:
Optional participants:
Agenda doc:
Pre-read:
Related Issue / RFC / ADR:
Decision needed: yes / no
Recording / minutes policy:
```

### 8.5 会議種別

| 種別 | 頻度 | 目的 | 成果物 |
| ---- | ---- | ---- | ------ |
| Governance Sync | 月次 | ガバナンス状態、Owner ギャップ、リスク | Summary + Action items |
| Engineering Sync | 週次または隔週 | リポジトリ横断ブロッカーとエンジニアリングリズム | Issue updates |
| RFC Review | 随時または固定ウィンドウ | 重大提案の収束 | RFC comments / decision |
| Research Review | 隔週 | 実験、論文、再現 | Research log |
| Release Review | 各 release 前 | リリースリスクと準備度 | Release checklist |
| Incident Review | インシデント後 | 振り返り | Postmortem |
| Community Meeting | 月次 | 公開コミュニティ同期 | Public notes / recording |

### 8.6 議事録形式

```markdown
# Meeting Notes

Date:
Meeting:
DRI:
Participants:
Related links:

## Agenda

## Decisions
| Decision | Owner | Link |
|---|---|---|

## Action Items
| Action | Owner | Due | Tracking Issue |
|---|---|---|---|

## Risks / Blockers

## Open Questions

## Follow-up
```

---

## 9. 対外コミュニティ交流：微信群と Discord

輝夜計画は微信群と Discord コミュニティを設置し、プロジェクトに興味を持つ人が参加・議論・交流できるようにします。

### 9.1 位置づけ

微信群は中文コミュニティ向け、Discord は国際コミュニティと音声/動画活動向けです。両者とも**対外コミュニティ交流の入口**であり、内部協業の主チャネルでも、エンジニアリングの事実源でもありません。

### 9.2 推奨用途

- プロジェクトの興味討論と啓蒙；
- 新人 Q&A と案内；
- コミュニティイベント公告と申込；
- 研究・設計方向のオープン討論；
- Demo、共有会、コミュニティ会議の予告と再生；
- コントリビューターと潜在コントリビューター間の非公式交流。

### 9.3 チャネル/グループ構造

**Discord**（推奨チャネル）：

```text
#announcements      公式公告（管理者のみ発言）
#general            一般討論
#introductions      新人自己紹介
#questions          Q&A とヘルプ
#agent              Agent 関連討論
#infra              AI Infra 討論
#embodiment         具身知能討論
#research           論文、実験、再現
#rfc-discussion     RFC 公開討論とフィードバック
#community-events   コミュニティイベント、Meetup
#showcase           作品と Demo 展示
#off-topic          雑談
```

**微信群**（推奨グループ）：

- 輝夜計画·公告
- 輝夜計画·総合討論
- 輝夜計画·新人入群 / Q&A
- 輝夜計画·Agent / Infra / 具身（興味別に分群、規模拡大後に分割）
- 輝夜計画·RFC 公開討論
- 輝夜計画·コミュニティイベント

### 9.4 境界と硬いルール

1. 微信と Discord の技術的結論はプロジェクトの事実を構成しません——価値ある議論は参加者または Maintainer により GitHub Discussion / Issue / RFC に書き戻す必要があり、書き戻されないものはカウントされません。
2. 公開群で鍵、token、本番設定、ユーザープライバシー、未公開セキュリティ脆弱性、未許可素材を送ってはなりません。セキュリティ脆弱性は `02-Security-Ethics.md` §11 の非公開開示チャネルに従い、コミュニティ群では議論しません。
3. コミュニティ群の行動規範は `02-Community.md` §9 が適用されます。ハラスメント、侮辱、差別、なりすまし、プライバシー漏洩、悪意のあるスパム、未許可の宣伝も禁止されます。
4. コミュニティ群には明確な Moderator と Owner が必要です（§13 参照）。公開群に Owner 不在はあってはなりません。
5. 群内ボットは Owner、権限、トリガーイベント、無効化方法を登録する必要があります。未登録ボットは正式コミュニティ群に入れてはなりません。
6. コミュニティ群は発表チャネルではありません——ロードマップ、セキュリティ声明、提携関係、法的約束、公告は、許可された者が公式身份でのみ発表できます（`02-Community.md` §14 参照）。

### 9.5 内部チャネルとの接続

コミュニティ群で生まれた貢献意向、Bug 手がかり、研究アイデアは、対応 Area の Maintainer またはコミュニティ Moderator により GitHub Issue / Discussion にルーティングされます。逆に、公開 RFC、コミュニティ会議、Release は `#announcements` と公告群経由でコミュニティに同期されます。コミュニティ群はファネルの入口であり、ファネルそのものではありません。

---

## 10. 自動通知と Agent プッシュ

> Agent はコミュニケーションルーターであり、責任者ではありません。Agent はリマインド、要約、チェック、草案作成ができますが、DRI、Maintainer、Owner の組織決定を代替できません。

### 10.1 推奨 Agent アーキテクチャ

```text
GitHub Events
Notion Events
Feishu Calendar
CI/CD
Security Alerts
Monitoring
        ↓
Moonweave Communication Hub
        ↓
Feishu Bot Cards
GitHub Comments
Notion Updates
Calendar Reminders
Weekly Digest
（Discord / 微信公告チャネル——公開情報のみ）
```

### 10.2 推奨 Agent ロール

**Kaguya Relay** — GitHub / CI / Release / Security イベントのルーティング。

| イベント | プッシュ方式 |
| -------- | ------------ |
| P0 / P1 incident | 即時飞书メッセージ + incident channel |
| Security alert | セキュリティ群への非公開プッシュ |
| PR review requested | 対応 Area 群または Reviewer DM |
| CI failure on main | エンジニアリング群 |
| RFC review window opened | RFC 群 + Discord #rfc-discussion |
| Release published | announcements + Discord/微信公告チャネル |
| 通常 Issue 更新 | 日次または週次ダイジェスト |

**Kaguya Scribe** — 会議記録と決定抽出。会議に agenda があるかチェック；会前にアジェンダ補完をリマインド；会後に minutes 草案を生成；decisions / action items を抽出；人間 DRI の確認後に Notion / GitHub へ書き込み；Issue / RFC / ADR を自動関連付け。

**Kaguya Steward** — ガバナンスと引き継ぎリマインダー。週次 Owner ギャップレポートを生成；期限切れ間近の Notion verified pages をリマインド；無応答 Issue / PR をリマインド；期限切れ RFC をリマインド；長期未更新 Roadmap item をリマインド；Maintainer weekly digest を生成；Working Group が時間境界を超えていないかチェック。

**Kaguya Sentinel** — セキュリティとインシデントコミュニケーション。security label / secret leak / incident label を検出；incident live doc を自動作成；incident channel を立ち上げ；Incident DRI をリマインド；タイムラインを記録；次回状態更新の定時リマインド；インシデント終了後に postmortem 草案を生成。

### 10.3 Agent 権限ルール

すべての Agent は以下を登録する必要があります：Name；Owner；Purpose；Data access scope；Write permissions；Target channels；Trigger events；Rate limit；Disable method；Audit log location。

禁止：未登録ボットの正式群への参加；Bot による @all / @everyone / @here の自動実行；セキュリティ群以外の機密内容を読み取り通常群へ拡散；Bot による PR 自動マージ；Bot による RFC 自動承認；Bot による release 自動公開；人間確認なしでの Owner Registry または Security policy の変更。

---

## 11. 引き継ぎ、欠席、コンテキスト移転

長期プロジェクトは「誰かが知っている」状態に耐えられません——この節は具体的でなければなりません。

### 11.1 引き継ぎが必須な場合

以下の場合は Handoff Note を作成する必要があります：DRI がタスクから 2 営業日以上離れる；Owner が一時的に重要システムに応答できない；Release DRI 変更；Incident DRI 変更；Working Group 責任者変更；Maintainer が Inactive / Emeritus に；プロジェクト一時停止またはアーカイブ；リポジトリ横断タスクが他 Area へ移管。

### 11.2 Handoff Note テンプレート

```markdown
# Handoff Note

Task / System:
Current DRI:
Next DRI:
Date:
Status:
Canonical links:

## Current State

## Completed Work

## Pending Decisions

## Open Risks

## Blockers

## Next Actions
| Action | Owner | Due | Link |
|---|---|---|---|

## Access / Permission Notes
Do not include secrets. Link to access request process only.

## Context Needed

## Suggested First Step
```

### 11.3 引き継ぎルール

1. 引き継ぎは Issue / Project / RFC / ADR にリンクする必要があります。
2. 私聊のみで唯一の引き継ぎを完了してはなりません。
3. 引き継ぎドキュメントに鍵、token、本番認証情報を書いてはなりません。
4. 高リスクシステムには Backup Owner が必要です。
5. 引き継ぎ完了後、Owner Registry と Project 状態を更新する必要があります。

---

## 12. エスカレーションパスとインシデントコミュニケーション

### 12.1 通常問題のエスカレーション

```text
Issue / PR comment
  ↓
Owner / Reviewer mention
  ↓
Area channel
  ↓
Maintainer
  ↓
RFC / Planning meeting
  ↓
Maintainer Council
```

### 12.2 セキュリティとインシデントのエスカレーション

```text
Detection
  ↓
mw-security-private / mw-incidents
  ↓
Incident DRI assigned
  ↓
Live timeline created
  ↓
Status updates at fixed interval
  ↓
Mitigation / rollback
  ↓
Postmortem
  ↓
Action items tracked in GitHub
```

### 12.3 インシデントコミュニケーションルール

インシデント期間中、すべての状態更新には以下を含める必要があります：現在の影響；確認済み事実；未確認情報；実施中のアクション；次回更新時刻；DRI。

禁止：確認前の根本原因の公開推測；複数群への矛盾する状態の並行公開；Incident DRI を迂回した対外修復時間の約束；セキュリティ詳細の通常チャネルまたはコミュニティ群への拡散。

---

## 13. セキュリティ、プライバシー、アクセス境界

以下は通常の飞书群、公開 GitHub Issue、公開 Discussion、非制限 Notion ページ、**および微信/Discord コミュニティ群**に出してはなりません：

- アクセス鍵、token、秘密鍵、本番設定；
- 未公開セキュリティ脆弱性；
- ユーザー個人データ；
- 長期記憶データ；
- 具身端末リスクの詳細；
- 未許可素材または出所不明データ；
- 行動規範通報の詳細；
- 法務、ビジネス提携、未公開リリース事項。

飞书ボット、Notion/GitHub 統合、Discord bot、微信ボットは最小権限とし、Owner、権限境界、監査を登録する必要があります。

---

## 14. コミュニケーションシステムの保守メカニズム

> コミュニケーションシステム自体にも Owner が必要です。

| 対象 | Owner |
| ---- | ----- |
| 飞书スペース | Community / Operations Owner |
| GitHub organization settings | Maintainer Council / Infra Owner |
| Notion workspace | Knowledge Owner |
| Calendar | Operations Owner |
| Discord server | Community Owner |
| 微信群 | Community Owner |
| Bot / Agent | Infra Owner + Security Reviewer |
| Announcement channel | Stewardship Council |
| Security channel | Security Owner |
| Incident channel | Incident Commander / Security Owner |

四半期レビュー：

- 飞书 / 微信 / Discord 群が過剰でないか；
- Owner 不在の群が存在しないか；
- 長期未更新 Notion ページが存在しないか；
- 重複する事実源が存在しないか；
- 過度に noisy なボットが存在しないか；
- 無応答 Issue / PR が存在しないか；
- 重要 Owner の単一障害点が存在しないか；
- 期限切れ会議と成果のない定例会が存在しないか。

---

## 15. 改訂とコアルール

本文は公開 RFC による改訂のみ可能です。旧版はバージョン管理に保存され、いつでも参照できます。`01-Principles.md` の「衝突と改訂」と一致：本文が組織権限、RFC プロセス、セキュリティルールと衝突する場合、対応する専門ドキュメントが優先します。法務、セキュリティ倫理の最低限の基準と衝突する場合、その基準が優先します。

最も重要なコアルールは以下の 3 条です：

1. 重要な結論には権威あるリンクが必須。
2. チャットは唯一の事実源になれない——飞书、微信、Discord はすべてチャネルであり、事実源ではない。
3. Agent はコミュニケーションを支援するのみ——Owner / DRI / Maintainer の責任を代替できない。
