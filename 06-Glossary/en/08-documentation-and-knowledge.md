# Documentation & Knowledge Management

Terms related to technical writing, documentation systems, knowledge organization, and information architecture.

---

## Diátaxis

A documentation framework organizing content into four types based on user need: Tutorials (learning-oriented), How-to Guides (task-oriented), Reference (information-oriented), and Explanation (understanding-oriented). Prevents mixing purposes within a single document.

## Docs as Code

A philosophy treating documentation with the same rigor as code: stored in Git, modified via PRs, reviewed by peers, tested by CI, and deployed automatically. Ensures documentation evolves alongside the codebase.

## SSoT (Single Source of Truth)

The principle that each piece of information has exactly one authoritative location. All other references must point back to the SSoT rather than duplicating or contradicting it.

## Front Matter

Structured metadata at the beginning of a document (typically YAML) declaring properties like title, author, status, owner, date, and type. Enables automated tooling, indexing, and lifecycle management.

## GFM (GitHub Flavored Markdown)

GitHub's extended Markdown specification adding tables, task lists, strikethrough, autolinks, and fenced code blocks to standard Markdown. The default writing format for the Kaguya Project.

## Mermaid

A text-based diagramming language that renders flowcharts, sequence diagrams, class diagrams, and more from Markdown code blocks. Version-controllable and diffable unlike binary image formats.

## Vale

A prose linter that enforces writing style rules (terminology consistency, passive voice detection, jargon avoidance) on Markdown, AsciiDoc, and other text formats. Configurable with custom style packages.

## markdownlint

A static analysis tool for Markdown files enforcing consistent formatting rules: heading structure, list indentation, line length, blank lines, and code block formatting.

## Technical Radar

A visualization (originated by ThoughtWorks) categorizing technologies into four rings: Adopt (recommended default), Trial (limited use with exit path), Assess (research only), Hold (do not introduce). Used for technology governance.

## Changelog

A file (typically `CHANGELOG.md`) recording notable changes for each version of a project, organized by release. Aimed at users and maintainers rather than developers (unlike Git log).

## Release Notes

User-facing documentation accompanying a release, highlighting important changes, breaking changes, migration steps, and known issues in accessible language.

## Glossary

A collection of term definitions ensuring consistent understanding across a project. This document itself is part of the Kaguya Project's glossary system.

## DOI (Digital Object Identifier)

A persistent identifier for digital objects (papers, datasets, software versions) ensuring long-term discoverability and citability regardless of URL changes.

## REUSE

A specification (by FSFE) for making software licensing and copyright information machine-readable and unambiguous at the file level using SPDX identifiers.

## Quality Declaration

A document (inspired by ROS 2 REP-2004) where a component declares its quality level and provides evidence for how it meets the requirements of that level across testing, documentation, version policy, and dependencies.

## Runbook

Operational documentation providing step-by-step procedures for system administration, incident response, and recovery. Distinct from user documentation—runbooks target operators working under time pressure.

## Knowledge Asset

Any recorded knowledge that enables understanding, maintenance, reproduction, auditing, or continuation of work. Includes code, documentation, decisions, experiments, data records, and operational procedures.
