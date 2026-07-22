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

## `eval-static`
リスクルーティング、全 23 スキルの正/負トリガーケース、静的セキュリティ回帰を実行する。

## `checksums`
現在のスキルパッケージファイルの `checksums.sha256` を生成する。

## `uninstall`
lock に記録されたツールがインストールしたファイルのみを削除する；帰属が確認できないファイルは削除しない。
