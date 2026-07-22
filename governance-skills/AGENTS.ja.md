# Moonweave Governance Skills Repository

本リポジトリは Moonweave Governance をクロスプラットフォームの Agent Skills・コマンド・テンプレート・決定的 CLI・ネイティブプラグインアダプタへとコンパイルします。

## Working rules

- スキルを変更する前に `core/governance-map.json` と上流の canonical ガバナンス仕様を照合する。
- `skills/` がベンダー中立のセマンティックソース。`plugins/`・`.claude-plugin/`・`.cursor-plugin/`・`.agents/plugins/` は `npm run build:adapters` で生成されたアダプタ出力。
- 生成されたネイティブプラグインのコピーを直接手編集しない。ソースのスキル・コマンド・ルールを変更し再ビルドする。
- コミット前に `npm run verify` を実行する。
- Stop-Ship・人間の確認・最小権限・出所追跡・証拠の誠実性の要件を弱めない。
- 本物のシークレット・個人データ・未認可資産をコミットしない。
