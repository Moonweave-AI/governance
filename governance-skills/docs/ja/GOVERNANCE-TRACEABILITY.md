# ガバナンス トレーサビリティ マトリクス

本システムはプロンプトで「すべてを要約する」ことはせず、各仕様を呼び出し可能な Skills、決定論的チェック、テンプレートにマッピングします。

| ガバナンス文書 | 主要 Skills | 決定論的メカニズム | 典型的なテンプレート |
|---|---|---|---|
| Principles | router, security, gaps, governance-change | governance-map/checksums | RFC/ADR |
| Security-Ethics | security-review, release, incident, audit | secret/asset/file checks | threat-model, asset, exception, hazard |
| Organization | bootstrap, handoff, router | Owner/Backup フィールド检查 | handoff, quality declaration |
| Community | community-contribution, issue, retro | contribution templates | Issue/CoC プロセス記録 |
| Communication | issue, handoff, incident | canonical-link 检查 | meeting/action/handoff |
| Planning | triage, planning, bootstrap | lifecycle/risk/maturity フィールド | idea, discovery, prototype |
| RFC Process | rfc, adr, governance-change | frontmatter/status/link 检查 | RFC/ADR |
| Workflow | brief, implementation, PR, review, release | repo baseline/CI/lockfile 检查 | brief, PR, runbook |
| Quality Assurance | QA, review, release, audit | test/quality/SBOM 証拠检查 | test plan, quality, release report |
| Documentation Guide | docs, research, RFC, ADR | doc metadata/link/stale 检查 | README/docs/research/cards |

機械可読マッピングは `core/governance-map.json` にあります。
