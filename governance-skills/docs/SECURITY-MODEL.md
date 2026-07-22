# Skills Security Model

## Threats

1. **Skill prompt injection**: Long Markdown, referenced files, or scripts hide malicious instructions.
2. **Repository prompt injection**: Issues, READMEs, code comments, or logs induce the Agent to leak secrets or execute commands.
3. **Supply-chain substitution**: Same-name skills, tampered packages, or unpinned sources or updates.
4. **Over-privileged agent**: A skill requests overly broad file, network, Shell, MCP, or physical permissions.
5. **False evidence**: The Agent claims tests, reviews, or deployments succeeded without actually executing them.
6. **Cross-platform semantic drift**: After platform adaptation, gates are lost or wording changes behavior.

## Controls

- Standardized YAML frontmatter; name matches the directory.
- Every skill includes an untrusted-input safety contract.
- Deterministic CLI with no network and no dependencies; audit does not execute project scripts.
- Installation lock with SHA-256; releases should be signed and produce SBOM/Provenance.
- Platform permissions follow least privilege; write/execute/network/release/deploy/physical actions default to Ask.
- Stop-Ship is enforced jointly by skill prompts, CLI checks, CI/Hook/permission systems; it must not rely on the LLM alone.
- Paired trigger/non-trigger and adversarial safety evals.

## Pre-release Hardening

- Two independent Reviewers review all SKILL.md files and scripts.
- npm provenance and 2FA enabled; GitHub release signing.
- skills lock pins commit/tag and hash.
- Marketplace release notes declare required permissions, network, and scripts.
- Periodic scanning of dependencies (the current CLI has no runtime dependencies) and malicious patterns.
