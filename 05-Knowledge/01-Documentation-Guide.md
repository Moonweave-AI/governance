# 文档编写与知识资产管理规范

> 本文定义辉夜计划中文档、决策记录、研究记录、数据记录、模型记录和运维记录的编写、维护、审查、版本化、过期与归档规则。文档不是代码完成后的附属物，而是系统可理解、可维护、可复现、可审计和可传承的基础设施。一个工程成果只有在其知识记录足以让后来者理解、验证和接手时，才真正完成。

本文不替代：

- `03-Collaboration/03-RFC-Process.md`：重大提案的正式决策流程；
- `04-Engineering/01-Workflow.md`：工程实现流程；
- `04-Engineering/02-Quality-Assurance.md`：质量证据标准；
- `01-Foundation/02-Security-Ethics.md`：安全、隐私、合规与伦理边界。

本文覆盖上述文档**不涉及的知识管理问题**：哪些知识必须被记录？记录在哪里？谁负责维护？怎样写才可读、可审查、可复现、可继承？什么时候文档过期、废弃或被取代？

---

## 1. 目的与适用范围

本文定义辉夜计划的知识资产管理体系。

辉夜计划不是单一代码库，而是长期演化的 AI Agent、Infra、研究与具身系统。很多风险不是来自"没有代码"，而是来自"只有某个人知道为什么这样设计""只有某个聊天记录里提过""只有某次会议口头说了"。本文的目标是让这种隐性知识变成可追踪、可审查、可继承的正式资产。

适用于辉夜计划所有正式仓库、文档站和内部知识库中的：仓库 README、用户与开发者文档、API / 协议 / Schema 参考、RFC / ADR / Engineering Brief / Design Doc、实验日志 / 论文 Review / 复现记录、Dataset Card / Model Card / Evaluation Report、Runbook / Incident Report / Postmortem / Release Notes。

文档体系整体吸收 Diátaxis 的四分法（Tutorial / How-to / Reference / Explanation 分别服务不同读者需求）、Write the Docs 的 Docs as Code 理念（文档使用与代码相同的 Issue、Git、Review 和自动化工作流）以及 GitLab 将文档视为产品单一事实源的实践。

---

## 2. 文档原则

八条，专门约束知识资产管理：

1. **文档是知识资产，不是附属说明** — 任何需要被他人理解、维护、复现、审查或交接的知识，都应被视为知识资产。知识资产必须有事实源、Owner、状态和生命周期。对辉夜计划，知识腐烂不是"文档没跟上"，而是"系统变得不可理解、不可传承"。

2. **单一事实源** — 每个重要知识点只能有一个权威事实源。其他位置可以引用、摘要或索引，但不得形成冲突事实。当飞书、Notion、PR 评论和正式文档说法不一致时，正式文档（或 Git 中的对应记录）为准。

3. **Docs as Code** — 正式文档默认使用 Git 管理、通过 PR 修改、接受 Review、可自动检查、可追踪历史。代码变更若影响用户、接口、部署或维护方式，必须同步更新文档。重要知识不能只存在于聊天记录中。

4. **先选类型，再写内容** — 不要把教程、操作步骤、参考资料和背景解释混在同一篇文档中。写作前必须先判断读者是在学习（Tutorial）、完成任务（How-to）、查询事实（Reference），还是理解背景（Explanation）。

5. **面向读者任务，而非作者经历** — 文档应从读者要完成的任务和需要理解的问题出发，而不是按作者实现系统的顺序展开。读者不关心你的开发日记——他们想知道"我现在要做什么"和"这东西为什么这样"。

6. **重要结论必须可追溯** — 为什么采用某个架构、为什么弃用某个接口、为什么模型评测通过、为什么实验失败、为什么某个安全例外被接受——这些结论必须链接到 Issue / PR / RFC / ADR / 实验日志 / 评测报告或事故复盘。

7. **文档有状态和有效期** — 文档不是永远正确的。每份正式文档必须能表达当前状态：Draft / Active / Deprecated / Superseded / Archived。没有状态的文档无法被信任。

