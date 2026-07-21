# RFC Process

> This document is the formal decision process for major changes in the Kaguya Project—not an ordinary "proposal template." When an idea affects long-term architecture, public interfaces, cross-repository contracts, AI Agent behavior, security boundaries, embodied control, organizational governance, or long-term maintenance responsibility, it must complete public argument, review, decision, archival, and implementation tracking through the RFC process. Small changes go through Issue / PR; large changes go through structured design and community review first.

---

## 1. Purpose

RFC is the formal mechanism for the Kaguya Project to handle major changes. It publicly articulates problem, approach, trade-offs, risks, migration, and responsibility before implementation, leaving traceable decision records for long-term evolution.

This document answers: which changes require an RFC, which do not, who may initiate, who drives, who reviews, who decides, how to discuss, when to enter Final Comment Period, what consensus means, what acceptance implies, how to track implementation, and whether RFCs may be modified.

---

## 2. Relationship with Other Collaboration Mechanisms

| Mechanism | Purpose |
| --------- | ------- |
| **Issue** | Specific problems, tasks, bugs, requirement discussion |
| **Discussion** | Early ideas, open questions, community feedback |
| **Planning** | Project advancement from Idea to Prototype / Engineering / Release |
| **RFC** | Formal proposal, argument, and decision for major changes |
| **ADR** | Record of architecture decisions already made |
| **Design Doc** | Detailed engineering design under an accepted direction |
| **PR** | Code, documentation, or configuration implementation |
| **Release Note** | Explanation of published changes to users and maintainers |

One-sentence boundary:

> RFC records "whether we should do this, and why." ADR records "what architecture decision we have made." Design Doc records "how to implement specifically." PR records "what the actual change is." Release Note records "what impact on users."

Accepted / Rejected / Superseded / Final RFCs should not be substantially modified in principle—they are historical records; formal behavior should be maintained in corresponding standards, specifications, or ADRs.

---

## 3. When an RFC Is Required

If **any** condition is met, RFC is **required**:

1. Changes public API, protocol, Schema, state machine, or domain contract;
2. Introduces new long-term infrastructure, runtime, scheduling system, data pipeline, or model service;
3. Spans two or more repositories, Areas, or team responsibility domains;
4. Introduces, replaces, or deprecates core technology stack, framework, model, database, messaging system, or deployment model;
5. Affects security, privacy, permissions, data retention, long-term memory, or compliance boundaries;
6. Introduces highly autonomous Agent behavior, tool invocation permissions, long-term memory writes, or external system write operations;
7. Affects embodied terminals, sensors, actuators, simulation-to-reality migration, or physical safety;
8. Causes breaking changes, migration cost, compatibility risk, or long-term maintenance responsibility;
9. Modifies organizational governance, role permissions, principles, security-ethics boundaries, or community rules;
10. Establishes external commitments such as public standards, SDK, protocol, long-term Roadmap, formal release capabilities;
11. Introduces high-cost, hard-to-rollback, or strongly bound architecture choices;
12. Deprecates, replaces, or archives core systems or public capabilities.

---

## 4. When an RFC Is Not Required

Usually no RFC needed for:

1. Fixing clear bugs without changing public behavior or compatibility;
2. Documentation, spelling, formatting, example, comment improvements;
3. Local refactoring without changing external semantics;
4. Test additions, CI optimization, static analysis improvements;
5. Local performance optimization without architecture, side effects, or compatibility changes;
6. Affects single repository internal implementation only, with explicit Owner agreement;
7. Implementation details already covered by existing RFC / ADR.

> If unsure whether RFC is needed, default to creating an RFC Triage Issue for corresponding Owner / Maintainer judgment.

---

## 5. RFC Types

