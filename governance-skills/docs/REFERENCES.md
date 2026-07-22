# Design References

This file records the direct normative sources, platform compatibility basis, research basis, and reference implementations for Moonweave Governance Skills. Versions and paths may change as platforms update; re-verify official documentation and marketplace schemas before each release.

## Moonweave Normative Sources

- Moonweave AI Governance: https://github.com/Moonweave-AI/governance

This package uses that repository's Chinese canonical documentation as its direct semantic source, and maps principles, safety and ethics, organization, community, communication, planning, RFC, engineering workflow, quality assurance, and knowledge management into invocable Skills, commands, templates, and deterministic checks.

## Open Specifications and Official Platform Documentation

- Agent Skills specification: https://agentskills.io/specification
- OpenAI Codex skills, plugins and AGENTS.md: https://developers.openai.com/codex/skills
- Claude Code skills, hooks and plugins: https://docs.anthropic.com/en/docs/claude-code/skills
- Cursor skills, rules, commands and plugins: https://cursor.com/docs/skills
- OpenCode skills, commands and rules: https://opencode.ai/docs/skills/
- Kilo skills, rules, workflows and marketplace: https://kilo.ai/docs/customize/skills
- Google Antigravity skills, rules, workflows and plugins: https://antigravity.google/docs/skills
- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills

## Research: Effectiveness, Compilation, and Evaluation

- **SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks** (2026), arXiv:2602.12670. Evaluates task outcomes across paired conditions of no Skill, human-curated Skill, and self-generated Skill, and provides a deterministic verifier; results support using focused, human-curated Skills while requiring task-level regression evaluation.
- **Skill Coverage: A Test Adequacy Metric for Agent Skills** (2026), arXiv:2606.20659. Treats Skill behavioral constraints as the objects under test and evaluates whether traces cover and obey the constraints; this project uses it to plan Skill coverage and failed-constraint analysis.
- **SkCC: Portable and Secure Skill Compilation for Cross-Framework LLM Agents** (2026), arXiv:2605.03353. Supports a portable compilation approach of "vendor-neutral semantic core -> platform adapter."
- **SkillRT: Compiling Skills for Efficient Execution Everywhere** (2026), arXiv:2604.03088. Supports transforming long Skill documents into structured artifacts better suited for runtime execution.
- **SkillSmith: Compiling Agent Skills into Boundary-Guided Runtime Interfaces** (2026), arXiv:2605.15215. Uses boundary-first compilation to reduce irrelevant context and repeated reasoning; this project uses it to keep Skills focused and push deterministic capabilities down into the CLI.
- **Anything2Skill: Compiling External Knowledge into Reusable Skills for Agents** (2026), arXiv:2606.09316. Discusses the process of turning external knowledge into reusable Skills, relevant to this project's governance-to-skills compilation goal.

## Research: Security and Supply Chain

- **Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injections** (2025), arXiv:2510.26328. Shows that a direct Prompt Injection channel can form between a Skill and the untrusted text it processes.
- **Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale** (2026), arXiv:2601.10338. Large-scale analysis of Prompt Injection, data exfiltration, privilege escalation, and supply-chain risks in the public Skill ecosystem.
- **Malicious Agent Skills in the Wild: A Large-Scale Security Empirical Study** (2026), arXiv:2602.06547. Empirical analysis of behavior-validated malicious Skills, vulnerability types, and attack chains; supports pre-install audit, least privilege, script isolation, and traceable release.
- **SafeClaw-R: Towards Safe and Secure Multi-Agent Personal Assistants** (2026), arXiv:2603.28807. Emphasizes mediating high-risk actions before execution and treating safety as a system-level invariant on the execution graph; this project uses it to require human confirmation, Stop-Ship, privilege boundaries, and deterministic execution gates.

## Reference Open-Source Implementations

- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills
- SkCC reference implementation (per the paper repository)
- SkillSmith / Aeloon: https://github.com/AetherHeart-AI/Aeloon
- OpenSSF Scorecard: https://github.com/ossf/scorecard
- Sigstore: https://github.com/sigstore
- SLSA framework: https://slsa.dev/

## Engineering Governance Foundations

The Moonweave governance repository synthesizes systems such as Google Engineering Practices, NIST SSDF / AI RMF, OWASP, SRE, Kubernetes KEP / PRR, Rust RFC, Python PEP, Apache / CNCF, Docs as Code, Model Cards, and Datasheets for Datasets. This package does not re-interpret those upstream specifications; instead it uses the Moonweave canonical documentation as the unified organizational source and preserves a traceability matrix down to every Skill, command, template, and audit check.
