# Quality Assurance Standards

> This document defines the quality assurance system for software, AI Agents, frontend and backend systems, infrastructure, data pipelines, model services, research experiments, embodied control systems, and public assets in the Kaguya Project. Quality assurance is not a testing phase before release, but a continuous evidence system spanning design, implementation, review, build, release, operation, feedback, and retirement. An engineering deliverable may be merged, released, deployed, published, or enter long-term maintenance only when its quality evidence is sufficient to support the corresponding risk level and lifecycle commitment.

This document does not replace:

- `01-Workflow.md`: defines how engineering work progresses;
- `01-Foundation/02-Security-Ethics.md`: defines hard bottom lines for security, privacy, and ethics;
- `standards/*`: defines specific implementation standards for each technology stack.

The relationship with the above documents is: Workflow defines process nodes, Security-Ethics defines non-negotiable boundaries, Quality-Assurance defines **at each node, what evidence is sufficient to prove the system is correct, reliable, secure, maintainable, observable, releasable, operable, and retirable**.

---

## 1. Purpose and Scope

This document answers one core question: on what basis is Kaguya Project engineering output considered "deliverable"?

The answer is not intuition, not verbal confirmation, not "it ran locally"—but inspectable, traceable, automatable evidence. This evidence system covers the full lifecycle from design review to operational monitoring, with different evidence strength assigned by risk level.

Applies to code, services, data, models, Agents, protocols, frontend and backend systems, infrastructure, embodied control systems, and publicly released assets in all formal Kaguya Project repositories.

The overall framework draws on NIST SSDF secure development lifecycle thinking, Google Testing large-scale verification systems, Kubernetes Production Readiness Review feature production readiness mechanisms, ROS 2 REP-2004 package quality declarations, and Google SRE operational reliability management—the common thread: quality cannot rely on pre-release checks alone but must span the lifecycle.

---

## 2. Quality Principles

Eight principles, specifically governing quality judgment:

1. **Quality is evidence, not feeling** — Any system called "usable," "stable," "secure," or "complete" must have inspectable evidence. Test results, evaluation reports, Review records, operational metrics, security scans, model cards, simulation records, and incident postmortems all count as evidence; "should be fine" and "ship first, fix later" do not.

2. **Risk determines quality intensity** — Short lifecycle, reversible, low-impact changes get lightweight verification; long-term, cross-system, irreversible changes involving security / privacy / AI / embodiment require stronger evidence. Evidence strength aligns with S0–S5 risk tiering in `02-Security-Ethics.md` §3.

3. **Shift testing left; do not skip operational verification** — Quality issues should be exposed as early as possible in design, static checks, unit tests, and Review. But post-launch monitoring, SLO, alerts, incident postmortems, and user feedback are also part of quality evidence—not "ops' problem."

4. **Many small tests, few large tests, end-to-end on critical paths** — Test mix builds on fast, deterministic, locatable lower-layer tests; integration tests verify boundaries; E2E covers only critical user journeys and high-risk regression paths. Pyramid proportions may be adjusted but must not be inverted.

5. **Flaky tests are defects themselves** — Tests that pass sometimes and fail sometimes under the same code and configuration destroy CI trust. Flaky tests must be fixed, isolated, or removed; long-term masking through repeated reruns is not allowed.

6. **Quality built into changes, not piled before release** — Testing, documentation, observability, rollback, migration, and security verification are normal parts of engineering changes, not last-minute patches before release.

7. **Quality issues must close the loop** — Bugs, regressions, incidents, evaluation failures, and embodied anomalies must be traced to root cause, supplemented with anti-regression mechanisms, and captured in tests, documentation, monitoring, or design constraints. Fixing symptoms without preventing recurrence equals not fixing.

8. **AI and embodied systems need additional quality dimensions** — AI systems cannot be judged by traditional software testing alone—behavior evaluation, adversarial testing, drift monitoring, and permission review are needed. Embodied systems cannot be judged by digital simulation alone—physical boundaries, hardware testing, human takeover, and E-Stop verification are needed.

---

## 3. Quality Objects and Quality Levels

### 3.1 QA Level

The Kaguya Project defines six quality levels for deliverables of different lifecycles and risk scenarios. It does not replace S0–S5 security levels but specifies the **minimum quality evidence strength** required at each level.