8. **研究文档必须支持复现** — 实验日志、数据记录和模型记录必须保留足够信息，使他人能够理解实验目的、环境、输入、配置、结果和结论——即使原作者已经离开。

---

## 3. 文档类型与事实源

| 文档类型 | 目的 | 权威事实源 | 何时必须存在 |
|----------|------|----------|-------------|
| README | 让读者快速判断项目是什么、怎么开始 | 每个仓库根目录 | 所有正式仓库 |
| Tutorial | 带新人完成第一次成功体验 | `docs/` 或文档站 | 面向外部用户或新人时 |
| How-to | 帮用户完成一个具体任务 | `docs/` / Runbook | 有重复操作需求时 |
| Reference | 精确描述 API、CLI、配置、Schema | 生成文档 + 源规范 | 存在公共接口时 |
| Explanation | 解释概念、背景、设计取舍 | 文档站 / repo docs | 概念复杂或跨团队时 |
| RFC | 重大变更的提案、论证和决策 | `05-Knowledge/rfc/` | 重大变更前 |
| ADR | 已作出的架构决策 | `05-Knowledge/adr/` | 架构性决定后 |
| Research Log | 实验、复现、负面结果 | `05-Knowledge/research-logs/` | 正式研究或可复用实验 |
| Dataset Card | 数据集来源、组成、许可、用途、限制 | 数据仓库 / research logs | 数据集被复用、训练或评测时 |
| Model Card | 模型用途、训练、评测、限制 | 模型仓库 / model registry | 模型被发布或部署时 |
| Runbook | 运维操作和故障处理 | repo docs / internal wiki | 有部署服务时 |
| Release Notes | 对用户说明发布变化 | GitHub Release / changelog | 每次正式发布 |
| Postmortem | 事故事实、影响、根因、行动项 | incident archive | P0/P1 或高风险事故后 |

核心规则：**一个事实只能有一个权威来源。** 如果你在 Notion 里写了一份操作指南，但仓库 README 里也有一份不同版本，读者不知道该信谁——这就是事实源冲突。

---

## 4. 文档元数据

所有正式知识文档应在文件头部维护最低元数据，使自动化工具和 Review 能判断文档状态：

**必须字段：**

- `owner` — 谁负责这份文档继续正确；
- `status` — Draft / Active / Deprecated / Superseded / Archived；
- `updated` — 最后实质更新日期；
- `last_reviewed` — 最后确认仍然正确的日期；
- `visibility` — public / internal / restricted；
- `type` — 文档类型。

**推荐字段：**

- `audience` — 目标读者；
- `area` — 所属 Area（Agent / Infra / Frontend / Backend / Data / Embodiment / Research）；
- `review_cycle` — 复审周期；
- `related_rfcs` / `related_adrs` / `related_issues` — 关联决策和工作项；
- `supersedes` / `superseded_by` — 替代关系；
- `sensitivity` — 是否涉及安全 / 隐私 / IP 敏感内容。

元数据格式可以采用 YAML front matter 或在文档首段以结构化方式呈现，具体格式由仓库约定。

---

## 5. README 规范

README 是每个仓库的入口——它不应写成宣传页，也不应写成完整手册。GitHub Open Source Guides 建议 README 回答：项目做什么、为什么有用、如何开始、哪里获得帮助。

### 5.1 README 推荐结构

一份合格的 README 应包含：

- **项目名称和一句话定位** — 读者花 5 秒就能判断这是否相关；
- **状态** — Experimental / Active / Production / Deprecated / Archived；
- **项目做什么** — 解决什么问题；
- **在辉夜计划中的位置** — 与其他仓库和系统的关系；
- **Quick start** — 最短可运行路径；
- **核心概念** — 不超过 5 个关键术语；
- **使用方式** — 基本用法示例；
- **开发** — 本地开发、测试、构建命令；
- **文档链接** — 指向完整文档、API Reference、RFC / ADR；
- **安全** — 如何报告安全问题；
- **贡献** — 如何参与；
- **许可** — 许可证；
- **Owner** — 负责人和联系方式。

