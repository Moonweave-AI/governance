# Release Validation

## 0.1.0 (Pre-release)

This release compiles Moonweave Governance into a vendor-neutral Skill core, 23 focused Skills, 23 commands, 24 templates, a deterministic CLI, and platform adapters for Cursor, Codex, Claude Code, OpenCode, Kilo, and Antigravity.

### Completed Validation

| Item | Result |
|---|---:|
| Node unit and integration tests | 17 / 17 passed |
| Agent Skill static checks | 23 Skills, 0 error, 0 warning |
| Routing and trigger static evaluation | 82 / 82 passed |
| Platform manifest and adapter checks | 93 / 93 passed |
| Repository self-audit | blocker / high / medium / low / info all 0 |

Validation coverage:

- Audit does not execute any code from the audited repository;
- Secret detection redacts values and never echoes full credentials in the report;
- Embodied projects missing a Hazard Analysis or E-Stop evidence are blocked;
- Production write permissions, Agent privilege escalation, and high-risk physical actions are escalated to human confirmation;
- All platforms are tested for both copy installation and safe uninstall;
- symlink mode is enabled only when explicitly selected;
- the installer never overwrites an existing Skill without `--force`;
- the uninstaller preserves user-modified files after installation;
- every Skill has both positive and negative trigger regression cases.

### External Validation Not Yet Completed

The following must be performed in the actual release environment and must not be substituted by local validation results:

- Run real-model paired evaluation across the six interactive Agent products;
- Publish the package using Moonweave AI's npm account;
- Submit to each platform marketplace and pass manual or automated review;
- Produce signatures, OIDC provenance, and immutable release artifacts through the release CI;
- Collect trigger Precision / Recall, governance gaps, human Review time, and Skill behavioral constraint coverage on real projects.

Machine-readable results are in the root `release-manifest.json`; detailed methodology is in `docs/EVALUATION.md`.