| Level | Name | Applicable Objects | Minimum Quality Evidence |
|-------|------|-------------------|-------------------------|
| **QA-L0** | Draft | Drafts, ideas, informal notes | Status label only, no release commitment |
| **QA-L1** | Experiment | Research spikes, one-off scripts, local experiments | Reproducibility record, data source description, expiration time |
| **QA-L2** | Maintained Component | Reusable libraries, CLI, SDK, internal tools | CI, unit tests, documentation, Owner, change records |
| **QA-L3** | Production Service | Networked services, stateful systems, data pipelines, public API | Integration tests, contract tests, SLO, monitoring, alerts, Runbook, rollback plan |
| **QA-L4** | AI / Agent System | Agent, RAG, model services, long-term memory, tool invocation | Eval Report, adversarial testing, data/model cards, permission review, behavior regression, drift monitoring |
| **QA-L5** | Embodied / Safety-Critical | Sensors, actuators, embodied control, high-DOF physical systems | Simulation, SIL/HIL, physical boundaries, E-Stop verification, HITL, incident drills, independent safety review |

Relationship between QA-L and S levels: S level defines security risk height; QA-L defines quality evidence breadth. Generally S3 corresponds to QA-L3, S4 to QA-L4, S5 to QA-L5, but a long-term service with low security risk should still maintain QA-L3 operational quality evidence.

### 3.2 Quality Level Declaration

All formal repositories or long-term components at QA-L2 and above should maintain `QUALITY.md`, declaring quality level, coverage scope, version strategy, test coverage, security measures, operational guarantees, known limitations, and review cycle. This declaration is the component's public quality commitment to dependents—if you claim QA-L3, your evidence must support all QA-L3 requirements.

ROS 2 REP-2004 uses a similar approach: packages claiming a quality level must prove they meet all conditions for that level in version strategy, change control, documentation, testing, and dependency management. The Kaguya Project adds specialized dimensions for AI/Agent and embodied systems on this foundation.

---

## 4. Quality Evidence System

The core of quality assurance is not process but evidence. The following categories answer "what counts as evidence":

| Evidence Type | Typical Form | Applicable Stage |
|---------------|--------------|------------------|
| Design evidence | RFC, ADR, Engineering Brief, Threat Model, Hazard Analysis | Before implementation |
| Implementation evidence | PR, Code Review records, CODEOWNERS Approval | Development |
| Automation evidence | CI reports, test reports, Coverage, static analysis results | Continuous |
| Security evidence | SAST, dependency scan, Secret Scan, ASVS Checklist, container scan | Continuous |
| Supply chain evidence | SBOM, SPDX, SLSA Provenance, signature, image digest | At release |
| Data evidence | Dataset Card, schema validation, drift report, dedup report, provenance declaration | On data change |
| Model evidence | Model Card, Eval Report, version records, Prompt/Policy snapshot | On model change |
| Operational evidence | SLO reports, monitoring Dashboard, logs, Tracing, alert records, incident Postmortem | In operation |
| User evidence | Usability testing, accessibility reports, feedback records, Core Web Vitals | After delivery |
| Embodied evidence | Simulation records, SIL/HIL logs, E-Stop tests, physical test records | Embodied system full lifecycle |

Principle: **Evidence type must match quality level**. QA-L2 need not have SLO reports; but QA-L3 without monitoring evidence cannot claim production readiness.

---

## 5. Quality Gates

Quality gates are continuous checkpoints from design to operation, not a one-time big check before release.

### Gate Q0: Quality Planning

All QA-L2 and above items must answer before implementation: current quality level, risk level, test strategy, required Reviews, required evidence, release gates, rollback method, and responsible party. This information should go in Engineering Brief or Issue.

### Gate Q1: Design Quality

Applies to public API, long-term state systems, new infrastructure, data pipelines, Agent behavior, model services, embodied control, and migrations hard to roll back. Review points include whether problem definition is clear, invariants are defined, failure modes are identified, compatibility strategy is explicit, test and observability plans are executable, and rollback strategy exists.

Kubernetes KEP requires each enhancement proposal to answer these in Test Plan, Graduation Criteria, and Production Readiness Review upfront. Kaguya Project Design Quality Review is a simplified version of the same approach.