| Type | Purpose | Decision responsibility |
| ---- | ------- | ----------------------- |
| **Engineering RFC** | Architecture, infrastructure, services, toolchain, engineering standards | Maintainer Council / Area Maintainer |
| **API / Protocol RFC** | Public API, Schema, protocol, state machine, compatibility strategy | API Owner + related Area Owner |
| **AI System RFC** | Agent architecture, model lifecycle, tool invocation, memory, evaluation | AI Systems Owner + Security Reviewer |
| **Embodiment RFC** | Embodied terminals, simulation, sensors, actuators, physical action permissions | Embodiment Owner + Safety Reviewer |
| **Research RFC** | Long-term research direction, evaluation benchmarks, dataset standards, reproduction protocol | Research Owner |
| **Security / Ethics RFC** | Security boundaries, privacy rules, high-risk behavior, disclosure mechanism | Security Owner + Stewardship Council |
| **Governance RFC** | Principles, organization, roles, community rules, process revision | Stewardship Council |
| **Informational RFC** | Background, survey, direction documentation—does not directly produce mandatory standards | Record only, no mandatory decision |

---

## 6. Roles

### 6.1 Author

Primary writer of the RFC. Responsibilities: Write RFC; Collect background, data, alternatives, and risks; Respond to Review; Maintain RFC status; Record resolved and unresolved issues.

### 6.2 Champion

Driver of the RFC. Author may be Champion but need not be. Responsibilities: Judge whether RFC is worth advancing; Organize discussion; Coordinate Reviewers; Drive entry to FCP; Assist consensus; Ensure results archived. Every RFC must have a champion.

### 6.3 Sponsor

Person helping author enter the process—especially suitable for external contributors or newcomers. Responsibilities: Judge whether proposal suits RFC; Help author understand process; Help find correct Reviewers; Ensure RFC not blocked unnecessarily by format and process issues.

### 6.4 RFC Editor

Responsible for process and format—not technical adjudication. Responsibilities: Assign RFC number; Check template completeness; Maintain status fields; Maintain RFC Index; Assist archival, rename, link implementation Issues; Ensure RFC metadata searchable. Initial review focuses on structure, format, title, language, and completeness—not technical acceptance.

### 6.5 Required Reviewers

Assigned per RFC type and risk level. Minimum rule:

> Every RFC requires at least: 1 related Area Reviewer; 1 Owner or Maintainer; 1 non-author Reviewer. If involving security, privacy, AI Agent, long-term memory, embodiment, public protocol, or breaking changes, corresponding specialized Reviewer must be added. Assigned Reviewers should not be proposal text authors and must have relevant expertise.

### 6.6 Decision Owner

Final adjudicator or adjudicating organization:

- Single-Area RFC: Corresponding Area Owner / Maintainer decides;
- Cross-Area RFC: Maintainer Council decides;
- Security / Ethics RFC: Security Owner + Stewardship Council decides;
- Governance RFC: Stewardship Council decides;
- Major dispute unable to converge: Stewardship Council final decision.

---

## 7. Lifecycle Status

```text
Idea → Pre-RFC → Draft → Review → Final Comment Period
  → Accepted / Rejected / Deferred / Withdrawn
  → Active / Implementable → Implemented / Final
  → Superseded / Obsolete
```

| Status | Meaning |
| ------ | ------- |
| **Idea** | Not yet formed as RFC—early idea only |
| **Pre-RFC** | Confirmed RFC may be needed—collecting background and scope |
| **Draft** | RFC draft formed but not yet formally reviewed |
| **Review** | RFC passed format check—entered formal review |
| **Final Comment Period (FCP)** | Final comment period—last collection of blocking objections |
| **Accepted** | Direction accepted—may enter implementation planning |
| **Rejected** | Rejected—reason must be recorded |
| **Deferred** | Deferred—usually missing Owner, evidence, resources, or timing |
| **Withdrawn** | Author actively withdrew |
| **Active / Implementable** | Accepted and entered implementation tracking |
| **Implemented / Final** | Landed and verified |
| **Superseded** | Replaced by subsequent RFC |
| **Obsolete** | No longer applicable—historical record only |

---

## 8. Submission Process

```text
Pre-RFC Issue → Draft Markdown → RFC PR → Editor Check → Review → FCP → Decision → Merge / Close → Implementation Tracking
```

