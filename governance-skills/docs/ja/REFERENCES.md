# 設計リファレンス

このファイルは Moonweave Governance Skills の直接的な規範情報源、プラットフォーム互換性の根拠、研究根拠、および参照実装を記録するものです。バージョンとパスはプラットフォームの更新に伴って変化する可能性があるため、リリース前に必ず公式ドキュメントとマーケットプレース schema を再検証してください。

## Moonweave 規範情報源

- Moonweave AI Governance: https://github.com/Moonweave-AI/governance

本パッケージは同リポジトリの中文 canonical ドキュメントを直接的な意味情報源とし、原則・安全倫理・組織・コミュニティ・コミュニケーション・計画・RFC・エンジニアリングワークフロー・品質保証・知識管理を、呼び出し可能な Skill・コマンド・テンプレート・決定論的チェックへマッピングします。

## オープン仕様と公式プラットフォームドキュメント

- Agent Skills specification: https://agentskills.io/specification
- OpenAI Codex skills, plugins and AGENTS.md: https://developers.openai.com/codex/skills
- Claude Code skills, hooks and plugins: https://docs.anthropic.com/en/docs/claude-code/skills
- Cursor skills, rules, commands and plugins: https://cursor.com/docs/skills
- OpenCode skills, commands and rules: https://opencode.ai/docs/skills/
- Kilo skills, rules, workflows and marketplace: https://kilo.ai/docs/customize/skills
- Google Antigravity skills, rules, workflows and plugins: https://antigravity.google/docs/skills
- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills

## 研究：有効性・コンパイル・評価

- **SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks** (2026), arXiv:2602.12670. Skill なし、人手で作成された Skill、自動生成 Skill のペア条件でタスク結果を評価し、決定論的 verifier を提供する。結果は焦点を絞った人手作成 Skill の使用を支持しつつ、タスクレベルの回帰評価を要求する。
- **Skill Coverage: A Test Adequacy Metric for Agent Skills** (2026), arXiv:2606.20659. Skill の振る舞い制約を被テスト対象とみなし、トレースが制約を網羅し遵守するかを評価する。本プロジェクトはこれに基づき Skill coverage と失敗制約分析を計画する。
- **SkCC: Portable and Secure Skill Compilation for Cross-Framework LLM Agents** (2026), arXiv:2605.03353. 「ベンダーニュートラルな意味的コア → プラットフォームアダプタ」のポータブルなコンパイル手法をサポートする。
- **SkillRT: Compiling Skills for Efficient Execution Everywhere** (2026), arXiv:2604.03088. 長い Skill ドキュメントを実行時に適した構造化アーティファクトへ変換する手法をサポートする。
- **SkillSmith: Compiling Agent Skills into Boundary-Guided Runtime Interfaces** (2026), arXiv:2605.15215. 境界優先コンパイルで無関係なコンテキストと繰り返し推論を削減する。本プロジェクトはこれに基づき Skill を焦点化し、決定論的機能を CLI に押し下げる。
- **Anything2Skill: Compiling External Knowledge into Reusable Skills for Agents** (2026), arXiv:2606.09316. 外部知識を再利用可能な Skill に変換するプロセスを論じており、本プロジェクトの governance-to-skills コンパイル目標に関連する。

## 研究：セキュリティとサプライチェーン

- **Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injections** (2025), arXiv:2510.26328. Skill とそれが処理する信頼できないテキストの間に直接的な Prompt Injection 経路が生じうることを示す。
- **Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale** (2026), arXiv:2601.10338. 公開 Skill エコシステムにおける Prompt Injection・データ流出・権限昇格・サプライチェーンリスクの大規模分析。
- **Malicious Agent Skills in the Wild: A Large-Scale Security Empirical Study** (2026), arXiv:2602.06547. 振る舞い検証済みの悪意ある Skill・脆弱性タイプ・攻撃チェーンの実証分析であり、インストール前監査・最小権限・スクリプト分離・追跡可能なリリースを支持する。
- **SafeClaw-R: Towards Safe and Secure Multi-Agent Personal Assistants** (2026), arXiv:2603.28807. 実行前に高リスク动作を調停し、安全を実行グラフ上のシステムレベル不変条件として扱うことを強調する。本プロジェクトはこれに基づき人間確認・Stop-Ship・権限境界・決定論的実行ゲートを要求する。

## 参照オープンソース実装

- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills
- SkCC reference implementation（論文リポジトリを優先）
- SkillSmith / Aeloon: https://github.com/AetherHeart-AI/Aeloon
- OpenSSF Scorecard: https://github.com/ossf/scorecard
- Sigstore: https://github.com/sigstore
- SLSA framework: https://slsa.dev/

## コンテキスト予算、変更グラフ、完了

- [Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)（Anthropic、2025）。必要なときに記録を読む。識別子を文脈に残し、今の手順が必要とする記録だけを読む。
- [Equipping agents with Agent Skills](https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills)（Anthropic、2025）と [Agent Skills 仕様](https://agentskills.io/specification)。メタデータ、手順、資源の順に読む。アトラスが地図で、近傍が次のファイルである。
- [From Local to Global: A GraphRAG Approach to Query-Focused Summarization](https://arxiv.org/html/2404.16130v2)（Edge ほか、2024）。階層的なコミュニティ要約は、生のグラフを文脈に置かずにコーパス質問へ答える。
- [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)。変更ログは人間向けの選定されたリリース一覧である。コミットの転記と進捗日記は悪い実践として挙げられている。
- [Diátaxis](https://diataxis.fr/)。読者の必要ごとに一つの文書形式を使う。事実を持つページを編集し、平行するページを足さない統合規則である。
- [SWE-bench](https://arxiv.org/html/2310.06770v3)（Jimenez ほか、2024）と [SWE-bench FAQ](https://github.com/SWE-bench/SWE-bench/blob/main/docs/faq.md)。パッチが適用されテストが通ったときにタスクは解決する。
- [Building effective AI agents](https://www.anthropic.com/research/building-effective-agents)（Anthropic、2024）。コーディングエージェントは検証できる変更で終え、その結果を良くするときだけ手順を足す。
- [Documentation lifecycle ADR 0002](https://aot-technologies.github.io/node-wire/adr/0002-documentation-lifecycle/)。一つの事実に一つの所有ページ。生きたページは今真実であることを述べ、計画は証拠ではない。

## エンジニアリングガバナンスの基盤

Moonweave ガバナンスリポジトリは Google Engineering Practices・NIST SSDF / AI RMF・OWASP・SRE・Kubernetes KEP / PRR・Rust RFC・Python PEP・Apache / CNCF・Docs as Code・Model Cards・Datasheets for Datasets などの体系を統合している。本パッケージはこれら上流仕様を再解釈せず、Moonweave canonical ドキュメントを統一された組織レベルの情報源とし、各 Skill・コマンド・テンプレート・監査チェックに至るトレーサビリティマトリクスを保持する。
