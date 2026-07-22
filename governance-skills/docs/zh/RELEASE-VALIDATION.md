# 版本验证

## 0.1.0（预发布）

该版本将 Moonweave Governance 编译为供应商中立的 Skill 内核、23 个聚焦 Skill、23 个命令、24 个模板、确定性 CLI，以及 Cursor、Codex、Claude Code、OpenCode、Kilo 和 Antigravity 的平台适配器。

### 已完成的验证

| 项目 | 结果 |
|---|---:|
| Node 单元与集成测试 | 17 / 17 通过 |
| Agent Skill 静态检查 | 23 个 Skill，0 error，0 warning |
| 路由与触发静态评测 | 82 / 82 通过 |
| 平台清单与适配器检查 | 93 / 93 通过 |
| 仓库自审计 | blocker / high / medium / low / info 均为 0 |

验证覆盖：

- 审计不会执行被审仓库代码；
- Secret 检测会脱敏，不在报告中回显完整凭据；
- 具身项目缺少 Hazard Analysis 或 E-Stop 证据时触发阻断；
- 生产写权限、Agent 越权与高风险物理行为会升级到人工确认；
- 所有平台均测试 copy 安装与安全卸载；
- symlink 模式仅在显式选择时启用；
- 安装器不会在无 `--force` 时覆盖现有 Skill；
- 卸载器保留安装后被用户修改的文件；
- 所有 Skill 均有正向和负向触发回归案例。

### 尚未完成的外部验证

以下事项必须由实际发布环境完成，不应被本地验证结果替代：

- 在六个交互式 Agent 产品中运行真实模型配对评测；
- 使用 Moonweave AI 的 npm 账号发布包；
- 向各平台市场提交并通过人工或自动审核；
- 通过发布 CI 生成签名、OIDC provenance 和不可变 release artifact；
- 在真实项目中收集触发 Precision / Recall、治理遗漏、人工 Review 时间和 Skill 行为约束覆盖率。

机器可读结果见根目录 `release-manifest.json`；详细方法见 `docs/EVALUATION.md`。