### 5.2 README 禁忌

- 只有口号没有运行方法；
- 安装步骤过期但无人更新；
- 没有说明当前状态；
- 没有 Owner；
- 把完整架构设计文档塞进 README；
- README 与实际 CLI / API 行为不一致。

---

## 6. Tutorial / How-to / Reference / Explanation

本节采用 Diátaxis 四分法作为上位分类，根据辉夜计划场景裁剪。

### 6.1 Tutorial

**目的**：带读者完成第一次成功体验。读者在学习，不是在完成工作。

适合场景：首次运行 Agent、首次启动前后端、首次运行评测、首次使用仿真环境。

写作规则：线性展开；每一步可执行；必须有验证结果；不假设读者了解内部架构；不展开大量理论——背景链接到 Explanation。

### 6.2 How-to

**目的**：帮已有基础的用户完成一个具体任务。读者知道自己要做什么，需要操作指引。

适合场景：如何发布版本、如何新增 API endpoint、如何运行模型评测、如何处理 flaky test、如何执行数据库迁移。

写作规则：标题用"如何……"；只解决一个任务；条件放在指令前；指令用编号列表；不解释过多背景。

### 6.3 Reference

**目的**：提供准确、完整、可查的事实。读者在查询具体参数、字段或行为。

适合场景：API Reference、CLI Reference、配置项、Schema、状态机、错误码、Agent Tool Interface。

写作规则：中立、完整、可检索；不混入教程叙述；能自动生成的优先从源规范生成；公共接口 Reference 必须标注版本和兼容性。

Microsoft 的参考文档指南强调：参考文档应通过标准化结构和一致措辞帮助开发者快速找到所需信息。

### 6.4 Explanation

**目的**：解释背景、原理、设计取舍和概念模型。读者在寻求理解。

适合场景：状态持存设计思想、领域契约统一原因、Agent Memory 架构、具身安全边界原理、评测体系设计。

写作规则：可以有叙事和背景；不伪装成操作步骤；链接到 RFC / ADR / Reference；不替代正式决策记录。

---

## 7. API、协议与生成文档

辉夜计划跨越前端、后端、Agent、Infra、数据和具身执行，公共契约的文档必须强约束。

### 7.1 基本要求

所有公共 API、Schema、Protocol、Event、State Machine、Agent Tool Interface 和数据格式必须有权威规格文档，至少包含：版本、Owner、状态、兼容策略、字段说明、错误语义、示例和迁移说明。

### 7.2 生成文档规则

- 能从源规范（OpenAPI / Proto / GraphQL SDL）自动生成的 Reference，不手写重复版本；
- 手写文档负责解释"为什么"和"如何使用"，生成文档负责描述"是什么"；
- 公共契约变更必须链接 RFC / ADR / PR；
- Breaking change 必须有迁移文档和版本说明。

Kubernetes 文档体系采用"手写解释 + 自动生成参考"的模式：API Reference、kubectl Reference 等从源码自动生成，概念和任务指南由人工编写。辉夜计划应采用相同分工。

---

## 8. 架构文档、RFC 与 ADR

### 8.1 RFC

RFC 记录重大变更的提案背景、问题、方案、替代方案、风险、讨论和最终决定。它回答：**我们是否应该这样做？为什么？**

RFC 的完整流程和模板定义在 `03-Collaboration/03-RFC-Process.md` 中。本文只强调文档管理层面的规则：RFC 是历史记录，Accepted / Rejected / Superseded 的 RFC 不应被回头大幅修改。后续行为应维护在 ADR、标准文档或实现 Issue 中。

### 8.2 ADR

ADR 记录已经作出的架构决策：当时上下文、决策内容、被排除的方案、理由和后果。它回答：**我们已经决定了什么？这会带来什么后果？**

ADR 应作为 append-only log 维护——已接受的记录不回头改写；若决策变化，写新的 ADR 并链接原记录。Microsoft Azure Well-Architected Framework 建议 ADR 只记录影响系统结构、关键质量属性或难以逆转的决策。