### 8.1 Pre-RFC

Entry points: GitHub Discussion; GitHub Issue; Planning Discovery; Research Log; Incident Postmortem; Security Review; Maintainer proposal; Community feedback; Agent-discovered architecture gaps.

Pre-RFC goal is not a complete proposal but to confirm: Is RFC truly needed; Is problem clear; Is impact scope sufficiently major; Are duplicate RFC / ADR / Issue already present; Are obvious security, compliance, or provenance blocks present; Can Champion / Sponsor / Owner be found. Validate idea publicly before formal writing to avoid author investing heavily in obviously inapplicable or duplicate ideas.

### 8.2 Draft

Recommended naming: `05-Knowledge/rfc/0000-short-title.md` (may use `drafts/` before numbering), after acceptance change to `05-Knowledge/rfc/0007-short-title.md`.

Numbering rules: RFC number assigned by RFC Editor; draft stage uses 0000; after formal Review or Accepted use fixed number; once assigned, number must not be reused.

### 8.3 Submit

1. Author creates Markdown file from RFC template;
2. Submit to `moonweave-guidelines` repository;
3. Open RFC as Pull Request;
4. PR title uses `[RFC] short title`;
5. PR must link Pre-RFC Issue / Discussion / Planning item;
6. RFC Editor checks format and metadata;
7. After format check pass, enter Review.

Use PR not Issue: Clear version history; Comments can occur paragraph by paragraph; Review status visible; CODEOWNERS can request related Reviewers; Merge expresses formal archival.

---

## 9. Review Requirements

Review focuses on problem, trade-offs, and risk—not polishing alone. Must check: Is problem real; Are goals and non-goals clear; Is approach sufficiently concrete; Are alternatives seriously compared; Are security, privacy, compliance, IP risks explained; Are AI / Agent risks explained; Are embodiment risks explained; Are migration, compatibility, rollback feasible; Are testing, evaluation, observability feasible; Are Owner, DRI, implementation path clear; Should it split into multiple RFCs.

### Review Matrix

| RFC type | Required review |
| -------- | --------------- |
| Engineering RFC | Area Maintainer, Owner, at least 1 independent Reviewer |
| API / Protocol RFC | API Owner, frontend representative, backend representative, compatibility Reviewer |
| AI System RFC | AI Owner, Security Reviewer, Evaluation Reviewer, Data/Memory Reviewer |
| Embodiment RFC | Embodiment Owner, Safety Reviewer, Hardware/Simulation Reviewer, Security Reviewer |
| Research RFC | Research Owner, Reproducibility Reviewer, Data Reviewer |
| Security / Ethics RFC | Security Owner, Privacy Reviewer, Stewardship Council |
| Governance RFC | Stewardship Council, Maintainer Council, Community Reviewer |

Cross-cutting review for Security, Privacy, AI Safety, Embodiment Safety, Architecture, Community Impact—should be sought continuously during RFC maturation, not patched at the end.

Hard rules:

> Author must not be the sole Reviewer. Champion must not unilaterally decide their own RFC. RFCs involving security, privacy, embodiment, personal safety risk, or unauthorized assets must not bypass specialized review through ordinary technical majority opinion.

---

## 10. Final Comment Period

FCP is "final comment period"—not reopening unlimited discussion.

**Trigger**: When Decision Owner believes RFC is sufficiently mature and major issues handled, FCP may be initiated.

**Recommended duration**:

- Ordinary RFC: 7 calendar days;
- Cross-Area / API / Infra RFC: 10–14 calendar days;
- Security / AI / Embodiment / Governance RFC: 14–21 calendar days;
- Emergency RFC: May shorten but must state reason.

**Before FCP starts there must be a summary comment**: Current approach; Resolved issues; Accepted trade-offs; Rejected alternatives; Known risks; Unresolved objections if any; Expected decision (Accept / Reject / Defer). Major modifications may trigger new FCP.

---

## 11. Consensus and Decision

Uses **Rough Consensus + Responsible Decision**:

