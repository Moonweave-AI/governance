# Quality & Testing

Terms related to software quality assurance, testing strategies, and verification practices.

---

## Test Pyramid

A model for test distribution: many fast, isolated unit tests at the base; fewer integration tests in the middle; minimal slow E2E tests at the top. Approximate ratio: 70% unit / 20% integration / 10% E2E.

## Unit Test

A test that verifies a single function, method, or class in isolation. Must be fast, deterministic, and independent of network, databases, or external services.

## Component Test

A test that verifies a single module's boundary behavior (e.g., a UI component, API handler, or state machine) without testing internal implementation details.

## Integration Test

A test that verifies the interaction between multiple modules or services (e.g., API + database, service + message queue, Agent + tool sandbox).

## Contract Test

A test that verifies adherence to a shared interface specification (API schema, event format, state machine transitions). Ensures providers and consumers remain compatible.

## Consumer-Driven Contract Test

A contract testing approach where the consumer defines expectations, and the provider verifies it satisfies all consumer contracts. Prevents breaking changes from reaching dependents.

## E2E Test (End-to-End Test)

A test that exercises the full system from a user's perspective, typically through a browser or API client. Covers critical user journeys but is slow, expensive, and potentially flaky.

## Regression Test

A test specifically added to prevent a previously fixed bug from recurring. Every bug fix should include at least one regression test.

## Flaky Test

A test that produces inconsistent results (pass/fail) on the same code and configuration. Flaky tests erode CI trust and must be fixed, quarantined, or removed.

## Static Analysis

Automated code examination without execution: formatting, linting, type checking, dead code detection, dependency policy enforcement, and security pattern scanning.

## Code Coverage

The percentage of code lines, branches, or paths exercised by tests. A useful trend indicator but not a quality guarantee—high coverage does not ensure correctness.

## Mutation Testing

A technique that introduces small changes (mutations) to code and checks whether tests detect them. Measures test suite effectiveness beyond simple coverage metrics.

## QA Level (QA-L0 through QA-L5)

The Kaguya Project's quality evidence scale: L0 (draft), L1 (experiment), L2 (maintained component), L3 (production service), L4 (AI/Agent system), L5 (embodied/safety-critical). Each level requires progressively stronger quality evidence.

## Quality Gate

A checkpoint that must be passed before work advances. Examples: Gate Q0 (quality planning), Q1 (design review), Q2 (implementation review), Q3 (CI gate), Q4 (release gate), Q5 (operational gate).

## Conformance Test

A test suite that verifies an implementation correctly supports a specification. Used for public protocols, APIs, and cross-implementation interoperability.

## Golden File Test

A test that compares output against a known-good snapshot. Useful for detecting unintended changes in generated output, serialization, or API responses.

## Performance Test

Testing that measures latency, throughput, resource consumption, and degradation behavior under various load conditions.

## Load Test

A performance test simulating expected production traffic volumes to verify the system handles normal load without degradation.

## Stress Test

A performance test pushing the system beyond expected limits to identify breaking points, degradation behavior, and recovery characteristics.

## Smoke Test

A minimal set of tests run immediately after deployment to verify the system is fundamentally operational. Catches catastrophic deployment failures quickly.

## SLO (Service Level Objective)

A target for service reliability expressed as a percentage or threshold (e.g., "99.9% of requests complete within 200ms"). Defines what "reliable enough" means for a service.

## Error Budget

The allowed amount of unreliability derived from an SLO. If SLO is 99.9%, the error budget is 0.1%. When budget is exhausted, reliability improvements take priority over new features.
