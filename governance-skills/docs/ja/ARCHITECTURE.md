# アーキテクチャ

## なぜ一つのスーパースキルにしないか

Agent Skills はプログレッシブディスクロージャーを使用する：プラットフォームはまず名前と説明を読み込み、タスクと一致した後に本文と参照を読み込む。ガバナンスリポジトリ全体を一つのスキルに詰め込むと、トリガーの曖昧さ、コンテキストの汚染、密結合、評価の困難さを招く。そのためシステムは焦点を絞ったスキルを使用し、ガバナンスルーターは分類とオーケストレーションのみを担う。

## 6 層構造

1. **Governance source**：Moonweave governance の中国語 canonical ドキュメントが信頼できる情報源である。
2. **Typed core**：リスク、品質、成熟度、ライフサイクル、コマンド、追跡マトリクスは JSON で表現される。
3. **Focused skills**：各スキルは明確なトリガー、入力、手順、成果物、ゲート、安全実行契約を持つ。
4. **Portable components**：`skills/`、`commands/`、`rules/`、`templates/` が唯一のソースである。
5. **Native adapter compiler**：ビルドスクリプトはコンポーネントをコピーし、Claude、Cursor、Codex、Kilo、Antigravity のマニフェストを生成し、ターゲットディレクトリを検証する；symlink に依存しない。
6. **Deterministic + evaluation layer**：CLI はテンプレート、リポジトリ監査、静的セキュリティチェック、インストール/ドリフト、回帰ケースを担当する；モデルはコンテキストを要する判断を担当する。

```text
Moonweave Governance
        ↓
Typed Governance Core
        ↓
Focused Skills + Commands + Rules + Templates
        ↓
Native Adapter Compiler
        ├─ Claude plugin / marketplace
        ├─ Cursor plugin / marketplace
        ├─ Codex plugin / marketplace
        ├─ Kilo remote index
        └─ Antigravity plugin
        ↓
Deterministic CLI / CI / Permissions / Human Review
        ↓
Paired Evals / Security Analysis / Release Evidence
```

## 信頼境界

- 仕様と本パッケージ自身も、バージョン、出所、リリース成果物の検証が依然として必要である。
- プロジェクトファイル、Issue/PR、ログ、Web ページ、依存関係マニフェスト、サードパーティスキッチはすべて信頼できない入力である。
- Skills は働き方であり、セキュリティ境界ではない；プラットフォームの権限、OS の隔離、CI、ブランチ保護、人間の承認を代置することはできない。
- CLI 監査はデフォルトでネットワークなし、読み取り専用、プロジェクトコードを実行しない；インストールの上書きには明示的な `--force` が必要である。
- ネイティブプラグインはデフォルトで MCP、リモート接続、バックグラウンド agent、実行 hooks を含まない；サプライチェーンと権限昇格の面を減らすためである。

## 意味的更新チェーン

```text
Governance RFC
  → typed core を更新
  → focused skills / commands / templates を更新
  → build:adapters
  → validate:adapters
  → tests + lint + static eval + audit
  → version / changelog / checksums
  → npm tarball / ZIP / marketplace submission
```