### Gate Q2: Implementation Quality

Quality checks at PR stage. Core logic has tests, error handling is explicit, new dependencies have provenance and license, public contract changes are synced, CI passes, Review complete. Consistent with Google Code Review standards: changes should continuously improve overall codebase health.

### Gate Q3: CI Quality Gate

Hard gate for automated verification. Baseline includes format, lint, typecheck, unit test, integration test, build, dependency scan, secret scan, license check. High-risk items add contract tests, E2E, migration dry run, benchmark, security tests, AI eval, data validation, simulation tests, and rollback tests. CI failure must block merge; verbal approval is not allowed.

### Gate Q4: Release Quality Gate

Final confirmation before release. All blocking defects closed, Release artifact traceable, SBOM / provenance generated, monitoring and alerts in place, rollback plan available, Owner accepts operational responsibility. High-risk releases also require Security Reviewer and AI/embodied specialized Reviewer sign-off.

Google SRE Production Readiness Review and Kubernetes PRR require features to prove observability, scalability, supportability, and rollback before entering production. Kaguya Project Release Quality Gate directly applies this approach.

### Gate Q5: Operational Quality Gate

Continuous quality verification after launch. Health check, smoke test, error rate, latency, resource usage, logs, tracing, alert noise, SLO burn rate, rollback readiness are all operational quality evidence. Deployment is not the quality endpoint—operational feedback is the final link in evidence.

---

## 6. Test Layering Strategy

### 6.1 Test Pyramid

```text
Static Checks         ← Fastest, most, cheapest
  ↓
Unit Tests
  ↓
Component Tests
  ↓
Integration Tests
  ↓
Contract Tests
  ↓
E2E Tests
  ↓
Performance Tests
  ↓
Security Tests
  ↓
AI / Agent Evaluations
  ↓
Simulation / HIL
  ↓
Post-deploy Checks    ← Slowest, fewest, most expensive
```

Principle: lower layers have more, faster, more deterministic tests; upper layers have fewer, slower, more critical tests. The Kaguya Project retains Google Testing Blog empirical ratio (~70/20/10) as initial reference but allows adjustment by system characteristics—provided the pyramid is not inverted.

### 6.2 Static Checks

Exclude low-level errors at lowest cost before running tests: formatting, lint, type checking, dead code detection, dependency policy, license scanning, secret scanning, API schema consistency checks. All formal repository CI must include complete static checks.

### 6.3 Unit Tests

Verify pure functions, domain logic, state transitions, serialization, error handling, permission checks, and data transformation. Requirements: fast, deterministic, no real network or external services, no dependence on personal local environment. If a test needs a real database or model service to run, it is not a unit test.

### 6.4 Component Tests

Verify boundary behavior of a single module: frontend components, backend handlers, Agent tool wrappers, data validators, state machine components. Component tests verify module interface contracts, not internal implementation details.

### 6.5 Integration Tests

Verify multi-module collaboration: API + database, service + message queue, frontend + mock backend, Agent + tool sandbox, RAG + vector store, multi-stage data pipeline, ROS node communication. Integration tests expose boundary issues unit tests cannot find.

### 6.6 Contract Tests

The Kaguya Project emphasizes frontend-backend unification and domain contract unification, so contract tests have special status. Applies to OpenAPI / gRPC / GraphQL schema, frontend generated types, backend implementation consistency, Event schema, state machine transition rules, Agent tool interface, and ROS message/service/action.

Core rule: **Public contract changes must accompany contract tests. Breaking changes must have RFC, migration notes, and version strategy.**

### 6.7 E2E Tests

Cover only critical user journeys, core business flows, and high-risk regression paths. E2E should be few and critical—do not replace lower-layer tests with many fragile E2E tests. Playwright Trace Viewer can record DOM snapshots, network requests, and screenshots, suitable as E2E failure evidence archive in CI.

### 6.8 Performance Tests

Apply to API services, runtime schedulers, vector retrieval, model inference, long-context processing, frontend rendering, robot control loops, and data pipelines. Minimum metrics: latency p50/p95/p99, throughput, error rate, resource consumption, cold start, degradation behavior. Google SRE stress testing principles apply: help quantify confidence in future system reliability.

### 6.9 Security Tests

