# Quality Declaration

| Field | Value |
|---|---|
| Component | Moonweave Governance Skills |
| Status | Active / pre-publication |
| Quality level | QA-L2（受维护库与可移植 skill 集合） |
| Primary owner | Moonweave AI Governance Maintainers |
| Backup owner | Moonweave AI Stewardship Council |
| Version policy | 公开发布后采用语义化版本 |
| Runtime | 确定性 CLI 需 Node.js 20+；skills 本身是 Markdown |

## Scope

本声明覆盖 `skills/`、`commands/`、`core/`、`templates/`、CLI、安装器、静态审计器、平台适配器与市场清单。

## Change control

- 所有变更应通过 Pull Request。
- 技能语义变化必须追溯到 Moonweave Governance canonical 文档。
- 平台路径、manifest 或市场格式变化必须更新适配器测试。
- 安全边界、Stop-Ship 和权限语义不得通过普通维护便利弱化。

## Verification

- Node.js 单元与集成测试。
- 全部 `SKILL.md` frontmatter、危险模式和治理追踪静态检查。
- 路由与触发回归用例（中文与英文样本）。
- 原生 marketplace / plugin manifest 结构验证。
- npm pack、tarball 安装和多平台项目安装 smoke test。
- 仓库自身治理审计与 Secret / CI 风险扫描。

## Security and supply chain

- CLI 审计默认只读，不执行被审计仓库代码。
- 默认安装模式为复制，避免临时 npx 路径失效及跨平台 symlink 差异。
- 卸载依据 lock 文件并保留用户修改过的文件。
- 发布产物生成 SHA-256 校验和；正式发布应附带 SBOM / provenance / 签名。

## Known limitations

- npm、Claude、Cursor、Codex、Kilo 与其他市场条目尚未由 Moonweave AI 账号实际发布或审核。
- 不同模型对技能自动触发的可靠性不同；显式命令、确定性检查和人工 Review 仍是必要控制。
- 平台市场格式可能演进，应在每次发布前重新运行 manifest 验证并核对官方文档。

## Review cadence

每次发布前，以及任一受支持平台改变技能、命令、规则或插件格式时复审。
