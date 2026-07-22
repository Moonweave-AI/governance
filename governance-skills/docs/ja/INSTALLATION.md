# インストールと配布ガイド

本プロジェクトは複数の相補的なパスを提供します。**Skills を取得する最速の方法は GitHub から直接取得することです — npm の公開は不要です。** 決定論的な `npx` インストーラおよび tarball パスはオプションであり、Skills 自体に加えて CLI ツール（`route`、`audit`、`doctor`、`lint-skills`、`eval-static`、`checksums`）が必要な場合にのみ必要です。

> 以下の GitHub および marketplace コマンドは、リポジトリが `Moonweave-AI/governance`（`governance-skills/` をサブディレクトリとして含む）にプッシュされた時点で利用可能になります。npm パッケージ `@moonweave-ai/governance-skills` は、事前に npm で `moonweave-ai` 組織を作成する必要があります（§7 を参照）。

## 1. Agent Skills CLI / skills.sh（推奨、公開不要）

オープンフォーマットの Skills だけが必要な場合 — GitHub ソースから直接実行:

```bash
# Install all skills into the current project
npx skills add Moonweave-AI/governance/governance-skills

# Install globally
npx skills add Moonweave-AI/governance/governance-skills -g

# Install a single skill
npx skills add Moonweave-AI/governance/governance-skills --skill moonweave-code-review
```

これにより governance リポジトリの `governance-skills/skills/` ディレクトリがインストールされます。Rules、slash commands、GitHub テンプレート、ガバナンス設定、インストール lock も必要な場合は、§3 または §5 の CLI を使用してください。

## 2. GitHub CLI skill インストール

```bash
# Install all skills (interactive — choose agent and scope)
gh skill install Moonweave-AI/governance/governance-skills --all

# Install for a specific agent
gh skill install Moonweave-AI/governance/governance-skills --all --agent cursor --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent claude-code --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent codex --scope user
gh skill install Moonweave-AI/governance/governance-skills --all --agent opencode --scope user

# Install a single skill
gh skill install Moonweave-AI/governance/governance-skills moonweave-governance-router
```

## 3. GitHub から直接実行（公開不要）

governance リポジトリの `governance-skills/` サブディレクトリをクローンして実行します:

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

## 4. プラットフォームネイティブ Marketplace（公開不要）

Marketplace マニフェストは governance リポジトリのルートに配置されているため、各プラットフォームは `Moonweave-AI/governance` リポジトリを追加するだけでそれらを検出できます。

### Claude Code Plugin Marketplace

リポジトリ ルートには `.claude-plugin/marketplace.json` が含まれ、ネイティブ プラグインは `governance-skills/plugins/claude/moonweave-governance/` にあります。

```text
/plugin marketplace add Moonweave-AI/governance
/plugin install moonweave-governance@moonweave-ai
```

### Codex / ChatGPT Plugin Marketplace

リポジトリ ルートには `.agents/plugins/marketplace.json` が含まれ、ネイティブ プラグインは `governance-skills/plugins/codex/moonweave-governance/` にあります。

```bash
codex plugin marketplace add Moonweave-AI/governance
codex plugin marketplace list
```

その後、Plugins Directory から **Moonweave Governance** をインストールします。

### Cursor Plugin Marketplace

リポジトリ ルートには `.cursor-plugin/marketplace.json` が含まれ、ネイティブ プラグインは `governance-skills/plugins/cursor/moonweave-governance/` にあります。Cursor の Plugin Marketplace で GitHub リポジトリ `Moonweave-AI/governance` を追加してください。

### Google Antigravity

governance リポジトリのルート自体がネイティブ Antigravity プラグインのエントリポイントです: `plugin.json` を含み、`skills/` および `rules/` ディレクトリは `governance-skills/` サブディレクトリ配下にあります。

```bash
agy plugin install https://github.com/Moonweave-AI/governance
```

### Kilo remote URL

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

## 5. GitHub からの決定的 CLI インストーラ

CLI インストーラは Skills、commands、rules、GitHub テンプレート、lock ファイルをコピーします。クローンしたリポジトリから直接実行（§3）することも、npm に公開された後 npx で実行（§6）することもできます。

```bash
# From a clone (§3):
npx moonweave-skills install --agents cursor,codex,claude,opencode,kilo,antigravity --scope project --mode copy
npx moonweave-skills doctor --root .
npx moonweave-skills route --text "let the agent write to the production database"
```

インストール先は agent ごとに異なります:

- **OpenCode**: Skills `.opencode/skills/`、Commands `.opencode/commands/`、rules `AGENTS.md`。OpenCode は `.agents/skills/` も直接検出するため、`npx skills add` も利用可能です。
- **Kilo**: プロジェクト Skills `.kilo/skills/`、グローバル `~/.kilo/skills/`、プロジェクト commands `.kilo/commands/`、rules `AGENTS.md`。
- **Antigravity**: プロジェクト Skills `.agents/skills/`、グローバル `~/.gemini/config/skills/`、プロジェクト rules `.agents/rules/`、グローバル `~/.gemini/GEMINI.md`。
- **Cursor**: `.cursor/skills/`、`.cursor/commands/`、`.cursor/rules/moonweave-governance.mdc`。

## 6. ローカル アーカイブまたは npm tarball

```bash
# View contents
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills list

# Install into the current project for all supported platforms
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills install --agents all --scope project --mode copy --with-github

# Post-install check
npx --yes --package=./moonweave-ai-governance-skills-0.1.0.tgz \
  moonweave-skills doctor --root .
```

クローンからローカルに tarball をビルド:

```bash
cd governance/governance-skills
npm install
npm pack
```

## 7. npm / npx（事前に npm で @moonweave-ai 組織の作成が必要）

公開前に、npm アカウントで https://www.npmjs.com/org/create にて `moonweave-ai` 組織を作成し、`governance-skills/` から:

```bash
npm publish --access public
```

公開後:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents cursor,codex,claude,opencode,kilo,antigravity \
  --scope project --mode copy
```

選択したプラットフォームをグローバルにインストール:

```bash
npx --yes @moonweave-ai/governance-skills \
  install --agents codex,claude --scope global --mode copy
```

npm パッケージが公開されるまでは、§1–§5 を使用してください。これらは GitHub ソースから完全に実行され、npm の公開は不要です。

## 8. インストール モードとセキュリティ

- 既定の `--mode copy`: 推奨。npx、アーカイブ、Windows、marketplace 配布に適しています。
- `--mode symlink`: Skills ソース ディレクトリが長期間存在する開発環境にのみ適しています。
- `--force`: インストール済みの内容を明示的に上書きする場合にのみ使用します。
- インストール記録: プロジェクト `.moonweave/skills-lock.json` またはグローバル `~/.moonweave/skills-lock.json`。
- `uninstall` はユーザーが変更したファイルや所有を確認できないファイルを保持します。
- サードパーティ Skills をインストールする前に、`SKILL.md`、スクリプト、マニフェスト、チェックサム、権限要件をレビューしてください。
