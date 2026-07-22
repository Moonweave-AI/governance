# Skills 安全模型

## 威胁

1. **Skill prompt injection**：长 Markdown、引用文件或脚本隐藏恶意指令。
2. **Repository prompt injection**：Issue、README、代码注释、日志诱导 Agent 泄密或执行命令。
3. **Supply-chain substitution**：同名技能、篡改包、未固定来源或更新。
4. **Over-privileged agent**：技能要求过宽文件、网络、Shell、MCP 或物理权限。
5. **False evidence**：Agent 声称测试、审查或部署成功但未执行。
6. **Cross-platform semantic drift**：平台适配后门禁丢失或措辞改变行为。

## 控制

- 标准化 YAML frontmatter；名称与目录匹配。
- 所有技能包含 untrusted-input 安全契约。
- 无网络、无依赖的确定性 CLI；audit 不执行项目脚本。
- 安装锁与 SHA-256；发布时应加签、生成 SBOM/Provenance。
- 平台权限采用最小权限，写/执行/网络/发布/部署/物理动作默认 Ask。
- Stop-Ship 由 skills 提示、CLI 检查、CI/Hook/权限系统共同执行；不能只依赖 LLM。
- 配对触发/非触发与安全对抗 eval。

## 发布前硬化

- 由两名独立 Reviewer 审查所有 SKILL.md 与脚本。
- npm 启用 provenance 与 2FA；GitHub release 签名。
- skills lock 固定 commit/tag 和 hash。
- 市场发布说明所需权限、网络和脚本。
- 定期扫描依赖（当前 CLI 无运行时依赖）和恶意模式。