```text
Sufficient discussion → Handle substantive objections → Record unresolved disagreements → Decision Owner decides → Appeal path preserved
```

**Consensus does not mean**: Majority vote; Everyone agrees; No comments; Silence auto-passes; Senior person decides; Author persists to win.

**Valid objection must be**: Specific; Understandable; Related to project principles, goals, risk, or facts; Able to explain why it blocks acceptance; Preferably with alternative, modification suggestion, or verifiable condition.

**Decision**: After FCP, Decision Owner makes `Accepted / Rejected / Deferred / Withdrawn / Needs Revision / Split Required`. Decision must be written in RFC PR final comment and recorded in RFC file:

```text
Decision:
Decision Owner:
Decision Date:
Resolution Link:
Accepted Trade-offs:
Rejected Alternatives:
Unresolved Concerns:
Follow-up Issues:
```

Consensus is not majority vote nor everyone satisfied; key is seriously handling substantive objections and explaining to dissenters why their concerns were not adopted. Counting approve/disapprove alone drowns important minority opinions in noise.

**Appeal path**: Dissatisfied with decision may escalate to next-level decision entity (Area → Maintainer Council → Stewardship Council); final appeal authority see `01-Organization.md` §12.

---

## 12. After Accepted

> RFC Accepted means direction accepted—may enter implementation planning only. It does not mean related code, configuration, model, service, or embodied behavior may bypass PR Review, security review, quality gates, or release process. RFC active is not rubber stamp—it does not guarantee final merge.

After Accepted must create or update: Implementation Issue; GitHub Project item; Owner / DRI; ADR (if architecture decision formed); standards documentation (if changing standards); release checklist (if affecting release); migration issue (if involving compatibility); security review issue (if involving security); evaluation issue (if involving AI / Agent); embodied safety checklist (if involving physical execution).

Forms "RFC → standard → implementation" three-stage chain: after acceptance create spec integration issue; after spec integration create backlog issues for related implementation.

---

## 13. Rejected / Deferred / Withdrawn

Rejection, deferral, and withdrawal must record reason and retain historical record:

- **Rejected**: Record rejection reason and rejected alternatives to avoid same dispute recurring.
- **Deferred**: Record deferral reason (missing Owner, evidence, resources, or timing) and re-evaluation conditions.
- **Withdrawn**: Author actively withdrew—record withdrawal reason.

Rejected RFCs remain in RFC Index as historical record and duplicate-prevention reference.

---

## 14. Revision, Deprecation, and Supersession

Accepted / Rejected / Superseded / Final RFCs should not be substantively modified in principle. If subsequent design changes significantly, submit Amendment RFC or new RFC and mark `superseded_by` in old RFC.

Permitted minor edits: Spelling; Links; Status; Implementation issue; ADR link; Release link; Comments not changing decision meaning.

Substantive revision must follow:

```text
Revision PR → Reviewer check → FCP if necessary → Decision Owner approval
```

---

## 15. RFC and ADR Relationship

> When RFC is accepted and leads to architecture decision, ADR must be generated or updated. RFC explains proposal process and trade-offs; ADR explains final architecture decision and consequences.

| RFC status | ADR action |
| ---------- | ---------- |
| Accepted Engineering RFC | Create ADR |
| Accepted API / Protocol RFC | Update API standard + possibly create ADR |
| Accepted AI System RFC | Update AI Systems standard + possibly create ADR |
| Accepted Embodiment RFC | Update Safety / Embodiment standard + create ADR |
| Rejected RFC | Usually no ADR, but retain RFC record |
| Superseded RFC | Update related ADR status |

---

## 16. Fast Track and Emergency Channels

### 16.1 Fast-track RFC

Applies when: Sufficient consensus already exists; Low risk; Small scope; Obvious fix to existing process gap; Does not involve security, privacy, embodiment, public protocol, or breaking changes.

Process: `Draft → Review → 3–5 day FCP → Decision`.

### 16.2 Emergency RFC

Applies when: Security incident; Production outage; Compliance risk; Embodiment risk; High-risk vulnerability; Major external dependency failure.

