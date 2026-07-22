# 公開とマーケットプレース提出

## 公開前ゲート

```bash
npm run verify
npm run audit:self
npm pack --dry-run
```

また以下も行ってください:

- ガバナンス仕様のバージョンを `core/manifest.json` と照合します。
- すべての `SKILL.md`、スクリプト、マニフェスト、依存関係をレビューします。
- SHA-256、SBOM、provenance、署名を生成して検証します。
- ソースからだけでなく、実際の npm tarball からインストール スモークテストを実行します。
- Cursor、Codex、Claude、OpenCode、Kilo、Antigravity をそれぞれ少なくとも1つの実際のプロジェクトで検証します。
- トリガ/非トリガ、セキュリティ インジェクション、Stop-Ship、タスク結果のペア評価を実行します。

## npm

```bash
npm login
npm publish --access public
```

## GitHub Release

アップロード:

- ソース ZIP / tar.gz
- npm `.tgz`
- `SHA256SUMS`
- 検証レポート
- SBOM / provenance / signature (公式リリースの場合)

## マーケットプレース エントリポイント

- Claude: ルート `.claude-plugin/marketplace.json`
- Cursor: ルート `.cursor-plugin/marketplace.json`
- Codex / ChatGPT: ルート `.agents/plugins/marketplace.json`
- Antigravity: ルート `plugin.json`
- Kilo: `skills/index.json` remote URL、または Kilo Marketplace への Skill ディレクトリ提出
- skills.sh: governance リポジリの `governance-skills/skills/` ディレクトリ

マーケットプレース審査が承認されるまで、ドキュメントは "publication-ready / pending review" を使用し、掲載済みであると主張してはなりません。
