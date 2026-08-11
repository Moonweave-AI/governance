## 2026-08-08 - Task: 建立治理文档内联关系图并防止 RFC/ADR 漂移

### What was done

- 新增由治理文档 frontmatter 和治理映射共同构建的文档关系图，可输出供 Agent 按需读取的 JSON，或输出包含 Markdown 直达链接的统一文档总表。
- 将断链、自引用、重复关系、单向关系、替代状态不一致、替代环和重复 RFC/ADR 编号纳入确定性文档门禁，并把索引漂移检查接入既有 `lint:docs`。
- 更新 Documentation、RFC、ADR 三项技能，使 Agent 在创建文档前先查询现有关系图并判断复用或显式替代，完成后校验关系并重建索引；同时统一 ADR 模板与 schema 的生命周期状态。
- 按既有生成链路同步 Claude、Cursor、Codex、Antigravity 适配器，刷新发布校验和，并补齐三语使用与架构说明。

### Testing

- `npm run verify`：通过；31 个测试、199 项适配器检查、64 份治理文档检查、72 个模板检查、发布元数据检查和 171 项静态评测均为零失败。
- `npm run pack:check`：通过；npm dry-run 包含 1192 个文件，包大小约 620.7 kB。
- `node bin/moonweave-skills.mjs checksums`：通过；刷新 1197 条发布文件校验和。
- `git diff --check`：通过；未发现补丁空白错误。

### Notes