Rules: Emergency RFC may have temporary decision by Owner / Security Owner / Stewardship Council first, but must supplement RFC or ADR afterward recording background, risk, decision, alternatives, and follow-up fixes. High-risk release needs explicit checkpoints, but real engineering also needs traceable decision records in emergencies.

---

## 17. Platforms and Automation

### 17.1 GitHub

- RFC submitted as PR to `moonweave-guidelines`;
- RFC PR uses `[RFC]` prefix;
- All RFC PRs auto-enter `Moonweave RFC Pipeline` Project;
- Use labels for type, status, risk, and Area;
- Use CODEOWNERS to auto-request related Reviewers;
- FCP start and end marked by RFC Editor or Bot;
- After acceptance merge to `05-Knowledge/rfc/`.

Recommended labels:

```text
rfc / rfc:pre / rfc:draft / rfc:review / rfc:fcp / rfc:accepted / rfc:rejected / rfc:deferred / rfc:withdrawn
type:engineering / type:api-protocol / type:ai-system / type:embodiment / type:research / type:security / type:governance
risk:S0 ... risk:S5
area:agent / area:infra / area:frontend / area:backend / area:embodiment / area:research
needs:security-review / needs:privacy-review / needs:ai-safety-review / needs:embodiment-review / needs:owner / needs:decision
```

### 17.2 Feishu

Feishu does reminders, coordination, and meetings only—not source of truth. `mw-rfc-review` (review reminders), `mw-engineering` (engineering RFC notifications), `mw-security-private` (security-sensitive RFC), `mw-embodiment` (embodiment RFC review), `mw-announcements` (Accepted / Rejected / FCP announcements).

Rules: RFC conclusions formed in Feishu must write back to GitHub PR or RFC file. Feishu votes, reactions, verbal agreement cannot serve as RFC decision basis.

### 17.3 Notion

May maintain index and reading views but not RFC original source of truth: RFC Index; RFC Calendar; RFC Review Queue; RFC Decision Summary; Area RFC Map.

### 17.4 Agent: Kaguya RFC Steward

Functions: Check RFC template completeness; Flag missing Owner / Champion / risk_level; Auto-add RFC PR to Project; Request Reviewers by type and area; Remind FCP start, 48 hours remaining, end; Summarize open issues; Detect stale RFC; Generate decision summary draft; Create implementation issue draft after Accepted.

Limitations:

> Agent must not auto-accept, reject, or merge RFC. Agent must not replace Decision Owner. Agent must not leak security-sensitive RFC content to ordinary channels.

### 17.5 RFC Pipeline Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `RFC ID` | Text | RFC-0000 / RFC-0007 |
| `Status` | Single select | Pre / Draft / Review / FCP / Accepted / Rejected / Deferred / Active / Final |
| `Type` | Single select | Engineering / API / AI / Embodiment / Research / Security / Governance |
| `Risk` | Single select | S0–S5 |
| `Area` | Single select | Agent / Infra / Frontend / Backend / Embodiment / Research / Security |
| `Champion` | User/Text | Driver |
| `Decision Owner` | User/Text | Adjudicator |
| `Required Reviewers` | Text | Required review roles |
| `FCP Start` | Date | Final comment period start |
| `FCP End` | Date | Final comment period end |
| `Implementation Issue` | URL | Post-acceptance implementation tracking |
| `ADR` | URL | If architecture decision formed |
| `Next Review` | Date | Next review date |
| `Blocking Issues` | Text | Blocking issues |

---

## 18. Acceptance and Rejection Criteria

### 18.1 Acceptance Criteria

RFC may be accepted if and only if:

1. Problem is real and worth solving;
2. Proposal scope is clear;
3. Goals and non-goals are explicit;
4. Approach is sufficiently concrete to guide implementation;
5. Major alternatives have been compared;
6. Known risks recorded with mitigations;
7. Compatibility, migration, rollback strategy clear;
8. Required security, privacy, AI, embodiment, operations reviews complete;
9. Required Reviewers have reviewed;
10. Substantive objections handled, explained, or recorded;
11. Clear Owner / DRI;
12. Next steps after acceptance executable.

