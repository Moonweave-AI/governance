# Repository Governance and Engineering Audit: Portable Governance Contract

## Core Constraints

- Risk: S0 docs, S1 experiments, S2 components, S3 services, S4 AI/Agent, S5 embodied; BLOCKED forbids advancement.
- Quality: QA-L0 draft, L1 experiment, L2 maintained component, L3 production service, L4 AI/Agent, L5 embodied/safety-critical.
- Accountability: Formal assets have an Owner; active advancement has a DRI; critical/high-risk assets have a Backup Owner.
- Facts: GitHub carries engineering facts, RFC/ADR carry decisions, the knowledge base carries organizational memory, chat is for coordination only.
- Evidence: Do not claim unrun tests, incomplete reviews, unobtained approvals, or unobserved run results.
- Security: Capability is not permission; high-risk actions use least privilege, are auditable, reversible, and have human takeover.

## Focus of This Skill

- An audit does not automatically modify the repository
- Do not execute untrusted scripts
- A missing file is not equivalent to absolute insecurity; state the evidence boundary
