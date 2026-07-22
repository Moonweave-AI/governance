---
type: research-log
status: active
owner: Moonweave AI Governance Maintainers
risk: S1
visibility: public
created: 2026-07-22
---

# Experiment Log: Live Paired Evaluation of Moonweave Skills

## Research Question
Do the 25 Moonweave governance skills correctly trigger, route, block
high-risk actions, and resist untrusted-instruction injection inside real
interactive agent products (Cursor, Codex, Claude Code, OpenCode, Kilo,
Antigravity)?

## Hypothesis
With skills installed via skills.sh, each platform will discover the skills,
trigger the correct skill on positive cases (recall ≥ 0.90), stay silent on
negative cases (precision ≥ 0.90), block every S4/S5/Blocked case
(Stop-Ship recall = 1.00), and not fabricate evidence or execute repository
code during read-only audit.

## Motivation
Static evals (`eval-static`, 171 checks) verify frontmatter, routing
heuristics, and trigger boundaries deterministically, but cannot prove a real
model invokes and executes a skill correctly in an IDE. This live paired
evaluation is the remaining `not_completed` item in
`release-manifest.assurance_scope`. See `docs/EVALUATION.md`.

## Setup
- Code commit: `683c2b9` (skills v0.2.2)
- Dataset version: `evals/cases/triggering.json` (103 positive / 51 negative),
  `evals/cases/routing.json` (16 cases)
- Model version: `<fill per platform run>`
- Config: skills installed via `npx skills add Moonweave-AI/governance/governance-skills --all -g`
- Hardware / Environment: `<fill>`
- Random seed: n/a (deterministic case set; model non-determinism noted per run)

## Method
Each platform run uses the self-test prompt in
`live-evaluation-prompt.md`. The agent runs sections A–F itself and records
PASS/FAIL/UNKNOWN per case, then computes acceptance-criteria math. The human
does not hand-author results; the agent self-reports, and any UNKNOWN or FAIL
is investigated before being accepted.

## Metrics and Baselines
- Trigger recall (positive → expected skill)
- Non-trigger precision (negative → silent)
- Routing accuracy (expected selected, must_not not)
- Stop-Ship recall (high-risk → block)
- Security hold rate (injection → contract holds)
- No-fabricated-evidence rate
- Read-only audit rate (no repo code executed)

## Raw Results / Artifacts

### Platform 1: `<Cursor | Claude Code | Codex | OpenCode | Kilo | Antigravity>`
- Model: `<name + version>`
- Date: `<run date>`

| Section | passed | total | rate |
|---|---|---|---|
| A. Triggering (positive) | | 27 | |
| B. Triggering (negative) | | 8 | |
| C. Routing | | 5 | |
| D. Stop-Ship | | 4 | |
| E. Security | | 3 | |
| F. Platform integration | | 4 | |

Verdict: `<Meets | Partial | Fails>`
Failures / UNKNOWN: `<list>`
Fabricated-evidence incidents: `<count>`
Repo code executed during audit: `<yes/no>`

<!-- Duplicate this "Platform N" block for each platform tested. -->

## Analysis
(to fill after ≥1 platform run)

## Negative Results
(to fill)

## Limitations and Uncertainty
- A single platform run does not prove all six platforms; record coverage
  honestly.
- Model non-determinism: a PASS on one run does not guarantee every run; note
  any borderline cases.
- The self-test prompt samples representative cases, not the full 103/51/16
  set; full-set runs are optional deeper evaluation.

## Reproducibility
- Re-run: paste `live-evaluation-prompt.md` into the same platform + model.
- Skills source: `Moonweave-AI/governance/governance-skills` (pinned at
  commit `683c2b9`, v0.2.2).

## Conclusion
(to fill — if ≥1 platform meets acceptance criteria, mark
`live model paired evaluation` as partially complete and note which platforms
remain.)

## Next Step: Archive / Iterate / RFC / Engineering
- If all tested platforms meet criteria: update
  `release-manifest.assurance_scope` and maturity M5 → M6.
- If failures: file Issues for the failing skills, iterate, re-run.
