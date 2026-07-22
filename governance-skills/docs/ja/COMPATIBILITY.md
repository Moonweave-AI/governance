# プラットフォーム互換性マトリクス

| プラットフォーム | プロジェクトスキルパス | Always-on ガイダンス | コマンド/ワークフロー | ネイティブ配布 | ステータス |
|---|---|---|---|---|---|
| Codex | `.agents/skills` | `AGENTS.md` | スキル明示/自動呼び出し | `.agents/plugins/marketplace.json` + `.codex-plugin/plugin.json` | 生成・検証済み |
| Cursor | `.cursor/skills` | `.cursor/rules/*.mdc` / `AGENTS.md` | `.cursor/commands/*.md` | `.cursor-plugin/marketplace.json` | 生成・検証済み |
| Claude Code | `.claude/skills` | `CLAUDE.md` | `.claude/commands` / plugin commands | `.claude-plugin/marketplace.json` | 生成・検証済み |
| OpenCode | `.opencode/skills`、`.agents/skills` と互換 | `AGENTS.md` / `opencode.json` | `.opencode/commands` | オープンスキルまたは npx インストール | パスとコマンド検証済み |
| Kilo | `.kilo/skills`、`.agents/skills` / `.claude/skills` と互換 | `AGENTS.md` または `kilo.jsonc` instructions | `.kilo/commands` | `skills/index.json` remote URL / Kilo Marketplace | 生成・検証済み |
| Antigravity IDE / CLI | `.agents/skills` | `.agents/rules` / `~/.gemini/GEMINI.md` | Skills は自動的に slash commands になる | ルート `plugin.json` / `agy plugin install` | 生成・検証済み |
| skills.sh / Skills CLI | ルート `skills/` | ルールをインストールしない | スキル明示/自動呼び出し | `npx skills add` | オープンフォーマット |

## 互換性戦略

- `skills/<name>/SKILL.md` がベンダー中立のスキル意味ソースである。
- `commands/` と `rules/` は移植可能なソースコンポーネントである。
- `scripts/build-adapters.mjs` がソースコンポーネントをコピーし、各プラットフォームの manifest を生成する；ネイティブプラグインのコピーは手動で保守しない。
- Always-on ルールはセキュリティベースライン、信頼できる情報源、ルーティング原則のみを保持し、完全なガバナンス文書を毎回のセッションに注入することを避ける。
- CLI は確定的な事項を担当する；プラットフォームの権限、sandbox、CI、人間の Review が境界を強制する。
- プラットフォームのフォーマットが変化した場合、adapter、バリデータ、互換性マトリクスを更新し、23 のスキルのビジネス意味をフォークして変更しない。