ADR 推荐结构：Status（Proposed / Accepted / Deprecated / Superseded）→ Context → Decision → Consequences → Alternatives Considered → Related RFCs → Superseded By。

### 8.3 Engineering Brief 与 Design Doc

Engineering Brief 定义在 `01-Workflow.md` §6。Design Doc 是 RFC 被接受后、进入实现前的详细技术设计。两者都属于知识资产，应有 Owner 和状态，变更走 PR Review。

---

## 9. Research Logs、Paper Review 与实验记录

`05-Knowledge/research-logs/` 是辉夜计划非常重要的知识目录。项目涉及 Agent 研究、AI Infra 探索和具身智能实验——这里不能只存"成功结果"，必须存"过程"和"失败"。

### 9.1 实验日志

每次正式实验或可复用的探索性工作应记录：研究问题、假设、动机、实验环境（代码版本 / 数据版本 / 模型版本 / 配置 / 硬件 / 随机种子）、方法、评估指标、原始结果、分析、负面结果、局限性、复现方式和结论。

核心规则：

- 失败实验也必须记录——负面结果防止重复浪费；
- 结果必须链接代码、配置、数据和环境版本；
- 如果无法复现，必须说明原因；
- 实验结论不得夸大适用范围；
- 实验状态应标注：进行中 / 完成 / 归档 / 作废。

The Turing Way 将可复现性定义为数据和代码可用、分析能被完整重新运行。辉夜计划的研究日志应以此为最低标准。

### 9.2 Paper Review

对辉夜计划相关论文的审读记录：引用信息、摘要、问题、方法、证据、优缺点、假设、对辉夜计划的意义、可复现性评估、风险评估、后续行动（是否需要复现 / 实验 / RFC / 工程化）。

### 9.3 数据集记录

每个被正式使用的数据集应维护完整记录：身份信息（名称 / 版本 / Owner / 来源 / 许可 / 存储 / 访问控制）、动机、组成、采集过程、预处理、允许用途、禁止用途、隐私与授权问题、偏差与局限、质量检查结果和版本历史。

Datasheets for Datasets 提出数据集应附带说明其动机、组成、采集过程和推荐用途的文档。FAIR 原则要求数字资产具备可发现、可访问、可互操作和可复用的特征。辉夜计划正式复用或发布的数据集应同时满足这两套要求。

---

## 10. Dataset Card、Model Card 与 AI 资产记录

### 10.1 Dataset Card

Dataset Card 面向数据使用者，帮助他们判断数据集是否适合自己的用途。最低内容：名称和版本、来源和许可、规模和格式、数据组成描述、预处理说明、推荐与禁止用途、偏差和局限、隐私和敏感信息声明、质量检查结果、引用方式和相关实验/模型。

Hugging Face Dataset Cards 的实践可作为格式参考，但辉夜计划应额外强调来源合规性（对齐 `02-Security-Ethics.md` §4 资产与来源安全）。

### 10.2 Model Card

Model Card 面向模型使用者和审查者。最低内容：名称和版本、基座模型、训练数据来源、训练参数、评测结果和指标、适用场景和超出范围的使用、限制和偏差、安全注意事项、推理成本和延迟、已知失败模式、回滚或替代方案、引用方式。

Model Cards for Model Reporting 要求发布的模型附带文档说明适用边界、评估流程和局限。辉夜计划的每个正式模型服务都应维护 Model Card。

### 10.3 Agent Behavior Record

辉夜计划特有的文档类型：凡是具备工具调用、长期记忆、用户交互或外部动作能力的 Agent，都需要行为记录。内容包括：Agent 身份和版本、能力范围、工具列表和权限边界、记忆策略、人格/行为约束、评测结果、已知失败模式、安全缓解措施、人类交接方式、审计日志要求和版本历史。

---

## 11. Runbook、Incident、Release 与运维文档

### 11.1 Runbook

Runbook 面向维护者，不是普通用户教程。有生产服务就必须有 Runbook。