Dependency scanning, SAST/CodeQL, authentication authorization tests, input validation, injection protection, SSRF protection, rate limiting, container scanning. Web/API services minimum reference OWASP ASVS.

### 6.10 AI / Agent Evaluations

Traditional tests cannot cover AI behavior—evaluation systems are needed. See §13.

### 6.11 Simulation / HIL

Pre-physical verification for embodied systems. See §14.

---

## 7. Static Quality and Code Health

### 7.1 Static Check Baseline

All formal repositories must run in CI: formatting, lint, type checking, unused dependency detection, prohibited dependency policy, generated file consistency, API schema diff, license metadata, and secret scanning. These check failures must block merge.

### 7.2 Code Health

Code health is more than "no lint errors." Review and ongoing maintenance should focus on: correctness, readability, simplicity, module boundary clarity, dependency direction reasonableness, error handling completeness, concurrency safety, resource release, testability, observability, and documentation sync.

Google's definition of Code Health is a suitable direction: make code easier to understand, libraries simpler, iteration shorter, stability and performance better. Kaguya Project Code Review should target long-term code health, not perfection of a single commit.

---

## 8. Review Quality

`01-Workflow.md` defines Review process; this section defines what Review should check.

### 8.1 Reviewer Check Dimensions

1. Does the change solve the right problem;
2. Does the approach fit existing architecture and domain model;
3. Is complexity justified by necessity;
4. Do tests cover core behavior and failure paths;
5. Does it break public contracts or compatibility;
6. Does it introduce security, privacy, supply chain, or data risk;
7. Does it affect operation, release, rollback, or monitoring;
8. Is documentation synced;
9. Should RFC / ADR come first;
10. Does it introduce quality debt needing tracking.

### 8.2 Review Conclusions

Review is not only "approve" and "reject." Conclusions should clearly guide follow-up action: Approve, Request Changes, Needs RFC, Needs Security Review, Needs AI Eval, Needs Embodiment Safety Review, Needs Owner Decision.

### 8.3 Specialized Review for High-risk Changes

| Change Scenario | Additional Review Requirements |
|-----------------|-------------------------------|
| Public API / Schema | API Owner + affected client representative |
| Data processing / privacy | Data Owner + Privacy Reviewer |
| Model / Agent behavior | AI Eval Reviewer + Security Reviewer |
| Embodied control | Embodiment Safety Reviewer |
| Production service | Infra / SRE Reviewer |
| Supply chain / release artifacts | Security / Release Reviewer |

Ordinary Review ensures code health; specialized Review ensures high-risk changes do not leave gaps in professional blind spots.

---

## 9. CI/CD Quality Gates

CI is the automated production line for quality evidence. Standardize workflow structure rather than letting each repository freestyle.

### 9.1 Baseline CI

Every formal repository must include: metadata validation, locked dependency install, format check, lint, type check, unit tests, integration tests, build, artifact upload. All must pass before merge.

### 9.2 Security CI

Independent security workflow: secret scanning, dependency review, SAST/CodeQL, license check, container scanning (if applicable), SBOM generation. Security CI failures cannot be overridden for engineering efficiency—missing security evidence equals quality not meeting standard.

OWASP SAMM divides security capability into Governance, Design, Implementation, Verification, and Operations; Kaguya Project security CI covers automated verification portions of Implementation and Verification.

### 9.3 Release CI

Release workflow: version validation, Changelog check, artifact build, SBOM and provenance generation, signing, release candidate, staging deployment, smoke test. Release CI may only trigger from protected branch or tag.

### 9.4 Nightly / Scheduled CI

Low-frequency but deep quality verification: slow tests, full regression, performance benchmark, AI eval suite, data drift check, dependency update dry run, flaky test detection. Too slow for PR-level trigger but indispensable to overall quality baseline.

---

## 10. API, Protocol, and Contract Quality

The Kaguya Project spans frontend, backend, Agent, Infra, data, and embodied execution; contract consistency is the foundation of cross-system reliability.

### 10.1 Contract Quality Requirements

- Schema has authoritative source (OpenAPI / Proto / GraphQL SDL);
- API has version strategy and deprecation window;
- Error format consistent across services;
- Breaking change has automatic detection and RFC process;
- Frontend types generated from contracts, not hand-written;
- Event / Message has compatibility validation;
- State machine transition rules have formalized tests;
- Deprecated fields have explicit migration timeline.

