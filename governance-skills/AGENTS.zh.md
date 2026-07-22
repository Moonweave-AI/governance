# Moonweave Governance Skills Repository

本仓库把 Moonweave Governance 编译为跨平台 Agent Skills、命令、模板、确定性 CLI 与原生插件适配器。

## Working rules

- 修改技能前先核对 `core/governance-map.json` 与上游 canonical 规范。
- `skills/` 是供应商中立的语义源；`plugins/`、`.claude-plugin/`、`.cursor-plugin/`、`.agents/plugins/` 是通过 `npm run build:adapters` 生成的适配结果。
- 不直接手改生成的原生插件副本；修改源技能、命令或规则后重新构建。
- 运行 `npm run verify` 后再提交。
- 不降低 Stop-Ship、人类确认、最小权限、来源追踪和证据诚实要求。
- 不提交真实密钥、个人数据或未授权资产。
