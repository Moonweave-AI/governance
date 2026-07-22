# Contributing

Changes to skill semantics must trace to the Moonweave governance repository. Substantial changes require a Governance RFC.

1. Update `core/` first.
2. Update focused skills, commands, templates and traceability.
3. Run `npm test`, `npm run lint:skills`, and `npm run audit:self`.
4. Add paired trigger/non-trigger evaluation cases.
5. Update compatibility notes and changelog.
6. Do not commit secrets, private governance data or copied third-party skills without license review.