- `governance-skills/lib/document-graph.mjs`：新增统一文档图、canonical 分组、文档到技能映射以及 Markdown/JSON 索引渲染。
- `governance-skills/lib/document-lint.mjs`：新增文档关系完整性、互逆性、替代环、替代状态和 RFC/ADR 编号校验。
- `governance-skills/bin/moonweave-skills.mjs`：新增 `docs-index`、JSON 输出和 `--check` 漂移门禁。
- `governance-skills/package.json`：新增索引生成/检查脚本，并将索引检查接入 `lint:docs`。
- `governance-skills/core/document-metadata.schema.json`：明确三类关系字段的唯一性和语义。
- `governance-skills/core/policies/{knowledge.md,zh/knowledge.md,ja/knowledge.md}`：补充先查重、单一事实源和关系互逆规则。
- `governance-skills/skills/moonweave-documentation/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：加入先查图、复用或替代、重建索引的执行闭环。
- `governance-skills/skills/moonweave-rfc/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：加入同范围 RFC/ADR 查重、互链和替代门禁。
- `governance-skills/skills/moonweave-adr/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：加入决策范围查重、互链和统一文档生命周期状态。
- `governance-skills/skills/moonweave-research/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：由既有适配器构建脚本同步包版本元数据。
- `governance-skills/templates/{adr.md,zh/adr.md,ja/adr.md}`：将初始状态从 schema 不接受的 `Proposed` 统一为 `Draft`。
- `governance-skills/docs/DOCUMENT-INDEX.md`：新增 64 份文档、28 个 canonical 记录和 108 条文档到技能连接的生成总表。
- `governance-skills/docs/{ARCHITECTURE.md,COMMANDS.md,GOVERNANCE-TRACEABILITY.md}`：说明文档图架构、命令和追踪落点。
- `governance-skills/docs/zh/{ARCHITECTURE.md,COMMANDS.md,GOVERNANCE-TRACEABILITY.md}`：同步中文文档图说明。
- `governance-skills/docs/ja/{ARCHITECTURE.md,COMMANDS.md,GOVERNANCE-TRACEABILITY.md}`：同步日文文档图说明。
- `governance-skills/{README.md,README.zh.md,README.ja.md}`：补充 `docs-index` 常用命令和总表入口。
- `governance-skills/tests/document-graph.test.mjs`：新增索引链接和 `--check` 漂移回归测试。
- `governance-skills/tests/document-lint.test.mjs`：新增互逆关系、断链、替代环和重复决策编号测试。
- `governance-skills/tests/templates.test.mjs`：新增 ADR 生命周期状态回归测试。
- `governance-skills/plugins/{claude,cursor,codex,antigravity}/moonweave-governance/skills/moonweave-adr/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：由源 ADR 技能生成的平台副本。
- `governance-skills/plugins/{claude,cursor,codex,antigravity}/moonweave-governance/skills/moonweave-documentation/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：由源 Documentation 技能生成的平台副本。
- `governance-skills/plugins/{claude,cursor,codex,antigravity}/moonweave-governance/skills/moonweave-rfc/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：由源 RFC 技能生成的平台副本。
- `governance-skills/plugins/{claude,cursor,codex,antigravity}/moonweave-governance/skills/moonweave-research/{SKILL.md,zh/SKILL.md,ja/SKILL.md}`：由源 Research 技能生成的版本同步副本。
- `governance-skills/checksums.sha256`：刷新全部发布文件校验和。
- `progress.md`：记录本轮实现、验证、文件落点和回滚方式。
- 回滚方式：在本轮尚未提交且没有叠加后续修改时，执行 `git diff -- governance-skills | git apply --reverse`，再执行 `rm -f governance-skills/docs/DOCUMENT-INDEX.md governance-skills/lib/document-graph.mjs governance-skills/tests/document-graph.test.mjs progress.md`；适配器也可在恢复源技能后运行 `npm --prefix governance-skills run build:adapters` 重建。

## 2026-08-08 - Task: 验证文档内联效果并补齐历史关系与决策冲突门禁

### What was done

- 用两个编号不同但范围相同的有效 RFC 做前向冲突测试，确认旧门禁会漏检；新增稳定的 `decision_scope`，禁止同类型有效 RFC/ADR 重复占用同一决策范围，并要求同范围 RFC 与 ADR 显式互链。
- 增加孤立文档和断裂子图门禁；依据现有正文中的引用、职责边界和“不替代”说明，为 64 份治理文档回填双向关系，形成包含 308 条已声明关系的连通文档图，不虚构不存在的历史替代关系。
- 将既有 ADR-0001 恢复为可识别的 ADR 记录并补充决策范围；优化生成总表，在统一全表前增加决策记录区，便于 Agent 和维护者优先发现重叠决策。
- 按源技能重建四个平台适配器，刷新发布校验和，并同步三语知识政策、命令、架构和追踪说明。

### Testing

- 前向冲突回归：旧逻辑对两个同范围有效 RFC 返回 0 个错误；新增测试确认当前逻辑返回 2 个 `overlapping-decision-scope` 错误，同范围未互链 RFC/ADR 返回 `missing-decision-chain-link`。
- `npm run verify`：通过；35 个测试、199 项适配器检查、25 项技能检查、64 份治理文档检查、72 个模板检查、发布元数据检查和 171 项静态评测均为零失败。
- `npm run pack:check`：通过；npm dry-run 包含 1192 个文件，包大小约 628.6 kB。
- `node bin/moonweave-skills.mjs checksums`：通过；刷新 1197 条发布文件校验和，校验和回归测试通过。
- `docs-index --check`、`git diff --check` 与尾随空白检查：通过；生成索引无漂移，补丁和 Markdown 未发现空白错误。

### Notes

- `01-Foundation/**`、`02-Governance/**`、`03-Collaboration/**`、`04-Engineering/**`、`05-Knowledge/**`、`06-Glossary/**`：按已有正文证据回填三语治理政策、工程标准、知识记录和术语表之间的双向关系，并更新复核日期。
- `05-Knowledge/adr/0001-github-root-and-release-manifest-unification.md`：登记 `ADR-0001`、`decision_scope` 和工程/知识关系，使既有架构决策进入统一决策索引。
- `governance-skills/lib/document-graph.mjs`：在 JSON/Markdown 图中输出决策范围，并为生成总表增加决策记录摘要区。
- `governance-skills/lib/document-lint.mjs`：新增决策范围唯一性、RFC/ADR 决策链、孤立文档和全图连通性门禁。
- `governance-skills/core/document-metadata.schema.json` 与 `governance-skills/templates/{rfc.md,adr.md,zh,ja}`：登记并提供三语 `decision_scope` 字段。
- `governance-skills/core/policies/{knowledge.md,zh/knowledge.md,ja/knowledge.md}`：明确单一决策范围、文档图连通和决策链规则。
- `governance-skills/skills/moonweave-{documentation,rfc,adr}/**/SKILL.md`：要求 Agent 起草前比较决策范围，复用既有权威记录，并把新记录接入既有文档图。
- `governance-skills/plugins/{claude,cursor,codex,antigravity}/moonweave-governance/skills/moonweave-{documentation,rfc,adr,research}/**/SKILL.md`：由适配器构建脚本同步源技能与包版本。
- `governance-skills/docs/{ARCHITECTURE.md,COMMANDS.md,GOVERNANCE-TRACEABILITY.md}` 及其 `zh/`、`ja/` 版本：说明决策范围、连通性门禁、RFC/ADR 链和生成索引工作流。
- `governance-skills/docs/DOCUMENT-INDEX.md`：生成 64 份文档、28 个 canonical 记录、1 个决策记录、308 条已声明关系和 108 条文档到技能连接的统一总表。
- `governance-skills/tests/{document-graph.test.mjs,document-lint.test.mjs,templates.test.mjs}`：覆盖决策摘要、索引漂移、范围冲突、决策链、孤立/断裂图和模板元数据。
- `governance-skills/checksums.sha256`：刷新最终发布文件校验和。
- `progress.md`：追加本轮效果验证、历史关系回填、测试证据和回滚点。
- 回滚点：本开发分支创建前的 `main` 基线为 `7ccefb0`；PR 合并前可切回 `main` 后删除 `codex/document-inline-governance`，合并后应对该 PR 的合并提交执行 `git revert`，不得改写共享分支历史。
- 验证证据更正：上述空白检查通过仅指 `git diff --check` 和本轮新增/修改行；仓库全量 `rg -n '[[:blank:]]+$' --glob '!*.git*' .` 仍会命中既有模板中的空占位符，本轮未扩大范围做全量格式化。

## 2026-08-11 - Task: 检查并修复 Codex 对文档内联升级 PR 的评审意见

### What was done

- 逐条复现并确认 Codex 提出的 4 个 P2 问题，修复 JSON 图携带本机绝对路径、发布包索引链接越界、链接标签破坏 Markdown 表格，以及非 RFC/ADR 文档被误识别为决策记录的问题。
- 为发布用索引增加显式 `--base-url`，使 npm 包内的索引指向可访问的权威仓库文档，同时保留本地生成索引默认使用相对链接的行为，避免复制治理文档形成第二事实源。
- 补充跨检出目录 JSON 一致性、发布链接、表格转义和决策类型约束回归测试，并同步三语命令说明与维护入口。

### Testing

- `node --test tests/document-graph.test.mjs`：通过；8 个文档图与索引测试零失败，覆盖全部 4 条 Codex 意见。
- `npm run verify`：通过；40 个测试、25 项技能检查、64 份治理文档检查、72 个模板检查、发布元数据检查和 171 项静态评测均为零失败。
- `npm run pack:check`：通过；npm dry-run 包含 1192 个文件，包大小约 629.5 kB，并在 prepack 阶段再次通过完整验证。
- `node bin/moonweave-skills.mjs checksums`：通过；刷新 1197 条发布文件校验和。
- `git diff --check` 与发布索引越界链接搜索：通过；补丁无空白错误，`docs/DOCUMENT-INDEX.md` 不再包含 `](../../` 链接。

### Notes

- `governance-skills/lib/document-graph.mjs`：将运行时根路径改为非序列化属性，按文档类型提取决策编号，转义链接标签中的表格分隔符，并支持仓库基准 URL。
- `governance-skills/bin/moonweave-skills.mjs`：为 `docs-index` 接入 `--base-url` 参数并更新命令帮助。
- `governance-skills/package.json`：让生成与漂移检查脚本使用权威仓库 URL 构建发布索引。
- `governance-skills/tests/document-graph.test.mjs`：增加 4 类 Codex 评审问题的针对性回归验证。
- `governance-skills/docs/DOCUMENT-INDEX.md`：重建发布索引，将越出 npm 包的相对链接替换为权威仓库链接。
- `governance-skills/docs/COMMANDS.md`：说明 `--base-url` 的发布场景与用法。
- `governance-skills/docs/zh/COMMANDS.md`：同步中文 `--base-url` 命令说明。
- `governance-skills/docs/ja/COMMANDS.md`：同步日文 `--base-url` 命令说明。
- `governance-skills/README.md`：将发布索引维护入口统一为 `npm run docs:index`。
- `governance-skills/README.zh.md`：同步中文发布索引维护入口。
- `governance-skills/README.ja.md`：同步日文发布索引维护入口。
- `governance-skills/checksums.sha256`：刷新本轮发布文件内容的校验和。
- `progress.md`：追加本轮 Codex 评审修复、验证证据、文件落点和回滚点。
- 回滚点：本轮修改前的提交为 `967ec617c380ed20524c8224ae8c90a4ade6bcc6`；提交后应对本轮提交执行 `git revert`，不得改写共享 PR 分支历史。