### 10.2 Contract Testing Methods

Recommended combination: schema diff automatic comparison, generated client compile test, consumer-driven contract test, backward compatibility test, migration dry run, golden file snapshot, and conformance suite.

Kubernetes Conformance ensures different implementations support required APIs for interoperability. The Kaguya Project can establish its own conformance suite for public protocols and Agent Tool API to prevent drift across repositories and language implementations.

---

## 11. Frontend, Usability, and Accessibility Quality

Frontend quality is more than "page loads."

### 11.1 Frontend Quality Dimensions

Functional correctness, component consistency, state management correctness, API contract matching, accessibility (WCAG), performance (Core Web Vitals), responsive layout, error state handling, empty and Loading states, i18n readiness, visual regression.

### 11.2 Frontend Testing Requirements

Component tests cover independent component behavior; API mock / contract test ensures frontend-backend contract consistency; E2E covers core interaction paths; accessibility checks ensure keyboard navigation and assistive technology compatibility; performance budget ensures LCP, INP, CLS stay within limits.

Core Web Vitals sets LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 as good experience thresholds. Kaguya Project frontend projects should use this as performance baseline.

### 11.3 Usability Verification

Key interfaces should undergo usability verification, especially Agent state visualization, evaluation Dashboard, simulation control panel, and Onboarding flows. Core of usability testing is observing real user behavior and obstacles when performing tasks—ISO 9241-11 defines usability as the degree to which specific users achieve goals with effectiveness, efficiency, and satisfaction in a specific environment.

---

## 12. Backend, Service, and Operational Quality

### 12.1 Service Quality Dimensions

API correctness, data consistency, transaction boundaries, concurrency safety, timeout and retry strategy, idempotency, authentication authorization, rate limiting, resource isolation, observability, rollback and degradation, backup recovery, migration safety.

### 12.2 Backend Testing Requirements

Unit tests cover business logic; integration tests cover database interaction and external service calls; contract tests ensure API consistency; migration tests verify schema change safety; authorization tests verify permission boundaries; fault injection verifies degradation behavior; load tests verify capacity.

### 12.3 SLO and Operational Quality

All QA-L3 and above services should define SLO, at minimum covering availability, latency, and error rate. Data pipelines also need freshness SLO; storage systems need durability SLO. Each SLO should have corresponding error budget policy—actions when budget is exhausted cannot be blank.

Google SRE core insight: 100% reliability is neither realistic nor ideal. Value of SLO and error budget is establishing explicit, actionable balance between reliability and innovation speed. The Kaguya Project should progressively establish this system, not only add SLO after incidents.

---

## 13. Data, Model, and AI Agent Quality

This is the key chapter distinguishing the Kaguya Project from ordinary software projects. Traditional testing cannot cover AI system quality—evaluation, adversarial testing, drift monitoring, and behavior review are needed.

### 13.1 Data Quality

Quality gates for all formal datasets (training sets, evaluation sets, RAG document libraries, long-term memory data):

- **Provenance and license**: provenance clear, license compliant, no unauthorized protected expression;
- **Structural integrity**: schema fixed, types correct, missing rate controlled, no duplicate contamination;
- **Distribution health**: no abnormal drift, no train/eval leakage, sensitive fields labeled or de-identified;
- **Version control**: dataset has version, change records, retention policy.

TensorFlow Data Validation schema inference and drift detection can serve as reference implementation. Datasheets for Datasets proposed data documentation (motivation, composition, collection process, recommended use) should be minimum content for Kaguya Project Dataset Card.

### 13.2 Model Quality

Model or model service quality evidence: applicable scenarios, out-of-scope use, training data sources, evaluation data and metrics, subgroup performance differences, known limitations, robustness, calibration quality, inference latency and cost, drift trends, safety behavior, degradation strategy.

Model Cards require published models to include documentation on applicable boundaries, evaluation process, and limitations. Every formal model service in the Kaguya Project should maintain Model Card.

### 13.3 AI Production Readiness Check

Referencing Google ML Test Score thinking, the Kaguya Project defines four dimensions for AI production readiness:

**Data dimension**: schema fixed, training/evaluation set versions fixed, drift monitoring in place, leakage detection complete, provenance and license clear.

