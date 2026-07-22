# インストールと配布ガイド

本プロジェクトは3つの相補的なパスを提供します。オープンな Agent Skills、決定論的な `npx` インストーラ、プラットフォームネイティブなプラグイン/マーケットプレース マニフェストです。既定では**コピー インストール**を使用します。これにより、一時的な `npx` ディレクトリの消失、Windows のジャンクションの差異、symlink を追追跡しないマーケットプレース パッケージャの問題を回避できます。

> 以下の GitHub およびマーケットプレース コマンドは、リポジトリが `Moonweave-AI/governance`（`governance-skills/` をサブディレクトリとして含む）にプッシュされた後に有効になります。現在のアーカイブには公開可能なマニフェストが含まれていますが、Moonweave AI アカウントによる npm への実際の公開やマーケットプレース審査への提出はまだ行われていません。

## 1. ローカル アーカイブまたは npm tarball

```bash
# 内容を表示
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills list

# サポートされるすべてのプラットフォームに現在のプロジェクトへインストール
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project --mode copy --with-github

# インストール後のチェック
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills doctor --root .
```

## 2. npm / npx

公開後:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

単一プラットフォームをグローバルにインストール:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

## 3. GitHub から直接実行

事前に npm へ公開する必要はありません。governance リポジトリの `governance-skills/` サブディレクトリをクローンして実行します:

```bash
git clone https://github.com/Moonweave-AI/governance.git
cd governance/governance-skills
npm install
npx moonweave-skills install --agents all --scope project --mode copy
```

クローンして依存関係をインストールせずに実行することもできます:

```bash
git clone https://github.com/Moonweave-AI/governance.git
node governance-skills/bin/moonweave-skills.mjs \
  install --root ./your-project --agents all --mode copy
```

## 4. Agent Skills CLI / skills.sh

オープンフォーマットの Skills だけが必要な場合:

```bash
npx skills add Moonweave-AI/governance/governance-skills --all
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

これにより governance リポジトリの `governance-skills/skills/` ディレクトリがインストールされます。Rules、slash commands、GitHub テンプレート、ガバナンス設定、インストール lock が必要な場合は、本パッケージの CLI を実行してください。

## 5. Claude Code Plugin Marketplace

リポジトリ ルートには `.claude-plugin/marketplace.json` が含まれ、ネイティブ プラグインは `plugins/claude/moonweave-governance/` にあります。

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

プロジェクト Skills を直接インストールすることもできます:

```bash
npx @moonweave-ai/governance-skills install --agents claude --scope project
```

## 6. Codex / ChatGPT Plugin Marketplace

リポジトリ ルートには `.agents/plugins/marketplace.json` が含まれ、ネイティブ プラグインは `plugins/codex/moonweave-governance/` にあります。

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

その後、Plugins Directory から **Moonweave Governance** をインストールします。プロジェクト Skills は `.agents/skills/` に直接インストールすることもできます:

```bash
npx @moonweave-ai/governance-skills install --agents codex --scope project
```

## 7. Cursor Plugin Marketplace

リポジトリ ルートには `.cursor-plugin/marketplace.json` が含まれ、ネイティブ プラグインは `plugins/cursor/moonweave-governance/` にあります。Cursor の Plugin Marketplace で GitHub リポジトリ `Moonweave-AI/governance` を追加するか、決定論的インストーラを使用します:

```bash
npx @moonweave-ai/governance-skills install --agents cursor --scope project
```

インストーラは `.cursor/skills/`、`.cursor/commands/`、`.cursor/rules/moonweave-governance.mdc` を配置します。

## 8. OpenCode

```bash
npx @moonweave-ai/governance-skills install --agents opencode --scope project
```

インストール先:

- Skills: `.opencode/skills/`
- Commands: `.opencode/commands/`
- プロジェクト rules: リポジトリ ルートの `AGENTS.md`

OpenCode は `.agents/skills/` も直接検出するため、`npx skills add` も利用可能です。

## 9. Kilo

### ローカル インストール

```bash
npx @moonweave-ai/governance-skills install --agents kilo --scope project
```

- プロジェクト Skills: `.kilo/skills/`
- グローバル Skills: `~/.kilo/skills/`
- プロジェクト commands: `.kilo/commands/`
- プロジェクト rules: `AGENTS.md`

### Remote URL

`skills/index.json` は Kilo remote skill index に準拠します:

```jsonc
{
  "skills": {
    "urls": [
      "https://raw.githubusercontent.com/Moonweave-AI/governance/main/governance-skills/skills/"
    ]
  }
}
```

Kilo Marketplace の貢献プロセス経由で `skills/<name>/` を提出することもできます。

## 10. Google Antigravity

リポジトリ ルート自体がネイティブ Antigravity プラグインのエントリポイントです: `plugin.json` を含み、`skills/` と `rules/` ディレクトリは `governance-skills/` サブディレクトリ配下にあります。

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

プロジェクトへ直接インストール:

```bash
npx @moonweave-ai/governance-skills install --agents antigravity --scope project
```

- プロジェクト Skills: `.agents/skills/`
- グローバル Skills: `~/.gemini/config/skills/`
- プロジェクト rules: `.agents/rules/`
- グローバル rules: `~/.gemini/GEMINI.md`

## 11. インストール モードとセキュリティ

- 既定の `--mode copy`: 推奨。npx、アーカイブ、Windows、マーケットプレース配布に適しています。
- `--mode symlink`: Skills ソース ディレクトリが長期間存在する開発環境にのみ適しています。
- `--force`: インストール済みの内容を明示的に上書きする場合にのみ使用します。
- インストール記録: プロジェクト `.moonweave/skills-lock.json` またはグローバル `~/.moonweave/skills-lock.json`。
- `uninstall` はユーザーが変更したファイルや所有を確認できないファイルを保持します。
- サードパーティ Skills をインストールする前に、`SKILL.md`、スクリプト、マニフェスト、チェックサム、権限要件をレビューしてください。
