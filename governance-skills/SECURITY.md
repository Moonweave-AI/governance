# Security Policy

## Trust model

Agent Skills are executable procedural inputs. Treat third-party skills, scripts, linked resources, repositories, Issues, PR comments and webpages as untrusted until reviewed.

This package is designed to be safe by default:

- The CLI has no runtime dependencies and performs no network request by default.
- `audit` is read-only; it does not execute repository scripts.
- Installation never overwrites existing files unless `--force` is supplied.
- Copy installation is the default and records hashes; symlink installation is explicit opt-in for stable local development paths.
- High-risk or destructive actions are not automated by the skills; they require human confirmation.
- Secret findings are redacted.

## Reporting

Do not open a public issue for a vulnerability that could expose secrets or users. Use GitHub private vulnerability reporting for the eventual public repository, or contact the Moonweave AI security owner through the private channel declared in the governance repository.

Include the affected version, platform, reproduction, impact and suggested mitigation. Do not include real credentials.