**Model dimension**: version fixed, evaluation results archived, performance baseline exists, regression suite exists, fallback strategy exists.

**System dimension**: inference latency monitoring, cost budget monitoring, error handling complete, input/output validation, release and rollback mechanisms in place.

**Monitoring dimension**: online quality metrics, drift detection, hallucination/uncertainty proxy metrics, user feedback loop, incident reporting mechanism.

All four dimensions must be met before an AI system can claim production readiness.

### 13.4 Agent Quality

Agent is not just a model—it is a behavioral system with tools, memory, policy, and permission boundaries. Agent quality must cover:

- System prompt / policy version control;
- Tool permission matrix review;
- Tool invocation correctness and refusal tests;
- Prompt injection adversarial regression;
- Memory read/write behavior tests and memory poisoning protection;
- RAG retrieval precision and recall;
- Long-context stability;
- Persona/behavior consistency;
- Uncertainty handling and refusal behavior;
- Dangerous action blocking;
- Cost/latency budget;
- Loop detection and human handoff;
- Audit log integrity.

OWASP LLM Top 10 lists Prompt Injection, Insecure Output Handling, Training Data Poisoning, etc. as important risks. Kaguya Project Agent quality gates must cover these known attack surfaces.

### 13.5 AI Eval Report

Every formal release of AI/Agent systems should produce an evaluation report recording: system version, evaluation scope, evaluation data source and version, task types, core metrics, comparison with baseline, regression status, security test results, manual review conclusions, final determination (Pass / Conditional Pass / Fail), known limitations, and follow-up Issues.

---

## 14. Embodied Intelligence and Physical Safety Quality

Errors in embodied systems have physical consequences—quality requirements must be stricter than pure software.

### 14.1 Embodied Quality Stages

```text
Design Hazard Analysis
  ↓
Simulation
  ↓
Software-in-the-loop (SIL)
  ↓
Hardware-in-the-loop (HIL)
  ↓
Controlled Physical Test
  ↓
Human-in-the-loop Operation
  ↓
Limited Autonomy
  ↓
Operational Acceptance
```

Each step requires quality evidence before proceeding to the next. Skipping steps is the most common failure mode in embodied safety.

### 14.2 Embodied Verification Requirements

- Hazard analysis covers all identified risk scenarios;
- Sensor validity and fault response verified;
- Actuator speed, force, and torque limits set and tested;
- Workspace boundaries defined and non-crossable;
- Collision handling strategy verified;
- System enters safe state on communication timeout;
- E-Stop effective in all scenarios;
- Humans can take over at any moment;
- All physical tests have complete log archive.

NASA software assurance standards require safety-critical software to reject out-of-order commands that could cause danger, detect memory modification and restore safe state, perform integrity checks on inputs and outputs. ISO/TS 15066 specifies safety requirements for collaborative robot systems. Kaguya Project embodied systems must build these constraints in at design stage, not patch after integration.

### 14.3 ROS / Robot Middleware Quality

If using ROS 2 or similar middleware, core packages and message interfaces should maintain Quality Declaration (refer to REP-2004), define QoS profile, verify message compatibility, test lifecycle state transitions, perform fault injection, verify latency budget and safety boundaries.

---

## 15. Security and Supply Chain Quality

This section overlaps with `02-Security-Ethics.md` but focuses on **verification evidence**—security policies live in security documents; security evidence belongs to quality assurance.

### 15.1 Security Verification Requirements

All formal repositories must execute: secret scanning, dependency scanning, dependency review, license check, SAST. Release artifacts additionally need: container scanning, SBOM generation, provenance records, artifact signing.

OpenSSF Scorecard can automatically check security heuristic metrics for open source projects. SLSA uses provenance to record build entity and process. Sigstore can sign and verify release artifacts. Kaguya Project formal releases should progressively reach SLSA Level 2, key systems target Level 3.

### 15.2 Web / API Security Verification

Web and API services minimum reference OWASP ASVS, covering authentication, authorization, session, input validation, output encoding, injection protection, file upload, logging, error handling, and rate limiting. Security testing is not optional add-on—it is necessary evidence for QA-L3 and above quality levels.

---

## 16. Release Quality and Production Readiness

### 16.1 Release Quality Report