内容应覆盖：系统用途、Owner 和升级路径、系统概览和依赖、监控 Dashboard 链接、告警说明、常见操作步骤、事故处理流程、回滚方式、备份恢复方式、已知故障模式和相关链接。

规则：Runbook 必须能在事故中使用（时间压力下可操作）；不得写入密钥或凭据；必须定期演练或审查。

### 11.2 Incident Report / Postmortem

P0/P1 或高风险事故后必须产出 Incident Report，记录：摘要、影响范围和时长、时间线、检测方式、根因、促成因素、解决方式、做得好的、做得不好的、行动项（含 Owner / Due / Tracking Issue）和后续文档更新。

Postmortem 的目的是沉淀教训、防止复发——不是追究个人责任。行动项必须可追踪，不能停留在"下次注意"。

### 11.3 Release Notes

Release Notes 面向用户和维护者，不是 Git log 的复制。应包含：重点变化摘要、破坏性变更、新功能、修复、安全更新、迁移说明、已知问题和贡献者致谢。语言应让不看代码的用户也能理解影响。

---

## 12. 写作风格与语言规范

### 12.1 基本风格

精确、简洁、直接、面向任务。避免宣传腔、无定义缩写、堆叠抽象名词和把不确定结论写成事实。Google Developer Documentation Style Guide 和 Microsoft Writing Style Guide 的共同建议是：使用主动语态、第二人称、清晰条件顺序和描述性链接。

### 12.2 中英文规则

辉夜计划文档以中文为主，英文术语按以下规则处理：

- 首次出现：中文术语（English Term）或 English Term（中文释义）；
- 后续优先使用已确定的称呼，不在同一仓库中为同一概念使用多个译名；
- 专有名词、协议名、工具名、API 名保持原文；
- 不确定的译名进入术语表（Glossary），而不是每篇文档自行翻译。

### 12.3 禁止性表达

以下措辞在正式文档中应避免或替换：

- "显然""简单地""只需要""很容易" — 隐藏了读者成本和环境差异；
- "众所周知""不必多说" — 假设了读者知识；
- "绝对安全""完美""永远不会" — 隐藏了风险和限制边界；
- "生产可用"但没有对应质量证据 — 未经验证的断言不是文档。

---

## 13. Markdown、代码示例、图表与媒体

### 13.1 Markdown 规范

- 使用 GitHub Flavored Markdown；
- 每篇文档只有一个 H1（即标题）；
- 标题层级不跳跃（不从 H2 直接到 H4）；
- 使用相对链接引用同仓库内文档；
- 代码块必须标注语言；
- 命令示例必须可复制（不含无关的 shell prompt 符号）；
- 表格用于结构化对比，不用于大段正文；
- 图片必须有 alt text；
- 不提交无法溯源的媒体资产。

### 13.2 代码示例

代码示例是文档的可执行承诺。要求：

- 最小可运行，不依赖作者本机路径或隐式环境；
- 明确依赖版本；
- 不包含真实密钥或凭据；
- 有预期输出；
- 与当前 API / CLI 版本保持一致；
- 关键示例应进入 CI 测试（doc test）。

### 13.3 图表

- 简单流程图使用 Mermaid（可版本化、可 diff）；
- 复杂架构图保留源文件 + 导出图片（两者都提交）；
- UI 截图标注版本和日期（截图会过期）；
- 研究图表链接生成脚本和数据版本。

图表必须能找到源文件；不得在图表中泄露隐私、密钥或未公开信息；架构图必须链接相关 RFC / ADR。

---

## 14. 文档工作流与 Review

### 14.1 文档变更流程

```text
Identify doc need
  ↓
Choose doc type
  ↓
Create draft (PR)
  ↓
Technical review
  ↓
Docs review (readability, accuracy, completeness)
  ↓
Security / privacy / AI / IP review (if applicable)
  ↓
Merge
  ↓
Publish / index
  ↓
Periodic review
  ↓
Update / deprecate / archive
```

### 14.2 必须同步更新文档的情况

满足任一条件，PR 必须包含文档更新或新增文档：

