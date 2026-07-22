# 发布与市场提交

## 发布前门禁

```bash
npm run verify
npm run audit:self
npm pack --dry-run
```

还应完成：

- 核对治理规范版本与 `core/manifest.json`。
- 审查所有 `SKILL.md`、脚本、manifest 和依赖。
- 生成并验证 SHA-256、SBOM、provenance 与签名。
- 从实际 npm tarball 运行安装 smoke test，而不是只从源码测试。
- 在至少一个真实项目中分别验证 Cursor、Codex、Claude、OpenCode、Kilo 和 Antigravity。
- 运行触发/非触发、安全注入、Stop-Ship 与任务结果配对评测。

## npm

```bash
npm login
npm publish --access public
```

## GitHub Release

上传：

- 源码 ZIP / tar.gz
- npm `.tgz`
- `SHA256SUMS`
- 验证报告
- SBOM / provenance / signature（正式发布）

## 市场入口

- Claude：根 `.claude-plugin/marketplace.json`
- Cursor：根 `.cursor-plugin/marketplace.json`
- Codex / ChatGPT：根 `.agents/plugins/marketplace.json`
- Antigravity：根 `plugin.json`
- Kilo：`skills/index.json` remote URL 或向 Kilo Marketplace 提交技能目录
- skills.sh：governance 仓库的 `governance-skills/skills/` 目录

市场审核通过前，文档必须使用“publication-ready / pending review”，不能声称已经上架。
