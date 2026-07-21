# Engineering & Development

Terms related to software engineering practices, version control, branching strategies, and development workflows.

---

## GitHub Flow

A lightweight, branch-based workflow where all changes are developed on short-lived feature branches and merged to `main` via Pull Requests. Simpler than Git Flow; suitable for continuous delivery.

## Git Flow

A heavier branching model with long-lived `develop`, `release`, and `hotfix` branches. Not adopted by the Kaguya Project due to unnecessary complexity for continuous delivery workflows.

## Pull Request (PR)

A mechanism for proposing changes to a codebase. A PR contains a diff, description, test plan, and metadata, and must pass CI checks and human review before being merged into a protected branch.

## Draft PR

A PR marked as work-in-progress that cannot be merged. Used to expose implementation direction early, get preliminary feedback, and detect CI issues before formal review.

## Branch Protection

GitHub repository settings that enforce rules on protected branches (typically `main`): requiring PR reviews, passing status checks, CODEOWNER approval, linear history, and prohibiting force pushes.

## Conventional Commits

A commit message convention using the format `<type>(<scope>): <description>`. Types include `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `ci`, `chore`. Aligns with SemVer for automated changelog and version management.

## SemVer (Semantic Versioning)

A versioning scheme using `MAJOR.MINOR.PATCH` where MAJOR indicates breaking changes, MINOR indicates backward-compatible features, and PATCH indicates backward-compatible fixes. Applied to components with public APIs.

## CI/CD (Continuous Integration / Continuous Delivery)

CI: automatically building, testing, and validating every code change. CD: automatically deploying validated changes to staging or production environments. Together they form an automated pipeline from commit to deployment.

## GitHub Actions

GitHub's built-in CI/CD platform where workflows are defined as YAML files. Supports matrix builds, environment secrets, artifact uploads, and deployment protection rules.

## Lockfile

A file that pins exact dependency versions and their transitive dependencies (e.g., `uv.lock`, `pnpm-lock.yaml`, `Cargo.lock`). Ensures reproducible builds across environments and CI.

## Dev Container

A containerized development environment defined by `devcontainer.json`. Provides reproducible, pre-configured environments for complex setups (GPU dependencies, system libraries, ROS, simulators).

## Feature Flag

A runtime toggle that enables or disables a feature without deploying new code. Allows gradual rollout, A/B testing, and instant rollback of functionality.

## Kill Switch

An emergency mechanism to immediately disable a feature, service, or behavior in production without a full deployment cycle. Critical for high-risk systems.

## Hotfix

An expedited fix for a critical production issue that follows a shortened review process. Must still be recorded, tested, and followed up with root cause analysis and regression tests.

## Squash Merge

A merge strategy that combines all commits in a PR into a single commit on the target branch. Produces cleaner linear history at the cost of individual commit granularity.

## Linear History

A branch history without merge commits, achieved through squash merges or rebases. Easier to read, bisect, and reason about than histories with complex merge topologies.

## Matrix Testing

Running the same test suite across multiple combinations of OS, language version, runtime, or configuration. Defined in CI workflows to catch environment-specific failures.

## Monorepo

A single repository containing multiple projects, packages, or services. Simplifies cross-project changes but requires tooling for selective builds and tests.

## Workspace

A package manager feature (pnpm workspace, Cargo workspace) that manages multiple packages within a single repository, sharing dependencies and enabling cross-package development.

## Engineering Brief

A lightweight design document (shorter than an RFC, more detailed than an Issue) written before implementing standard or high-risk engineering changes. Captures problem, approach, alternatives, risks, testing plan, and ownership.