- 新增、修改或删除公共 API / Schema / CLI / 配置；
- 修改部署、环境变量或运行方式；
- 修改 Agent 行为、工具权限或记忆策略；
- 修改模型、数据集或评测方法；
- 修改安全、隐私或合规边界；
- 修改具身控制、仿真或执行器行为；
- 发布新版本；
- 弃用或归档功能；
- 发生影响使用或维护方式的事故。

### 14.3 文档 Review 要求

| 文档类型 | 必需 Review |
|----------|-------------|
| README | Repo Owner |
| Tutorial / How-to | 技术 Reviewer + 目标读者视角 |
| Reference | API / Schema Owner |
| RFC | `03-RFC-Process.md` 中定义的 Reviewer |
| ADR | 架构 Owner / Maintainer |
| Research Log | Research Reviewer |
| Dataset Card | Data Owner + License / Privacy Reviewer |
| Model Card | AI Owner + Eval Reviewer |
| Runbook | Service Owner + Infra / SRE Reviewer |
| Security-sensitive docs | Security Reviewer |

---

## 15. 文档版本、过期、废弃与归档

### 15.1 文档状态定义

| 状态 | 含义 |
|------|------|
| **Draft** | 草稿，不能作为事实源 |
| **Active** | 当前有效，是权威事实 |
| **Deprecated** | 仍可读，但不建议作为新工作依据 |
| **Superseded** | 已被新文档替代，链接到替代文档 |
| **Archived** | 历史记录，仅保留审计和追溯价值 |

### 15.2 复审周期

| 文档类型 | 默认复审周期 |
|----------|-------------|
| 原则 / 治理 / 工程标准 | 6–12 个月 |
| README | 3–6 个月 |
| API / Reference | 每次 release |
| Runbook | 每次相关事故后 + 每季度 |
| RFC | 不改历史，只新增 superseding RFC |
| ADR | 不改历史，只新增 superseding ADR |
| Research Log | 实验结束后归档 |
| Dataset / Model Card | 每次数据或模型版本变更 |
| Security docs | 每季度或重大风险变化后 |

### 15.3 版本化文档

只有当用户必须根据具体软件版本读取不同说明时，才启用版本化文档。Kubernetes 只维护当前版本和前四个版本的文档——这种有限窗口比"永远维护所有历史版本"更可持续。辉夜计划应在正式公共 API 稳定后再引入文档版本化，避免过早增加维护负担。

### 15.4 文档废弃流程

文档废弃不是删除。流程：标记为 Deprecated 或 Superseded → 在文档头部添加替代路径 → 相关索引更新 → 设置归档日期 → 归档后移入历史目录或标记为 Archived。已归档文档应保留在版本控制中，以支持审计和追溯。

---

## 16. 文档质量检查与自动化

文档也应进入 CI。

### 16.1 自动化检查基线

正式文档仓库的 CI 应包含：

- Markdown lint（标题层级、格式一致性）；
- 链接检查（broken links、broken anchors）；
- 拼写检查；
- Prose lint（Vale 或等价工具，检查风格规则）；
- Front matter 校验（Owner / status / updated 是否存在）；
- 代码块语法校验；
- 禁止模式扫描（secret / token / 硬编码凭据）；
- 生成文档一致性检查（生成 Reference 是否与源规范同步）。

Vale 是面向 prose 的 linter，支持自定义风格规则；markdownlint 是 Markdown 静态分析工具。两者配合可覆盖文档的结构和语言质量。

### 16.2 Kaguya Doc Steward

辉夜计划可部署文档 Agent 辅助知识管理：检查文档缺少 Owner 或过期 review date、检查 broken links、检查 README 是否缺少状态 / Owner / Quick start、检查 RFC 通过后是否有对应 Implementation Issue、检查 ADR 是否缺少 superseded 链接、检查 Research Log 是否缺少数据 / 代码 / 配置 / 结果、每周生成 Documentation Health Digest。

