# CLI コマンド

## `list`
スキル、コマンド、テンプレート、プラットフォームを一覧表示する。

## `install`

```bash
moonweave-skills install --root . --agents all --scope project --mode copy
```

パラメータ：`--agents`、`--scope project|global`、`--mode copy|symlink`、`--force`、`--with-github`。

## `doctor`
Node バージョン、パッケージの完全性、プラットフォームターゲットディレクトリ、skills lock、プロジェクトガバナンス設定を確認する。

## `route`

```bash
moonweave-skills route --text "本番データベースに書き込める新しい Agent ツール"
```
推奨されるリスク、品質、成熟度、必須スキル、成果物を出力する。これはヒューリスティックな推奨であり、Owner/セキュリティ Review を代置するものではない。

## `new`

```bash
moonweave-skills new rfc --title "統一長期記憶プロトコル" --out 05-Knowledge/rfc/0000-memory.md
```
対応：idea、discovery、prototype、brief、rfc、adr、issue、pr、test-plan、quality、release、research、paper-review、dataset-card、model-card、agent-card、runbook、incident、postmortem、handoff、asset、threat-model、hazard-analysis、exception。

## `audit`

```bash
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills audit --root . --profile embodied --format sarif --out audit.sarif
```
Profiles：docs、library、service、ai-agent、embodied、auto。

## `lint-skills`
Agent Skills の frontmatter、名前、説明の長さ、安全実行契約、危険な指示、リソースファイルのサイズを確認する。

## `lint-docs`
文書メタデータ、canonical 対象、意思決定 ID と範囲、ローカル関係の対象、グラフの連結性、双方向の `related`、相互の `supersedes`/`superseded_by` ライフサイクルリンクを検証する。孤立した記録、分断された部分グラフ、同じ `decision_scope` を所有する重複した現行 RFC または ADR、既存の同範囲 RFC へリンクしない ADR を拒否する。置換された記録は後継を示し、`Superseded` ステータスを使う必要がある。

## `docs-index`

```bash
moonweave-skills docs-index --root . --format json
moonweave-skills docs-index --root . --out docs/DOCUMENT-INDEX.md
moonweave-skills docs-index --root . --out docs/DOCUMENT-INDEX.md --check
```

権威文書の frontmatter と `core/governance-map.json` から、LLM が読める JSON グラフまたはクリック可能な Markdown 一覧を生成する。Frontmatter が事実源であり、Markdown は生成ビューにすぎない。コミット済みビューが古い場合は `--check` が失敗する。

## `eval-static`
リスクルーティング、全 23 スキルの正/負トリガーケース、静的セキュリティ回帰を実行する。

## `checksums`
現在のスキルパッケージファイルの `checksums.sha256` を生成する。

## `uninstall`
lock に記録されたツールがインストールしたファイルのみを削除する；帰属が確認できないファイルは削除しない。
