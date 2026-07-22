# Engineering and Quality Semantic Core

- Engineering changes must be traceable, reproducible, reviewable, verifiable, and rollbackable.
- Lifecycle: Engineering Ready → Brief → Technical Decision/ADR → Environment and scaffolding → Implementation → Local verification → PR → CI Gates → Required Review → Merge → Artifact → Staging/Preview/Simulation → Release Readiness → Rollout → Post-deploy Verification → Feedback loop.
- Prototypes are for learning; they must not silently become production dependencies without Owner, tests, documentation, security review, and operational responsibility.
- Quality is evidence, not feeling. Cover design, implementation, automation, security, supply chain, data, model, operations, user, and embodied evidence.
- Many small tests, few large tests; critical paths must be end-to-end; flaky tests are themselves defects.
- Merge is not done, deploy is not success; Done includes documentation, monitoring, rollback, Owner acceptance, and follow-up issue log.