### 18.2 Rejection or Deferral Criteria

1. Problem invalid or insufficient evidence;
2. Approach too broad, not executable, or not verifiable;
3. Clearly violates principles, security ethics, or compliance boundaries;
4. No Owner / DRI;
5. Migration or maintenance cost clearly exceeds benefit;
6. Alternative clearly simpler or lower risk;
7. Substantive objections not handled;
8. Experiment, evaluation, or prototype validation needed first.

---

## 19. RFC Template

Template file at `05-Knowledge/rfc/0000-template.md` (or `templates/rfc-template.md`). Full structure:

```markdown
---
rfc: RFC-0000
title:
status: Draft
type: Engineering | API-Protocol | AI-System | Embodiment | Research | Security-Ethics | Governance | Informational
authors:
champion:
sponsor:
decision_owner:
area:
risk_level: S0 | S1 | S2 | S3 | S4 | S5
created:
updated:
fcp_start:
fcp_end:
decision_date:
related_issues:
related_prs:
related_adrs:
supersedes:
superseded_by:
---

# RFC-0000: Title

## 1. Summary
## 2. Motivation
## 3. Goals
## 4. Non-goals
## 5. Background
## 6. Proposal
## 7. Detailed Design
## 8. Alternatives Considered
## 9. Compatibility and Migration
## 10. Security, Privacy and IP Impact
## 11. AI / Agent Impact
## 12. Embodiment Impact
## 13. Observability and Operations
## 14. Test and Evaluation Plan
## 15. Rollout and Rollback Plan
## 16. Documentation and Education
## 17. Implementation Plan
## 18. Drawbacks and Risks
## 19. Unresolved Questions
## 20. Rejected Ideas
## 21. Decision (fill after FCP)
```

Template combines motivation, specification, rationale, compatibility, security, reference implementation, rejected approaches requirements, plus testing, graduation criteria, upgrade/downgrade, version deviation, and production readiness requirements; for Kaguya Project additionally AI / Agent, long-term memory, asset provenance, and embodiment safety impact.

---

## 20. Anti-Patterns

The following are RFC anti-patterns:

1. Using RFC to replace Issue for small problems;
2. RFC stacking abstract vision without executable approach;
3. Major architecture debate in PR bypassing RFC;
4. RFC without Owner / Champion;
5. RFC without alternatives;
6. RFC listing benefits only, not costs;
7. No implementation issue after RFC acceptance;
8. RFC Accepted treated as automatic merge permission for implementation;
9. Deciding RFC via Feishu vote or private chat;
10. Using silence as consensus;
11. Announcing acceptance with minority objections unhandled;
12. RFC long in Draft with nobody driving;
13. Leaving security, privacy, embodiment risk to implementation phase;
14. Major modification without restarting Review / FCP;
15. Rejected RFC without recorded reason causing same dispute to recur.

---

## 21. Core Rules and Revision

The 5 most important core rules:

1. Major changes RFC first, implementation second.
2. RFC must have Champion, Owner, Decision Owner.
3. Consensus is not voting; substantive objections must be handled and recorded.
4. Accepted means direction passed only—not automatic implementation merge.
5. RFC results must connect to ADR, Implementation Issue, Project, and Release.

This document may only be revised through Governance RFC (this process applying to itself). Consistent with "Conflict and Revision" in `01-Principles.md`: when this document conflicts with organizational permissions or security rules, corresponding specialized document takes precedence; when conflicting with legal or security-ethics baselines, baseline takes precedence. Previous versions stored in version control, always accessible.

This mechanism draws from Rust's lightweight Markdown RFC, Python's status and historical records, Go's "short issue first, design doc when needed", Kubernetes production readiness awareness, OpenTelemetry's "RFC → spec → implementation" chain, TC39 stage maturity and reviewer sign-off, and IETF rough consensus understanding—serving long-term evolution of the Kaguya Project, not creating formalization burden.
