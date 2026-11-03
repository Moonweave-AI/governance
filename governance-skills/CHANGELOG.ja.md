# Changelog

## 0.2.5 — 2026-11-02

### Changed

- 文書グラフは、予算付きアトラス、一ホップの近傍、リリース変更チェーンとして読む。
- 新しいホットな canonical 記録は既存記録を置換するか新権威を宣言し、進捗日記は拒否される。
- 各スキルは引き渡し契約を持つ。構築または修正は動作する変更で終える。

## 0.2.4 — 2026-08-06

- ガバナンス文書の統一メタデータ要件（状態、Owner、日付、レビュー周期、正本、置換関係）を追加。
- live paired evaluation prompt を研究資産タイプとして登録し、メタデータガイダンスを整備。
- v0.2.4 タグと package バージョン不一致による npm 公開失敗を修正。アダプタとチェックサムを再生成。

## 0.2.3 — 2026-07-22

- 本番デプロイと自律書き込みのリスクルーティングを修正し、Skill のバージョンメタデータを同期。
- ガバナンス文書の統一 frontmatter とメタデータ検証を追加し、状態、Owner、時刻、レビュー周期、正本、置換関係を明示。

## 0.2.2 — 2026-07-22

- Pull Request Skill の未引用コロンを修正し、静的チェックを追加。

## 0.2.1 — 2026-07-22

- provenance を伴うリリースを公開し、リリースマニフェストを同期。

## 0.2.0 — 2026-07-22

- `moonweave-help` と `moonweave-flow` を追加し、25 Skills に拡張。

## 0.1.0 — 2026-07-22

- 初回の完全リリース。
- 23 の Focused Agent Skills と 23 の薄いコマンドラッパー。
- Cursor、Codex、Claude Code、OpenCode、Kilo、Antigravity、および汎用 `.agents/skills` をサポート。
- プロジェクトインストーラ、doctor、route、artifact 生成、リポジトリ audit、skill lint、checksum を提供。
- GitHub Issue/PR/Action テンプレート、Claude/Kilo/Antigravity marketplace メタデータ、skills.sh インストール手順を提供。
- リスク S0–S5、品質 QA-L0–L5、成熟度 M0–M9、ガバナンストレーサビリティ行列を導入。
- 三言語化: 英語を主版とし、中国語と日本語の副版が skills・commands・templates・docs・policies をカバー。
