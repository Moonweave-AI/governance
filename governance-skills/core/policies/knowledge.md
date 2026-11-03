# Knowledge Asset Semantic Core

- Each important knowledge point has exactly one authoritative source of truth; other locations only reference, summarize, or index it.
- Before creating or materially changing a document, inspect the generated document graph for overlapping active records; reuse the authority or create an explicitly cross-linked successor instead of a parallel truth.
- Every governed document links at least one other governed document, and the local document graph stays connected. `related` links are reciprocal. `supersedes` and `superseded_by` form a reciprocal lifecycle pair, and generated indexes are views rather than a second source of truth.
- Agents load the hot atlas or one neighborhood. The full ledger is an audit view. Translations and superseded records stay out of the default context.
- The hot atlas has a fixed canonical budget. A new hot canonical record in a domain that already has the same type supersedes an existing record, or sets `consolidation: new-authority`.
- The changelog is a release chain: one version, one date, and a short list of notable changes. Regenerate the change atlas from it. An append-only progress diary is not a change history.
- A build, fix, or system change finishes as the working change and its evidence. An RFC, ADR, plan, or index is an intermediate gate when that record is the requested artifact or the change is irreversible. Defensive disclaimer stacks are not a deliverable.
- RFC and ADR records use one stable lowercase kebab-case `decision_scope` per decision. Multiple current records of the same type cannot own one scope, and an ADR links the RFC for that scope when one exists.
- Formal documentation uses Docs as Code: Git, PR, Review, automated checks, and traceable history.
- Formal documentation must have type, Owner, status, target audience, update time, visibility, and lifecycle.
- Tutorials are for learning, How-tos for completing tasks, References for looking up facts, and Explanations for understanding context; do not mix them.
- RFC answers "should we do this and why"; ADR answers "what was decided and the consequences"; Design Doc answers "how to implement"; PR records the actual change.
- Research records must include problem, hypothesis, code/data/model/config/hardware/random seed, method, metrics, raw results, negative results, limitations, reproduction method, and conclusion.
