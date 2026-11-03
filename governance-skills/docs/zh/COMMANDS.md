# CLI 命令

## `list`
列出技能、命令、模板和平台。

## `install`

```bash
moonweave-skills install --root . --agents all --scope project --mode copy
```

参数：`--agents`、`--scope project|global`、`--mode copy|symlink`、`--force`、`--with-github`。

## `doctor`
检查 Node 版本、包完整性、平台目标目录、skills lock 和项目治理配置。

## `route`

```bash
moonweave-skills route --text "新增能写生产数据库的 Agent 工具"
```
输出建议风险、质量、成熟度、必需技能和产物。它是启发式建议，不替代 Owner/安全 Review。

## `new`

```bash
moonweave-skills new rfc --title "统一长期记忆协议" --out 05-Knowledge/rfc/0000-memory.md
```
支持：idea、discovery、prototype、brief、rfc、adr、issue、pr、test-plan、quality、release、research、paper-review、dataset-card、model-card、agent-card、runbook、incident、postmortem、handoff、asset、threat-model、hazard-analysis、exception。

## `audit`

```bash
moonweave-skills audit --root . --profile ai-agent --format markdown
moonweave-skills audit --root . --profile embodied --format sarif --out audit.sarif
```
Profiles：docs、library、service、ai-agent、embodied、auto。

## `lint-skills`
检查 Agent Skills frontmatter、名称、描述长度、安全执行契约、危险指令和资源文件大小。

## `lint-docs`
检查文档元数据、canonical 目标、决策编号与范围、受治理的关系端点、图连通性、双向 `related`，以及互逆的 `supersedes`/`superseded_by` 生命周期链接。决策别名必须与 canonical 记录的类型、编号和 `decision_scope` 一致；替代关系端点及本地 `related` 端点必须解析到受治理文档。检查会拒绝孤立记录、断裂子图、同一 `decision_scope` 下重叠的有效 RFC 或 ADR，以及未链接既有同范围 RFC 的 ADR。被替代记录必须指明后继并使用 `Superseded` 状态。

## `docs-index`

```bash
moonweave-skills docs-index --root . --view atlas
moonweave-skills docs-index --root . --view neighborhood --focus 05-Knowledge/en/01-Documentation-Guide.md
moonweave-skills docs-index --root . --view changes
moonweave-skills docs-index --root . --view all --out-dir docs --base-url release
moonweave-skills docs-index --root . --view all --out-dir docs --base-url release --check
```

从 frontmatter 和 `core/governance-map.json` 渲染文档图。`--view atlas` 是默认视图，每个热 canonical 记录一行。`--view neighborhood` 需要 `--focus`，返回该记录和一跳。`--view changes` 是发布链和决策替代。`--view full` 是审计台账。`--view all` 写出 `DOCUMENT-ATLAS.md`、`CHANGE-ATLAS.md` 和 `DOCUMENT-INDEX.md`。Frontmatter 仍是事实源。npm 包使用 `--base-url release` 生成不可变的 `v<package-version>` 链接。提交视图过期时 `--check` 失败。

## `eval-static`
运行风险路由、全部 23 个技能的正/负触发用例与静态安全回归。

## `checksums`
为当前技能包文件生成 `checksums.sha256`。

## `uninstall`
仅移除 lock 中由工具安装的文件；不会删除无法确认归属的文件。
