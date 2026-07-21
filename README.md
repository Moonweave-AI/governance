# Moonweave AI — Governance

Governance guidelines, engineering standards, and knowledge management framework for the Kaguya Project (辉夜計画/辉夜计划).

---

## What is this repository?

This repository defines the principles, organizational structure, collaboration protocols, engineering workflows, quality standards, and knowledge management practices for the Moonweave/Kaguya Project — a long-lifecycle AI architecture integrating autonomous agents, AI infrastructure, and embodied intelligence.

This is not code. This is the project's operating system: the rules, processes, and standards that enable safe, traceable, and sustainable engineering across software, AI/Agent systems, data pipelines, model services, and embodied robotics.

---

## Structure

```text
01-Foundation/          Principles and security-ethics baseline
02-Governance/          Organization, roles, and community rules
03-Collaboration/       Communication, planning, and RFC process
04-Engineering/         Workflow, quality assurance, and technical standards
05-Knowledge/           Documentation guide and knowledge asset management
06-Glossary/            Term definitions in English, Chinese, and Japanese
```

| Section | Documents |
|---------|-----------|
| **01-Foundation** | [Principles](01-Foundation/01-Principles.md) · [Security & Ethics](01-Foundation/02-Security-Ethics.md) |
| **02-Governance** | [Organization](02-Governance/01-Organization.md) · [Community](02-Governance/02-Community.md) |
| **03-Collaboration** | [Communication](03-Collaboration/01-Communication.md) · [Planning](03-Collaboration/02-Planning.md) · [RFC Process](03-Collaboration/03-RFC-Process.md) |
| **04-Engineering** | [Workflow](04-Engineering/01-Workflow.md) · [Quality Assurance](04-Engineering/02-Quality-Assurance.md) · [Standards](04-Engineering/standards/) |
| **05-Knowledge** | [Documentation Guide](05-Knowledge/01-Documentation-Guide.md) |
| **06-Glossary** | [English](06-Glossary/en/) · [中文](06-Glossary/zh/) · [日本語](06-Glossary/ja/) |

---

## Key Concepts

- **All engineering changes must be traceable, reproducible, reviewable, verifiable, and reversible.**
- **Risk determines process intensity** — lightweight for low-risk reversible changes; heavyweight for production, AI, and embodied systems.
- **Quality is evidence, not feeling** — every system claim must be backed by checkable proof.
- **Prototypes must not silently become production dependencies.**
- **AI/Agent/Embodied changes require specialized validation beyond traditional software testing.**

---

## How to Use This Repository

**If you are starting a new project** → Read [Principles](01-Foundation/01-Principles.md), then [Workflow](04-Engineering/01-Workflow.md) §5 (Engineering Ready).

**If you need to propose a significant change** → Read [RFC Process](03-Collaboration/03-RFC-Process.md).

**If you are implementing an engineering task** → Read [Workflow](04-Engineering/01-Workflow.md).

**If you need to understand quality requirements** → Read [Quality Assurance](04-Engineering/02-Quality-Assurance.md).

**If you are writing documentation** → Read [Documentation Guide](05-Knowledge/01-Documentation-Guide.md).

**If you encounter an unfamiliar term** → Check the [Glossary](06-Glossary/).

---

## Languages

All documents are available in three languages:

| Language | Path | Notes |
|----------|------|-------|
| **中文 (Chinese)** | Root of each section (e.g., `01-Foundation/01-Principles.md`) | Primary/canonical version |
| **English** | `en/` subdirectory (e.g., `01-Foundation/en/01-Principles.md`) | Full translation |
| **日本語 (Japanese)** | `ja/` subdirectory (e.g., `01-Foundation/ja/01-Principles.md`) | Full translation |

The [Glossary](06-Glossary/) uses the same `en/` / `zh/` / `ja/` structure with English as default.

---

## Status

**Active** — This repository is under active development. Foundation, Governance, Collaboration, Engineering, and Knowledge sections are complete. Technical standards (`04-Engineering/standards/`) are pending.

---

## License

[MIT](LICENSE)

---

## Ownership

Maintained by the Moonweave AI core team. Changes to governance documents require RFC process approval as defined in [03-Collaboration/03-RFC-Process.md](03-Collaboration/03-RFC-Process.md).
