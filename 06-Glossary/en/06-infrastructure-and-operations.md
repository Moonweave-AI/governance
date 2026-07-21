# Infrastructure & Operations

Terms related to deployment, release management, monitoring, incident response, and operational reliability.

---

## OCI (Open Container Initiative)

A set of industry standards for container image formats and runtime specifications. Ensures container images are portable across different container runtimes and registries.

## Container

A lightweight, isolated execution environment packaging an application with its dependencies. Built from images (Dockerfile), runs consistently across development, CI, and production.

## Multi-stage Build

A Dockerfile technique using multiple `FROM` statements to separate build-time dependencies from runtime dependencies, producing smaller and more secure final images.

## Docker / Dockerfile

Docker is a container platform; a Dockerfile is a text file defining how to build a container image layer by layer. Best practices include pinning base images, minimizing layers, and using `.dockerignore`.

## Compose (Docker Compose)

A tool for defining and running multi-container applications using a `compose.yaml` file. Useful for local development environments requiring multiple services.

## Canary Release

A deployment strategy where a new version is exposed to a small percentage of traffic before full rollout. Allows detecting problems with limited blast radius. If canary metrics degrade, the release is rolled back.

## Staged Rollout

Progressively increasing the exposure of a new release: internal dogfood → canary 1% → canary 10% → regional → full production. Each stage has success criteria before advancing.

## Blue-Green Deployment

A strategy maintaining two identical production environments (blue and green). Traffic switches from one to the other atomically, enabling instant rollback by switching back.

## Rolling Update

Incrementally replacing old instances with new ones, maintaining availability throughout the process. Kubernetes Deployments use this strategy by default.

## Preview Environment

An ephemeral environment automatically created for a PR, allowing reviewers to interact with changes (UI, API, documentation) before merge. Destroyed after the PR is closed.

## Health Check

An endpoint or probe that reports whether a service is operational. Used by load balancers, orchestrators, and monitoring to detect and route around failures.

## Readiness Probe

A check determining whether a service instance is ready to receive traffic. Distinct from a health check (liveness)—a service can be alive but not yet ready.

## Runbook

Operational documentation providing step-by-step procedures for common operations, incident response, rollback, and recovery. Must be usable under time pressure during incidents.

## SLI (Service Level Indicator)

A quantitative measurement of service behavior (e.g., request latency, error rate, availability). The raw data from which SLOs are evaluated.

## SLA (Service Level Agreement)

A formal contract between a service provider and consumer specifying minimum performance levels and consequences of violation. More binding than an SLO.

## DORA Metrics

Four key metrics from the DevOps Research and Assessment program: Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Time to Restore Service. Measure both delivery speed and stability.

## Observability

The ability to understand a system's internal state from its external outputs (logs, metrics, traces). A system is observable when you can diagnose problems without deploying new instrumentation.

## OpenTelemetry

A vendor-neutral standard for generating, collecting, and exporting telemetry data (traces, metrics, logs). Provides consistent observability across diverse technology stacks.

## Tracing (Distributed Tracing)

Recording the path of a request as it flows through multiple services, capturing timing, dependencies, and errors at each step. Essential for debugging distributed systems.

## Metrics

Numeric measurements collected over time: counters, gauges, histograms. Used for dashboards, alerting, and capacity planning (e.g., request rate, error rate, latency percentiles).

## Logging

Structured records of discrete events (errors, state changes, decisions). Distinct from metrics (aggregated numbers) and traces (request paths). Should not contain secrets or PII.

## Alert

An automated notification triggered when a metric crosses a threshold or an anomaly is detected. Effective alerts are actionable, specific, and linked to a runbook.

## Error Budget Policy

A policy defining what happens when an SLO's error budget is consumed: typically freezing feature releases, prioritizing reliability work, and resuming feature velocity only after budget recovery.

## Incident

An unplanned event causing service degradation, outage, data loss, security breach, or safety concern. Classified by severity (P0–P4) and tracked through a formal lifecycle.

## Release Readiness

A structured review confirming all prerequisites for a production release are satisfied: CI passes, reviews complete, monitoring ready, rollback tested, ownership confirmed.
