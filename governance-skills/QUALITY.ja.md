# Quality Declaration

| Field | Value |
|---|---|
| Component | Moonweave Governance Skills |
| Status | Active / pre-publication |
| Quality level | QA-L2（維持ライブラリとポータブル skill コレクション） |
| Primary owner | Moonweave AI Governance Maintainers |
| Backup owner | Moonweave AI Stewardship Council |
| Version policy | 公開発行後にセマンティックバージョニングを採用 |
| Runtime | 決定的 CLI は Node.js 20+ 必須。skills 自体は Markdown |

## Scope

本宣言は `skills/`・`commands/`・`core/`・`templates/`・CLI・インストーラ・静的監査器・プラットフォームアダプタ・marketplace manifest を対象とする。

## Change control

- すべての変更は Pull Request 経由。
- スキルのセマンティック変更は Moonweave Governance canonical 文書にトレーサブルでなければならない。
- プラットフォームパス・manifest・marketplace 形式の変更はアダプタテストを更新すること。
- セキュリティ境界・Stop-Ship・権限セマンティクスは通常の保守上の都合で弱めてはならない。

## Verification

- Node.js のユニットテストとインテグレーションテスト。
- すべての `SKILL.md` frontmatter・危険パターン・ガバナンストレーサビリティの静的検査。
- ルーティングとトリガの回帰ケース（中国語と英語のサンプル）。
- ネイティブ marketplace / plugin manifest の構造検証。
- npm pack・tarball インストール・マルチプラットフォームプロジェクトインストールのスモークテスト。
- リポジトリ自身のガバナンス監査と Secret / CI リスクスキャン。

## Security and supply chain

- CLI 監査はデフォルトで読み取り専用であり、監査対象リポジトリのコードを実行しない。
- デフォルトのインストールモードはコピー方式。一時的な npx パス無効化とクロスプラットフォームの symlink 差異を避けるため。
- アンインストールは lock ファイルに基づき、ユーザー変更ファイルを保持する。
- リリース成果物は SHA-256 チェックサムを生成する。正式リリースには SBOM / provenance / 署名を添付すべき。

## Known limitations

- npm・Claude・Cursor・Codex・Kilo その他の marketplace エントリはまだ Moonweave AI アカウントによる実際の公開や審査が行われていない。
- モデルによりスキルの自動トリガ信頼性が異なる。明示コマンド・決定的検査・人間の Review は必要な制御であり続ける。
- プラットフォームの marketplace 形式は進化する可能性がある。各リリース前に manifest 検証を再実行し公式文書を確認すること。

## Review cadence

各リリース前、およびサポート対象プラットフォームが skill・コマンド・ルール・プラグイン形式を変更した際にレビューする。