Every formal release (non-Draft / non-experimental) should produce Release Quality Report recording: version and build information, test summary (pass status by layer), open defects, risk assessment and accepted risks, operational readiness (monitoring/alerts/Runbook/rollback), final determination (Go / No-Go / Conditional Go), and approval records.

### 16.2 Production Readiness Check

QA-L3 service production readiness minimum: all CI passed, integration and contract tests passed, data migration dry run passed (if applicable), monitoring and alerts configured, SLO defined, Runbook complete, rollback plan verified, Backup Owner confirmed, security scans passed.

QA-L4 AI/Agent services additionally need: model/prompt/policy versions fixed, Eval Report complete, Prompt Injection tests passed, tool permission matrix review complete, behavior regression passed, rollback/disable mechanisms available.

QA-L5 embodied systems additionally need: Hazard analysis complete, simulation and SIL/HIL tests passed, physical boundaries defined, sensor fault tests passed, HITL available, E-Stop verification passed, independent safety Reviewer approval.

Kubernetes Release Cycle Code Freeze and documentation review stages are good examples of quality control—features need test plans and production readiness review completed in advance, not patched at final release. Kaguya Project formal version releases should adopt this freeze and check mechanism.

---

## 17. Defect, Regression, and Incident Loop

### 17.1 Defect Lifecycle

```text
Report → Triage → Reproduce → Classify → Root Cause → Fix → Regression Test → Release → Verify → Close
```

Each stage has an Owner; defects must not linger indefinitely at any stage.

### 17.2 Defect Tiering

| Level | Meaning | Response Requirements |
|-------|---------|----------------------|
| **P0** | Production outage, security breach, embodied danger, data corruption | Immediate handling |
| **P1** | Critical function unavailable, severe regression, major privacy risk | Priority fix |
| **P2** | Important function abnormal, workaround exists | Normal iteration fix |
| **P3** | Small bug, documentation issue, low-impact experience issue | Handle within maintenance plan |
| **P4** | Improvement suggestion, cleanup item | Backlog |

### 17.3 Fixes Must Compensate Quality Evidence

Bug fix is not "done when changed." Each fix should at minimum add one of: regression test, stronger validation, clearer error message, better logging, documentation update, monitoring alert, or Runbook entry. Fixing a bug without adding defenses equals waiting to fall in the same place again.

### 17.4 Flaky Test Governance

Flaky test handling process: detect → label → assign Owner → isolate (only when necessary) → fix or remove → re-enable → track recurrence.

Rules: Flaky tests must not long-term block main; isolation must have Owner and fix SLA; habitual rerun masking instability is not allowed; flaky tests on high-risk paths must be fixed with priority.

---

## 18. Quality Metrics

Quality metrics are for discovering systemic issues, improving process, and reducing risk—not for mechanically ranking individuals or punishing contributors.

### 18.1 Recommended Metrics

| Category | Key Metrics |
|----------|-------------|
| Code quality | lint/typecheck failure rate, review defect density, complexity hotspots |
| Test quality | test pass rate, flaky test rate, coverage trend |
| Defect quality | escaped defect rate, regression rate, P0/P1 count, time to fix |
| Delivery quality | lead time, deployment frequency, change failure rate, recovery time |
| Operational quality | availability, latency, error rate, SLO burn, incident count |
| Security quality | open critical vulnerabilities, secret leaks, dependency age, SBOM coverage |
| Data quality | schema violation rate, drift events, contamination incidents |
| AI quality | eval pass rate, hallucination proxy, unsafe output rate, tool-call failure rate |
| Embodied quality | simulation pass rate, near-miss count, E-Stop test pass rate |
| User quality | task success rate, accessibility issues, Core Web Vitals, support issue volume |

DORA uses deployment frequency, lead time, change failure rate, and time to restore as core delivery and stability metrics. The Kaguya Project should progressively establish observability for these four metrics across all QA-L3+ services.

---

## 19. Quality Exceptions and Quality Debt

Exceptions must be allowed—but exceptions cannot be free.

### 19.1 Quality Exception

Quality exception conditions: has Owner, has rationale, has impact scope, has temporary mitigation, has expiration time, has review date. Must not breach security, privacy, legal, embodied safety, or unauthorized asset bottom lines. Each exception must have corresponding tracking Issue.

