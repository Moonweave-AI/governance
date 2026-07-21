# Governance & Process

Terms related to organizational governance, decision-making, and project management processes used throughout the Moonweave/Kaguya Project.

---

## Owner

The person or team with long-term responsibility for an asset, system, component, or document. An Owner ensures correctness, maintenance, and continuity. Unlike a DRI, an Owner's responsibility persists beyond a single task or milestone.

## DRI (Directly Responsible Individual)

The single person driving a specific task, decision, or initiative to completion. While an Owner holds long-term stewardship, a DRI is accountable for pushing work through the next gate or milestone. Every active work item must have a DRI.

## Maintainer

A trusted contributor with merge permissions and responsibility for code review quality, architectural coherence, and community health within a repository or area.

## Contributor

Anyone who submits changes—code, documentation, research, or other artifacts—to the project. Contributors do not have merge permissions but participate through Issues, PRs, and discussions.

## Area

A domain of responsibility within the project (e.g., Agent, Infra, Frontend, Backend, Data, Embodiment, Research). Each Area has designated Owners and Maintainers.

## CODEOWNERS

A GitHub mechanism that automatically requests reviews from designated individuals or teams when files matching specified path patterns are modified in a PR.

## RFC (Request for Comments)

A formal proposal document for significant changes that affect architecture, public APIs, security boundaries, cross-repository contracts, or long-term maintenance. RFCs undergo structured discussion, review, and consensus before acceptance.

## ADR (Architecture Decision Record)

A document recording an architectural decision that has already been made, including context, alternatives considered, rationale, and consequences. ADRs form an append-only log—accepted records are never rewritten; superseding decisions create new ADRs.

## FCP (Final Comment Period)

A time-boxed period (typically 7–14 days) before an RFC is formally accepted or rejected, giving all stakeholders a final opportunity to raise objections or concerns.

## Rough Consensus

A decision-making model (originating from IETF) where the goal is not unanimity but rather addressing all substantive technical objections. A decision proceeds when remaining disagreements have been heard, considered, and documented—not when everyone is satisfied.

## Lazy Consensus

A lightweight decision model where a proposal is considered accepted if no objections are raised within a defined waiting period. Suitable for low-risk, reversible changes.

## Bus Factor

The minimum number of people who would need to become unavailable before a project or system becomes unmaintainable. A bus factor of 1 means critical knowledge exists in only one person's head—an unacceptable risk for long-lived systems.

## Gate

A checkpoint in a project lifecycle where specific criteria must be met before work can proceed to the next phase. Gates prevent premature advancement of immature or under-validated work.

## Milestone

A significant checkpoint marking the completion of a set of deliverables or the achievement of specific project goals within a timeline.

## Moonweave Maturity (M0–M9)

The project's internal maturity scale for work items, ranging from M0 (idea) through M5 (production) to M9 (retired). Each level carries specific requirements for documentation, testing, ownership, and operational readiness.

## Security Level (S0–S5 + Blocked)

The project's internal risk classification system. S0 is lowest risk (documentation); S5 is highest operational risk (embodied systems with physical consequences). "Blocked" means work cannot proceed until compliance issues are resolved.

## Stop-Ship

A condition that prevents any release or deployment from proceeding. Triggered by unresolved security vulnerabilities, data breaches, safety failures, or compliance violations that exceed acceptable risk thresholds.

## Postmortem

A structured review conducted after a significant incident, focused on understanding what happened, why, and what systemic improvements will prevent recurrence. Postmortems are blameless—they target processes and systems, not individuals.
