# Moonweave Governance Skills

> **言語**: [English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[Moonweave AI Governance](https://github.com/Moonweave-AI/governance) を「人が記憶すべき長文ドキュメント」から、発見可能・呼出可能・検査可能・監査可能な Agent Skills・コマンド・テンプレート・CLI・プラットフォームアダプタへとコンパイルします。

> **バージョン: 0.1.0**
> **スペックスナップショット: 2026-07-22**
> **ステータス: Active / 公開発行前。機能とインストール成果物は検証済み、npm パッケージと各プラットフォームのマーケットプレースは Moonweave AI アカウントによる実際の公開または審査提出が必要です。**
> **Owner: Moonweave AI Governance Maintainers。Backup Owner: Moonweave AI Stewardship Council。**

## コアアーキテクチャ

```text
Moonweave Governance（権威的セマンティクス）
        ↓
Typed Governance Core（リスク/品質/ライフサイクル/トレーサビリティ行列）
        ↓
Focused Agent Skills（タスクごとの段階的開示）
        ↓
Platform Adapters（Cursor / Codex / Claude / OpenCode / Kilo / Antigravity）
        ↓
Deterministic CLI & Hooks（決定的に検査できるものはモデルに推測させない）
        ↓
Paired Evals & Security Analysis（トリガ、非トリガ、タスク結果、安全性）
```

## インストール

### ローカル tarball / npm tarball から

```bash
npm install
npm pack
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project
```

### npm 公開後

```bash
npx @moonweave-ai/governance-skills install --agents all --scope project
```

### GitHub / skills.sh から

リポジトリを `Moonweave-AI/governance`（`governance-skills/` をサブディレクトリとして含む）に push 後：

```bash
npx skills add Moonweave-AI/governance/governance-skills --all
# または単一スキルのインストール
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

`governance` リポジリの `governance-skills/skills/` ディレクトリは Agent Skills オープンフォーマットに従うため、skills.sh、Codex、Claude Code、Cursor、OpenCode、Kilo、Antigravity などが発見できます。プラットフォーム固有のルール・コマンド・ネイティブプラグインは本パッケージの CLI またはリポジトリ内の marketplace manifest でインストールします。

### プラットフォームネイティブプラグイン / マーケットプレース

- Claude Code: `.claude-plugin/marketplace.json`
- Cursor: `.cursor-plugin/marketplace.json`
- Codex / ChatGPT: `.agents/plugins/marketplace.json`
- Antigravity: ルート `plugin.json`
- Kilo: `skills/index.json` リモートインデックス

各 manifest とプラグインディレクトリは `npm run build:adapters` で同一の `skills/`・`commands/`・`rules/` ソースから生成され、`npm run validate:adapters` で検査されます。完全なインストール方法は [`docs/INSTALLATION.md`](docs/INSTALLATION.md) を参照。

### Git clone

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance
node governance-skills/bin/moonweave-skills.mjs install --agents all --root /path/to/project
```

## よく使うコマンド

```bash
moonweave-skills list
moonweave-skills route --text "Agent に本番データベースへの書き込みを許可する"
moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity
moonweave-skills doctor --root .
moonweave-skills new rfc --title "長期記憶状態プロトコルの統一"
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills lint-skills
moonweave-skills checksums
```

完全なコマンドリファレンスは [`docs/COMMANDS.md`](docs/COMMANDS.md) を参照。

## 23 のスキル

| カテゴリ | スキル |
|---|---|
| ルーティングと起動 | `moonweave-governance-router`, `moonweave-project-bootstrap` |
| 計画と意思決定 | `moonweave-idea-triage`, `moonweave-project-planning`, `moonweave-rfc`, `moonweave-adr` |
| エンジニアリングコラボレーション | `moonweave-issue`, `moonweave-engineering-brief`, `moonweave-implementation`, `moonweave-pull-request`, `moonweave-code-review` |
| セキュリティと品質 | `moonweave-security-review`, `moonweave-quality-assurance`, `moonweave-release-readiness`, `moonweave-repository-audit` |
| 知識と研究 | `moonweave-documentation`, `moonweave-research` |
| 運用と組織 | `moonweave-incident-response`, `moonweave-handoff`, `moonweave-community-contribution` |
| 改善とガバナンス | `moonweave-gap-analysis`, `moonweave-retrospective`, `moonweave-governance-change` |

## セキュリティ上の注意

Skills はセキュリティ境界ではありません。決定的な制限は権限システム・Hook・CI・ブランチ保護・Secret スキャン・テスト・人間の Review で実行します。本パッケージはデフォルトで自動マージ・公開・デプロイ・データ削除・Agent/具身権限の付与を行いません。

[`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md) と [`SECURITY.md`](SECURITY.md) を参照。

## 設計と互換性

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md)
- [`docs/GOVERNANCE-TRACEABILITY.md`](docs/GOVERNANCE-TRACEABILITY.md)
- [`docs/EVALUATION.md`](docs/EVALUATION.md)
- [`docs/REFERENCES.md`](docs/REFERENCES.md)
- [`docs/PUBLISHING.md`](docs/PUBLISHING.md)

## License

MIT
