# 设计参考

本文件记录 Moonweave Governance Skills 的直接规范来源、平台兼容依据、研究依据与参考实现。版本与路径可能随平台更新而变化，发布前必须重新验证官方文档和市场 schema。

## Moonweave 规范来源

- Moonweave AI Governance: https://github.com/Moonweave-AI/governance

本包以该仓库的中文 canonical 文档为直接语义来源，并将原则、安全伦理、组织、社区、沟通、规划、RFC、工程工作流、质量保障与知识管理映射为可调用 Skill、命令、模板和确定性检查。

## 开放规范与平台官方文档

- Agent Skills specification: https://agentskills.io/specification
- OpenAI Codex skills, plugins and AGENTS.md: https://developers.openai.com/codex/skills
- Claude Code skills, hooks and plugins: https://docs.anthropic.com/en/docs/claude-code/skills
- Cursor skills, rules, commands and plugins: https://cursor.com/docs/skills
- OpenCode skills, commands and rules: https://opencode.ai/docs/skills/
- Kilo skills, rules, workflows and marketplace: https://kilo.ai/docs/customize/skills
- Google Antigravity skills, rules, workflows and plugins: https://antigravity.google/docs/skills
- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills

## 研究：有效性、编译与评测

- **SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks** (2026), arXiv:2602.12670. 以无 Skill、人工策划 Skill 和自生成 Skill 的配对条件评估任务结果，并提供确定性 verifier；结果支持使用聚焦、人工策划的 Skill，同时要求任务级回归评测。
- **Skill Coverage: A Test Adequacy Metric for Agent Skills** (2026), arXiv:2606.20659. 将 Skill 行为约束视为被测对象，评估轨迹是否覆盖并遵守约束；本项目据此规划 Skill coverage 与失败约束分析。
- **SkCC: Portable and Secure Skill Compilation for Cross-Framework LLM Agents** (2026), arXiv:2605.03353. 支持"供应商中立语义内核 → 平台适配器"的可移植编译思路。
- **SkillRT: Compiling Skills for Efficient Execution Everywhere** (2026), arXiv:2604.03088. 支持将长 Skill 文档转换为更适合运行时执行的结构化制品。
- **SkillSmith: Compiling Agent Skills into Boundary-Guided Runtime Interfaces** (2026), arXiv:2605.15215. 采用边界优先编译减少无关上下文和重复推理；本项目据此保持 Skill 聚焦，并把确定性能力下沉到 CLI。
- **Anything2Skill: Compiling External Knowledge into Reusable Skills for Agents** (2026), arXiv:2606.09316. 讨论将外部知识转化为可复用 Skill 的流程，与本项目的 governance-to-skills 编译目标相关。

## 研究：安全与供应链

- **Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injections** (2025), arXiv:2510.26328. 说明 Skill 与其处理的不可信文本之间可能形成直接 Prompt Injection 通道。
- **Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale** (2026), arXiv:2601.10338. 大规模分析公共 Skill 生态中的 Prompt Injection、数据外泄、权限提升与供应链风险。
- **Malicious Agent Skills in the Wild: A Large-Scale Security Empirical Study** (2026), arXiv:2602.06547. 对经行为验证的恶意 Skill、漏洞类型和攻击链进行实证分析，支持安装前审计、最小权限、脚本隔离和可追溯发布。
- **SafeClaw-R: Towards Safe and Secure Multi-Agent Personal Assistants** (2026), arXiv:2603.28807. 强调在执行前调解高风险动作，并把安全作为执行图上的系统级不变量；本项目据此要求人类确认、Stop-Ship、权限边界和确定性执行门禁。

## 参考开源实现

- Vercel Agent Skills CLI: https://github.com/vercel-labs/skills
- SkCC reference implementation（以论文仓库为准）
- SkillSmith / Aeloon: https://github.com/AetherHeart-AI/Aeloon
- OpenSSF Scorecard: https://github.com/ossf/scorecard
- Sigstore: https://github.com/sigstore
- SLSA framework: https://slsa.dev/

## 工程治理基础

Moonweave 治理仓库综合了 Google Engineering Practices、NIST SSDF / AI RMF、OWASP、SRE、Kubernetes KEP / PRR、Rust RFC、Python PEP、Apache / CNCF、Docs as Code、Model Cards、Datasheets for Datasets 等体系。本包不重新解释这些上游规范，而是以 Moonweave canonical 文档为统一的组织级来源，并保留到每个 Skill、命令、模板和审计检查的追踪矩阵。
