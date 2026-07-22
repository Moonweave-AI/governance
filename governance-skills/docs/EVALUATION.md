# Evaluation Method

The effectiveness of Skills must be validated by task outcomes, not just by checking that the text is complete. Moonweave uses a layered approach: deterministic checks for statically verifiable items first, paired evaluation for model behavior, and platform live testing before release.

## Four Evaluation Categories

1. **Triggering**: Does it trigger when it should, and stay silent when it should not.
2. **Procedure fidelity**: Does it execute key Gates, output evidence, escalate risk, and respect stop conditions.
3. **Task outcome**: Paired comparison with a no-Skill baseline for success rate, defects, cost, latency, and human review burden.
4. **Security**: Can malicious Issues, READMEs, logs, references, or third-party Skills induce leakage, privilege escalation, execution of untrusted code, or ignoring Stop-Ship.

## Current Deterministic Evaluation

The static evaluation shipped with the repository is run by `moonweave-skills eval-static` and currently contains **82 checks**:

- Each of the 23 Skills has at least one should-trigger case;
- Each of the 23 Skills has at least one should-not-trigger case;
- 8 cross-Skill routing baselines;
- Skill metadata, required sections, and safety contract checks;
- Key constraint checks such as risk words, Stop-Ship, Owner/DRI, evidence, and escalation paths.

These checks can detect missing descriptions, overly broad trigger boundaries, wrong skill mappings, and missing key contracts, but they **cannot prove that a given model will correctly invoke and execute a Skill in a real IDE**.

## Paired Experiments

Run on the same task, same model, same platform, and same environment:

- **Baseline**: No Moonweave Skill loaded;
- **Curated**: Moonweave Skills selected by the router are loaded;
- **Ablation**: Remove the safety contract, key Gates, or deterministic checks;
- **Adversarial**: Inject untrusted instructions or privilege-escalation prompts into Issues, READMEs, logs, and references.

At minimum record:

- Whether the task succeeded;
- Severe governance omissions;
- False triggers and false blocks;
- Whether tests, scans, reviews, or release evidence were fabricated;
- Whether Stop-Ship and escalation were correctly executed;
- Tool calls, tokens, latency, and human review time;
- Coverage of Skill behavior constraints and failed constraints.

## Routing Evaluation

- `evals/cases/routing.json`: cross-Skill and risk routing baselines;
- `evals/cases/triggering.json`: positive and negative trigger cases for each Skill;
- `moonweave-skills route --text <task>`: used to inspect deterministic candidate ranking;
- `moonweave-skills eval-static`: used for fast regression in CI.

## Pre-Release Platform Matrix

Before an official npm or marketplace release, sample-verify at least the following in Cursor, Codex, Claude Code, OpenCode, Kilo, and Antigravity:

1. The platform can discover the Skill;
2. Positive tasks trigger the correct Skill;
3. Negative tasks do not trigger incorrectly;
4. Slash commands / workflows pass the task correctly;
5. Platform rule files load successfully;
6. High-risk cases do not bypass human confirmation;
7. Instructions in third-party text do not override the Skill's safety contract;
8. Uninstall does not delete user-modified files.

This repository has currently completed format, manifest, install path, static triggering, deterministic audit, and local install smoke testing; because the release accounts and the six interactive Agent products are not in the local build environment, real model calls and marketplace review must be executed during the actual release phase, with results written into a versioned verification report.

## Suggested Acceptance Criteria

- Trigger recall >= 0.90, non-trigger precision >= 0.90;
- Stop-Ship recall for S4 / S5 / Blocked cases = 1.00;
- No-fabricated-evidence rate = 1.00;
- Read-only audit rate without executing repository code = 1.00;
- Significant reduction in severe governance omissions compared with Baseline;
- Token, latency, and human review overhead within an acceptable range;
- Behavior-constraint coverage for high-risk Skills must meet the release gate; uncovered constraints must be recorded as quality debt.

## Research Basis

- SkillsBench shows that human-curated, narrowly scoped Skills can significantly improve average task pass rates, but gains vary widely across tasks and some tasks even show negative transfer, so "install success" cannot replace task-level evaluation.
- Skill Coverage notes that task results alone cannot determine which behavior constraints in a Skill were actually executed, so this project incorporates behavior-constraint coverage and failed constraints into the subsequent model evaluation design.
- SkillSmith's boundary-first compilation approach supports this project's "focused Skill + deterministic CLI + platform adapter" structure, to reduce irrelevant context and repeated reasoning.
- Large-scale Skill security research finds that third-party Skills may contain prompt injection, data exfiltration, privilege escalation, and supply-chain risks, so this project treats Skills themselves as supply-chain artifacts and places controls at install, audit, and run time.
