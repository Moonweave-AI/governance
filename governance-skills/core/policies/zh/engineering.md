# 工程与质量语义内核

- 工程变更必须可追踪、可复现、可审查、可验证、可回滚。
- 生命周期：Engineering Ready → Brief → Technical Decision/ADR → 环境与脚手架 → 实现 → 本地验证 → PR → CI门禁 → Required Review → Merge → 制品 → Staging/Preview/Simulation → Release Readiness → Rollout → Post-deploy Verification → 反馈闭环。
- 原型用于学习，不得在无Owner、测试、文档、安全审查和运行责任时默默成为生产依赖。
- 质量是证据，不是感觉。覆盖设计、实现、自动化、安全、供应链、数据、模型、运行、用户和具身证据。
- 小测试多、大测试少；关键路径必须端到端；Flaky test本身是缺陷。
- 合并不等于完成，部署不等于成功；Done包括文档、监控、回滚、Owner接收和后续问题记录。
