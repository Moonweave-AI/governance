# Security & Compliance

Terms related to application security, supply chain integrity, compliance frameworks, and vulnerability management.

---

## SBOM (Software Bill of Materials)

A machine-readable inventory of all components, libraries, and dependencies in a software artifact. Enables vulnerability tracking, license compliance, and supply chain transparency.

## SLSA (Supply-chain Levels for Software Artifacts)

A framework for ensuring software supply chain integrity through verified build provenance. Levels range from L1 (basic provenance) to L4 (hermetic, reproducible builds).

## Provenance

A record documenting who built an artifact, through what process, from what source inputs, and in what environment. Essential for supply chain verification and audit trails.

## SPDX (Software Package Data Exchange)

An ISO standard (ISO/IEC 5962:2021) format for communicating software component information including licenses, copyrights, and security references.

## SAST (Static Application Security Testing)

Security analysis of source code without execution. Identifies vulnerabilities like injection flaws, hardcoded secrets, and insecure patterns during development.

## DAST (Dynamic Application Security Testing)

Security testing of running applications by simulating attacks. Discovers runtime vulnerabilities not visible in source code.

## CodeQL

GitHub's semantic code analysis engine for finding security vulnerabilities and code quality issues through database-style queries over code structure.

## OWASP (Open Web Application Security Project)

A nonprofit producing standards, tools, and guidance for web application security. Key outputs include the OWASP Top 10, ASVS, and SAMM.

## ASVS (Application Security Verification Standard)

An OWASP standard providing a comprehensive checklist of security requirements for web applications, organized by verification level (L1–L3).

## OWASP SAMM (Software Assurance Maturity Model)

A framework for assessing and improving software security practices across Governance, Design, Implementation, Verification, and Operations.

## OWASP LLM Top 10

A list of the most critical security risks specific to Large Language Model applications, including Prompt Injection, Insecure Output Handling, and Training Data Poisoning.

## Secret Scanning

Automated detection of accidentally committed credentials, API keys, tokens, and other secrets in Git history. Prevents credential exposure in public or shared repositories.

## Dependency Scanning

Automated detection of known vulnerabilities (CVEs) in project dependencies. Tools like Dependabot and GitHub dependency review provide alerts and automated fix PRs.

## CVE (Common Vulnerabilities and Exposures)

A standardized identifier for publicly known security vulnerabilities (e.g., CVE-2024-1234). Used by dependency scanners to match known vulnerabilities against project dependencies.

## Threat Model

A structured analysis of potential security threats to a system, identifying assets, threat actors, attack vectors, and mitigations. Required for S3+ systems before implementation.

## NIST CSF (Cybersecurity Framework)

A risk-based framework organizing cybersecurity activities into Identify, Protect, Detect, Respond, and Recover functions. The Kaguya Project's security governance aligns with CSF 2.0's risk management approach.

## NIST SSDF (Secure Software Development Framework)

NIST SP 800-218: practices for integrating security into every phase of the software development lifecycle, from preparation through implementation, response, and vulnerability management.

## NIST AI RMF (AI Risk Management Framework)

NIST AI 100-1: a framework for managing AI system risks across trustworthiness characteristics including validity, safety, security, accountability, transparency, fairness, and privacy.

## OpenSSF Scorecard

An automated tool that evaluates open source projects against security heuristics (branch protection, CI tests, vulnerability disclosure, dependency updates, etc.) and produces a score.

## Sigstore

A set of tools for signing, verifying, and creating transparency logs for software artifacts. Enables keyless signing of releases, container images, and SBOMs.

## Zero Trust

A security model where no entity (user, service, or network) is inherently trusted. Every access request must be authenticated, authorized, and continuously validated regardless of origin.

## Supply Chain Attack

An attack targeting the software supply chain (dependencies, build systems, distribution channels) rather than the application itself. Mitigated by SBOM, provenance, pinned dependencies, and reproducible builds.