> Kaguya Doc Steward 可以提醒、总结和创建草稿 PR；不得自动修改事实性结论；不得替代 Owner 确认文档有效；不得将受限文档摘要推送到公开频道。

---

## 17. AI 辅助写作规范

辉夜计划允许使用 AI 辅助文档工作，但文档始终由人类负责。

**允许：**

- 草拟结构和大纲；
- 改写和润色句子；
- 总结会议记录；
- 从 RFC / ADR 草拟摘要；
- 检查术语一致性；
- 生成初版 FAQ 或 Glossary 条目。

**禁止：**

- 把未经验证的 AI 输出作为事实发布；
- 使用 AI 编造引用、实验结果、API 行为或历史决策；
- 把未公开代码、密钥、用户数据或研究数据输入外部 AI 服务；
- 用 AI 自动批准 RFC、ADR、Research Log 或安全文档；
- 用 AI 生成作者无法解释的技术文档。

> AI-assisted documentation remains human-owned documentation. Author 对内容负完全责任。

---

## 18. 模板与检查清单

以下模板为辉夜计划知识管理体系的配套产出物，具体内容随实践迭代，放入 `templates/` 或对应仓库的 `docs/`：

- README template
- Tutorial template
- How-to template
- Reference template
- Explanation template
- RFC template
- ADR template
- Research Log template
- Paper Review template
- Dataset Record template
- Dataset Card template
- Model Card template
- Agent Behavior Record template
- Runbook template
- Incident Report / Postmortem template
- Release Notes template

### Definition of Done for Documentation

一份正式文档只有满足以下条件才能视为完成：

- 文档类型正确选择；
- 有 Owner；
- 有明确状态；
- 有目标读者；
- 事实有来源或引用支撑；
- 链接可用；
- 示例可运行或已标注限制；
- 相关 Issue / PR / RFC / ADR 已互相链接；
- 安全、隐私、IP 信息未泄露；
- 必要 Review 已完成；
- 已加入索引或导航；
- 下次复审时间已设置。

---

## 19. 反模式

以下行为属于文档与知识管理反模式：

1. 只有代码，没有 README；
2. README 只有项目口号，没有 Quick start 和当前状态；
3. 文档事实散落在飞书、Notion、PR 评论和个人记忆中，无权威事实源；
4. 教程、参考、解释和决策记录混在一篇文档里；
5. PR 改了接口但不改 Reference 和使用文档；
6. RFC 通过后没有 ADR、Implementation Issue 或标准文档更新；
7. ADR 被回头改写而不是新增 superseding ADR；
8. 实验只记录成功结果，不记录配置、数据版本和失败；
9. 数据集没有来源、许可、用途和限制说明；
10. 模型发布没有 Model Card 和 Eval Report；
11. Runbook 只在事故后口头传授；
12. 图表没有源文件，无法更新和追溯；
13. 示例代码不可运行但没有说明；
14. 文档没有 Owner，无人对其正确性负责；
15. Deprecated 内容没有替代路径指引；
16. 文档过期但仍被当作事实源使用；
17. AI 生成文档未经人工验证；
18. 为了"完整"写长文，但读者无法从中完成任何任务。

---

## 20. 修订

本文只能通过公开 RFC 修订，修订需写明是知识管理实践被证明过重或缺失、新类型资产缺少覆盖、还是某条规则在实践中阻碍而非促进知识沉淀。与 `01-Foundation/01-Principles.md` 的"冲突与修订"一致：当本文与安全审查或组织权限冲突时，以对应专项文档为准；底线优先。旧版存于版本控制，随时可查。

本文的硬核心只有五条：

1. 所有正式知识必须有事实源。
2. 所有正式文档必须有 Owner 和状态。
3. 所有重要工程与研究结论必须可追溯。
4. 文档变更必须进入 Review 与自动化检查。
5. 过期知识必须被标记、替代或归档。

守住这五条，`05-Knowledge/` 就不会只是一个资料夹，而是辉夜计划的长期组织记忆系统：它记录为什么做、怎么做、做过什么、失败过什么、决定过什么，以及后来的人如何继续接手。
