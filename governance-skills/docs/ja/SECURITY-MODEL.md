# Skills セキュリティモデル

## 脅威

1. **Skill prompt injection**：長い Markdown・参照ファイル・スクリプトが悪意ある指示を隠す。
2. **Repository prompt injection**：Issue・README・コードコメント・ログが Agent に秘密を漏洩させたりコマンドを実行させたりするよう誘導する。
3. **Supply-chain substitution**：同名 Skill・改ざんパッケージ・未固定の情報源または更新。
4. **Over-privileged agent**：Skill が過度に広いファイル・ネットワーク・Shell・MCP・物理権限を要求する。
5. **False evidence**：Agent がテスト・レビュー・デプロイの成功を主張するが実際には実行していない。
6. **Cross-platform semantic drift**：プラットフォーム適応後にゲートが失われたり、表現の変更が振る舞いを変えたりする。

## 統制

- 標準化された YAML frontmatter。名前とディレクトリを一致させる。
- すべての Skill に untrusted-input 安全契約を含める。
- ネットワークなし・依存なしの決定論的 CLI。audit はプロジェクトのスクリプトを実行しない。
- SHA-256 によるインストールロック。リリースは署名し SBOM/Provenance を生成すべき。
- プラットフォーム権限は最小権限に従い、書き込み/実行/ネットワーク/リリース/デプロイ/物理动作は既定で Ask にする。
- Stop-Ship は skill のプロンプト・CLI チェック・CI/Hook/権限システムが共同で執行する。LLM 単独に依存してはならない。
- トリガ/非トリガのペア化と安全対抗 eval。

## リリース前の硬化

- 2 名の独立した Reviewer がすべての SKILL.md とスクリプトをレビューする。
- npm で provenance と 2FA を有効化。GitHub release に署名する。
- skills lock は commit/tag と hash を固定する。
- マーケットプレースのリリースノートは必要な権限・ネットワーク・スクリプトを明示する。
- 依存関係（現在の CLI には実行時依存がない）と悪意あるパターンを定期的にスキャンする。
