# Governance Traceability Matrix

This system does not attempt to "summarize everything" in a prompt. Instead, it maps each specification to invocable Skills, deterministic checks, and templates.

| Governance Document | Primary Skills | Deterministic Mechanism | Typical Templates |
|---|---|---|---|
| Principles | router, security, gaps, governance-change | governance-map/checksums | RFC/ADR |
| Security-Ethics | security-review, release, incident, audit | secret/asset/file checks | threat-model, asset, exception, hazard |
| Organization | bootstrap, handoff, router | Owner/Backup field checks | handoff, quality declaration |
| Community | community-contribution, issue, retro | contribution templates | Issue/CoC process record |
| Communication | issue, handoff, incident | canonical-link checks | meeting/action/handoff |
| Planning | triage, planning, bootstrap | lifecycle/risk/maturity fields | idea, discovery, prototype |
| RFC Process | rfc, adr, governance-change | frontmatter/status/link checks | RFC/ADR |
| Workflow | brief, implementation, PR, review, release | repo baseline/CI/lockfile checks | brief, PR, runbook |
| Quality Assurance | QA, review, release, audit | test/quality/SBOM evidence checks | test plan, quality, release report |
| Documentation Guide | docs, research, RFC, ADR | doc metadata/link/stale checks | README/docs/research/cards |

The machine-readable mapping is in `core/governance-map.json`.