### 19.2 Quality Debt

Quality debt includes: missing tests, missing documentation, missing monitoring, outdated dependencies, flaky tests, manual deployment, no rollback plan, no Owner, insufficient model evaluation, incomplete data provenance, insufficient embodied simulation coverage.

Rule: Quality debt must not exist only in PR comments and personal memory—it must enter Issue / Project as trackable work items. High-risk quality debt (affecting security, production, or embodied safety) must have fix SLA.

---

## 20. Tools, Automation, and Agent Assistance

### 20.1 Kaguya QA Sentinel

The Kaguya Project may deploy QA Sentinel Agent to assist quality assurance: aggregate CI failure trends, flag flaky tests, generate Release Quality Report drafts, check PRs missing test descriptions or contract tests, check AI changes missing Eval Report, check data changes missing Dataset Card, check embodied changes missing simulation logs, generate weekly Quality Digest.

> QA Sentinel may remind, summarize, check, and generate reports; it must not automatically approve PR, bypass CI, delete failing tests, or replace specialized Reviewer judgment. Agent assists quality; it does not adjudicate quality.

### 20.2 Automation Strategy

- All automatable checks should run in CI, reducing Review burden of low-level errors;
- Contract checks, schema diff, dependency review should automatically trigger comments or labels;
- Performance regression and AI eval regression should automatically generate comparison reports attached to PR;
- Quality metrics should be automatically collected and visualized regularly, not manually counted;
- Alert noise and flaky test trends should be automatically tracked and notify Owner.

---

## 21. Templates and Checklists

The following templates are supporting deliverables of the Kaguya Project quality assurance system. Specific template content iterates with engineering practice and may go in `templates/` or `05-Knowledge/`:

- `QUALITY.md` — Quality level declaration
- Test Plan — Test plan
- Release Quality Report — Release quality report
- AI Evaluation Report — AI evaluation report
- Dataset Card — Dataset documentation
- Model Card — Model documentation
- Embodiment Test Report — Embodied test report
- Flaky Test Report — Flaky test report
- Defect Report — Defect report
- Quality Exception — Quality exception request
- Post-release Review — Post-release review

---

## 22. Anti-patterns

The following are quality assurance anti-patterns:

1. Understanding QA as "run a round of tests before release";
2. Only E2E, no unit, integration, or contract tests (inverted pyramid);
3. Masking flaky tests through repeated reruns without fixing;
4. CI failure verbally approved or merge bypassed;
5. Prototype with no quality gates entering production dependencies directly;
6. Public API changes without contract tests and compatibility validation;
7. Datasets without provenance, license, or schema checks;
8. Models judged only by benchmark scores, not failure modes and safety behavior;
9. Agent granted new tool permissions without permission matrix tests;
10. RAG system without retrieval quality verification and contamination detection;
11. Embodied system passing simulation only then opening physical actions directly;
12. Bug fix without regression test;
13. Release without rollback plan and operational readiness confirmation;
14. No monitoring after launch, no alerts, no Runbook;
15. Quality debt exists only in verbal agreements and PR comments;
16. Treating test coverage as quality itself (high coverage ≠ high quality);
17. Long-term lowering of quality baseline for speed without tracking cost;
18. AI-generated tests with no one understanding behavior or verifying correctness.

---

## 23. Revision

This document may only be revised through public RFC. Revisions must state whether quality requirements were proven too heavy or too light, new system types lack coverage, or a rule was proven to hinder rather than protect engineering health in practice. Consistent with "Conflict and Revision" in `01-Foundation/01-Principles.md`: when this document conflicts with security review or organizational authority, the corresponding specialized document takes precedence; when conflicting with legal or security ethics bottom lines, the bottom line takes precedence. Previous versions are stored in version control and are always retrievable.

The hard core of this document has only five points:

1. Every formal asset must declare quality level.
2. Every quality level must have minimum evidence requirements.
3. Every high-risk change must pass corresponding quality gates.
4. Every defect and incident must be captured as anti-regression mechanism.
5. Every AI / Agent / embodied system must have specialized quality evidence beyond traditional software testing.

Upholding these five points enables the Kaguya Project to stably transition from experiments and demos into a long-term maintainable, releasable, auditable, operable engineering system.
