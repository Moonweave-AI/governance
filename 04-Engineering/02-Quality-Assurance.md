# 质量保障规范

> 本文定义辉夜计划中软件、AI Agent、前后端系统、基础设施、数据管线、模型服务、研究实验、具身控制系统与公开资产的质量保障体系。质量保障不是发布前的测试阶段，而是贯穿设计、实现、审查、构建、发布、运行、反馈与退役的持续证据系统。一个工程成果只有在其质量证据足以支撑对应风险等级和生命周期承诺时，才可以被合并、发布、上线、公开或进入长期维护。

本文不替代：

- `01-Workflow.md`：定义工程工作如何推进；
- `01-Foundation/02-Security-Ethics.md`：定义安全、隐私与伦理的硬底线；
- `standards/*`：定义各技术栈的具体实现标准。

本文与上述文档的关系是：Workflow 定义流程节点，Security-Ethics 定义不可突破的边界，Quality-Assurance 定义**在每个节点、什么证据足以证明系统是正确、可靠、安全、可维护、可观测、可发布、可运行、可退役的**。

---

## 1. 目的与适用范围

本文回答一个核心问题：辉夜计划的工程产出凭什么被认为"可以交付"？

答案不是感觉，不是口头确认，不是"本地跑过了"——是可检查、可追溯、可自动化验证的证据。这套证据体系覆盖从设计审查到运行监控的全生命周期，并根据风险等级分配不同的证据强度。

适用于辉夜计划所有正式仓库中的代码、服务、数据、模型、Agent、协议、前后端系统、基础设施、具身控制系统与公开发布的资产。

整体框架吸收 NIST SSDF 的安全开发生命周期思路、Google Testing 的大规模验证体系、Kubernetes Production Readiness Review 的特性生产就绪机制、ROS 2 REP-2004 的软件包质量声明，以及 Google SRE 的运行可靠性管理——共同点是：质量不能只靠发布前检查，必须贯穿生命周期。

---

## 2. 质量原则

八条，专门约束质量判断：

1. **质量是证据，不是感觉** — 任何系统被称为"可用""稳定""安全""已完成"，都必须有可检查的证据支撑。测试结果、评测报告、Review 记录、运行指标、安全扫描、模型卡、仿真记录、事故复盘都算证据；"应该没问题""先上坏了再说"不算。

2. **风险决定质量强度** — 短生命周期、可逆、低影响变更轻量验证；长期、跨系统、不可逆、涉及安全 / 隐私 / AI / 具身的变更必须提供更强证据。证据强度与 `02-Security-Ethics.md` §3 的 S0–S5 风险分级对齐。

3. **测试左移，运行验证不缺席** — 质量问题应尽早在设计、静态检查、单元测试和 Review 中暴露。但上线后的监控、SLO、告警、事故复盘和用户反馈同样是质量证据的组成部分，不是"运维的事"。

4. **小测试多，大测试少，关键路径端到端** — 测试组合以快速、确定、可定位的低层测试为基础；集成测试验证边界；E2E 只覆盖关键用户旅程和高风险回归路径。金字塔可以调比例，但不能倒过来。

5. **不稳定测试本身就是缺陷** — 相同代码和配置下时而通过、时而失败的测试，会摧毁 CI 信任。Flaky test 必须被修复、隔离或删除，不允许长期通过反复 rerun 掩盖。

6. **质量内建于变更，不堆积到发布前** — 测试、文档、可观测性、回滚、迁移和安全验证是正常工程变更的一部分，不是发布前临时补的补丁。

7. **质量问题必须形成闭环** — Bug、回归、事故、评测失败和具身异常都必须追踪到根因，补充防回归机制，并沉淀到测试、文档、监控或设计约束中。只修现象不防复发等于没修。

8. **AI 与具身系统需要额外质量维度** — AI 系统不能只用传统软件测试判断质量——需要行为评测、对抗测试、漂移监控和权限审查。具身系统不能只用数字仿真判断质量——需要物理边界、硬件测试、人类接管和急停验证。

---

## 3. 质量对象与质量等级

### 3.1 QA Level

辉夜计划为不同生命周期和风险场景的产出物定义六级质量等级。它不替代 S0–S5 安全等级，而是规定每级所需的**最低质量证据强度**。

| 等级 | 名称 | 适用对象 | 最低质量证据 |
|------|------|----------|-------------|
| **QA-L0** | Draft | 草稿、想法、非正式笔记 | 标注状态即可，无发布承诺 |
| **QA-L1** | Experiment | 研究 spike、一次性脚本、本地实验 | 可复现记录、数据来源说明、过期时间 |
| **QA-L2** | Maintained Component | 可复用库、CLI、SDK、内部工具 | CI、单元测试、文档、Owner、变更记录 |
| **QA-L3** | Production Service | 联网服务、状态系统、数据管线、公共 API | 集成测试、契约测试、SLO、监控、告警、Runbook、回滚方案 |
| **QA-L4** | AI / Agent System | Agent、RAG、模型服务、长期记忆、工具调用 | Eval Report、对抗测试、数据/模型卡、权限审查、行为回归、漂移监控 |
| **QA-L5** | Embodied / Safety-Critical | 传感器、执行器、具身控制、高自由度物理系统 | 仿真、SIL/HIL、物理边界、E-Stop 验证、HITL、事故演练、独立安全审查 |

QA-L 与 S 等级的关系：S 等级定义安全风险高度，QA-L 定义质量证据广度。一般而言 S3 对应 QA-L3、S4 对应 QA-L4、S5 对应 QA-L5，但一个低安全风险的长期服务仍应保持 QA-L3 的运行质量证据。

### 3.2 质量等级声明

所有 QA-L2 及以上的正式仓库或长期组件应维护 `QUALITY.md`，声明其质量等级、覆盖范围、版本策略、测试覆盖、安全措施、运行保障、已知限制和审查周期。这份声明是组件向依赖者作出的公开质量承诺——如果你声称自己是 QA-L3，你的证据就必须支撑 QA-L3 的全部要求。

ROS 2 REP-2004 采用类似思路：声称某个质量等级的软件包必须在版本策略、变更控制、文档、测试和依赖管理方面证明自己满足该等级的全部条件。辉夜计划在此基础上增加了 AI/Agent 和具身系统的专项维度。

---

## 4. 质量证据体系

质量保障的核心不是流程，而是证据。以下分类回答"什么算证据"：

| 证据类型 | 典型形式 | 适用阶段 |
|----------|----------|----------|
| 设计证据 | RFC、ADR、Engineering Brief、Threat Model、Hazard Analysis | 实现前 |
| 实现证据 | PR、Code Review 记录、CODEOWNERS Approval | 开发期 |
| 自动化证据 | CI 报告、测试报告、Coverage、静态分析结果 | 持续 |
| 安全证据 | SAST、依赖扫描、Secret Scan、ASVS Checklist、容器扫描 | 持续 |
| 供应链证据 | SBOM、SPDX、SLSA Provenance、签名、镜像 digest | 发布时 |
| 数据证据 | Dataset Card、schema 验证、漂移报告、去重报告、来源声明 | 数据变更时 |
| 模型证据 | Model Card、Eval Report、版本记录、Prompt/Policy snapshot | 模型变更时 |
| 运行证据 | SLO 报告、监控 Dashboard、日志、Tracing、告警记录、事故 Postmortem | 运行期 |
| 用户证据 | 可用性测试、可访问性报告、反馈记录、Core Web Vitals | 交付后 |
| 具身证据 | 仿真记录、SIL/HIL 日志、E-Stop 测试、物理测试记录 | 具身系统全周期 |

原则：**证据类型必须与质量等级匹配**。QA-L2 不必有 SLO 报告；但 QA-L3 没有监控证据就不能声称生产就绪。

---

## 5. 质量门禁

质量门禁是从设计到运行的连续检查点，不是发布前一次性大检查。

### Gate Q0：Quality Planning

所有 QA-L2 及以上事项在实现前必须回答：当前质量等级是什么、风险等级是什么、测试策略是什么、需要哪些 Review、需要哪些证据、发布门禁有哪些、回滚方式是什么、谁负责。这些信息应写入 Engineering Brief 或 Issue。

### Gate Q1：Design Quality

适用于公共 API、长期状态系统、新基础设施、数据管线、Agent 行为、模型服务、具身控制和不易回滚的迁移。审查点包括问题定义是否清晰、不变量是否被定义、失败模式是否被识别、兼容策略是否明确、测试和观测计划是否可执行、回滚策略是否存在。

Kubernetes KEP 要求每个增强提案在 Test Plan、Graduation Criteria 和 Production Readiness Review 中提前回答这些问题。辉夜计划的 Design Quality Review 是同一思路的简化版。

### Gate Q2：Implementation Quality

PR 阶段的质量检查。核心逻辑有测试、错误处理明确、新依赖有来源和许可、公共契约变更已同步、CI 通过、Review 完成。这与 Google Code Review 的标准一致：变更应让代码库整体健康持续改善。

### Gate Q3：CI Quality Gate

自动化验证的硬门禁。基础项包括 format、lint、typecheck、unit test、integration test、build、dependency scan、secret scan、license check。高风险项增加契约测试、E2E、迁移 dry run、benchmark、安全测试、AI eval、数据验证、仿真测试和回滚测试。CI 失败必须阻断合并，不允许口头放行。

### Gate Q4：Release Quality Gate

发布前最终确认。所有阻断缺陷已关闭、Release artifact 可追溯、SBOM / provenance 已生成、监控和告警就位、回滚方案可用、Owner 接收运维责任。高风险发布还需安全 Reviewer 和 AI/具身专项 Reviewer 签字。

Google SRE 的 Production Readiness Review 和 Kubernetes PRR 都要求特性在进入生产前证明其可观测、可扩展、可支持、可回滚。辉夜计划的 Release Quality Gate 是这一思路的直接应用。

### Gate Q5：Operational Quality Gate

上线后的持续质量验证。Health check、smoke test、error rate、latency、资源用量、日志、tracing、告警噪声、SLO burn rate、rollback readiness 都是运行质量的证据。部署不是质量终点——运行反馈是证据的最后一环。

---

## 6. 测试分层策略

### 6.1 测试金字塔

```text
Static Checks         ← 最快、最多、最廉价
  ↓
Unit Tests
  ↓
Component Tests
  ↓
Integration Tests
  ↓
Contract Tests
  ↓
E2E Tests
  ↓
Performance Tests
  ↓
Security Tests
  ↓
AI / Agent Evaluations
  ↓
Simulation / HIL
  ↓
Post-deploy Checks    ← 最慢、最少、最昂贵
```

原则：越底层的测试越多、越快、越确定；越上层的测试越少、越慢、越关键。辉夜计划保留 Google Testing Blog 的经验比例（约 70/20/10）作为初始参照，但允许根据系统特征调整——前提是不能反转金字塔。

### 6.2 Static Checks

在运行测试前用最低成本排除低级错误：格式化、lint、类型检查、死代码检测、依赖策略、许可证扫描、secret 扫描、API schema 一致性检查。所有正式仓库的 CI 必须包含完整静态检查。

### 6.3 Unit Tests

验证纯函数、领域逻辑、状态转移、序列化、错误处理、权限判断和数据转换。要求快速、确定、不依赖真实网络或外部服务、不依赖本地个人环境。如果一个测试需要真实数据库或模型服务才能跑，它不是单元测试。

### 6.4 Component Tests

验证单一模块的边界行为：前端组件、后端 handler、Agent tool wrapper、数据 validator、状态机组件。组件测试验证模块接口契约，不重复测试内部实现细节。

### 6.5 Integration Tests

验证多模块协作：API + 数据库、服务 + 消息队列、前端 + mock 后端、Agent + tool sandbox、RAG + 向量存储、数据管线的多阶段衔接、ROS 节点通信。集成测试暴露的是单元测试无法发现的边界问题。

### 6.6 Contract Tests

辉夜计划强调前后端统一和领域契约统一，因此契约测试地位特殊。适用于 OpenAPI / gRPC / GraphQL schema、前端生成类型、后端实现一致性、Event schema、状态机迁移规则、Agent tool interface 和 ROS message/service/action。

核心规则：**公共契约变更必须伴随契约测试。破坏性变更必须有 RFC、迁移说明和版本策略。**

### 6.7 E2E Tests

只覆盖关键用户旅程、核心业务流和高风险回归路径。E2E 应少而关键——不用大量脆弱 E2E 替代更底层的测试。Playwright 的 Trace Viewer 可记录 DOM snapshots、网络请求和截图，适合作为 CI 中 E2E 失败的证据存档。

### 6.8 Performance Tests

适用于 API 服务、runtime scheduler、向量检索、模型推理、长上下文处理、前端渲染、机器人控制循环和数据管线。最低指标：latency p50/p95/p99、throughput、error rate、资源消耗、冷启动、降级行为。Google SRE 的压力测试原则适用：帮助量化对系统未来可靠性的信心。

### 6.9 Security Tests

依赖扫描、SAST/CodeQL、认证授权测试、输入验证、注入防护、SSRF 防护、速率限制、容器扫描。Web/API 服务最低参考 OWASP ASVS。

### 6.10 AI / Agent Evaluations

传统测试无法覆盖 AI 行为——需要评测体系。详见 §13。

### 6.11 Simulation / HIL

具身系统的物理前验证。详见 §14。

---

## 7. 静态质量与代码健康

### 7.1 静态检查基线

所有正式仓库必须在 CI 中执行：格式化、lint、类型检查、未使用依赖检测、禁止依赖策略、生成文件一致性、API schema diff、许可证元数据和 secret 扫描。这些检查不通过必须阻断合并。

### 7.2 代码健康

代码健康不止于"没有 lint 错误"。Review 和持续维护应关注：正确性、可读性、简单性、模块边界清晰度、依赖方向合理性、错误处理完备性、并发安全、资源释放、可测试性、可观测性和文档同步。

Google 对 Code Health 的定义适合作为方向：让代码更易理解、库更简单、迭代更短、稳定性和性能更好。辉夜计划的 Code Review 应以长期代码健康为目标，而不是追求单次提交的完美。

---

## 8. Review 质量

`01-Workflow.md` 定义 Review 流程；本节定义 Review 应检查什么。

### 8.1 Reviewer 检查维度

1. 变更是否解决了正确问题；
2. 方案是否符合现有架构和领域模型；
3. 复杂性是否被必要性证明；
4. 测试是否覆盖核心行为和失败路径；
5. 是否破坏公共契约或兼容性；
6. 是否引入安全、隐私、供应链或数据风险；
7. 是否影响运行、发布、回滚或监控；
8. 文档是否同步；
9. 是否应先走 RFC / ADR；
10. 是否引入需要追踪的质量债。

### 8.2 Review 结论

Review 不只有"通过"和"拒绝"。结论应明确引导后续行动：Approve、Request Changes、Needs RFC、Needs Security Review、Needs AI Eval、Needs Embodiment Safety Review、Needs Owner Decision。

### 8.3 高风险变更的专项 Review

| 变更场景 | 额外 Review 要求 |
|----------|------------------|
| 公共 API / Schema | API Owner + 受影响客户端代表 |
| 数据处理 / 隐私 | Data Owner + Privacy Reviewer |
| 模型 / Agent 行为 | AI Eval Reviewer + Security Reviewer |
| 具身控制 | Embodiment Safety Reviewer |
| 生产服务 | Infra / SRE Reviewer |
| 供应链 / 发布制品 | Security / Release Reviewer |

普通 Review 确保代码健康；专项 Review 确保高风险变更不会在专业盲区留下缺口。

---

## 9. CI/CD 质量门禁

CI 是质量证据的自动化生产线。建议标准化 workflow 结构，而不是让每个仓库自由发挥。

### 9.1 基础 CI

每个正式仓库必须包含：元数据校验、依赖锁定安装、格式检查、lint、类型检查、单元测试、集成测试、构建、artifact 上传。这些全部通过才允许合并。

### 9.2 安全 CI

独立的安全 workflow：secret 扫描、依赖审查、SAST/CodeQL、许可证检查、容器扫描（如适用）、SBOM 生成。安全 CI 的失败不能被工程效率覆盖——安全证据缺失等于质量不达标。

OWASP SAMM 将安全能力划分为 Governance、Design、Implementation、Verification 和 Operations；辉夜计划的安全 CI 覆盖其中 Implementation 和 Verification 的自动化验证部分。

### 9.3 Release CI

发布 workflow：版本校验、Changelog 检查、artifact 构建、SBOM 和 provenance 生成、签名、发布候选、staging 部署、smoke test。Release CI 只能从受保护分支或 tag 触发。

### 9.4 Nightly / Scheduled CI

低频但深度的质量验证：慢速测试、全量回归、性能 benchmark、AI eval suite、数据漂移检查、依赖更新 dry run、flaky test 检测。这些测试太慢不适合 PR 级触发，但对整体质量基线不可或缺。

---

## 10. API、协议与契约质量

辉夜计划跨越前端、后端、Agent、Infra、数据和具身执行，契约一致性是跨系统可靠性的基础。

### 10.1 契约质量要求

- Schema 有权威来源（OpenAPI / Proto / GraphQL SDL）；
- API 有版本策略和弃用窗口；
- 错误格式跨服务一致；
- Breaking change 有自动检测和 RFC 流程；
- 前端类型由契约生成而非手写；
- Event / Message 有兼容性验证；
- 状态机迁移规则有形式化测试；
- Deprecated 字段有明确迁移时间线。

### 10.2 契约测试方式

推荐组合：schema diff 自动比较、生成客户端编译测试、consumer-driven contract test、向后兼容测试、迁移 dry run、golden file snapshot 和 conformance suite。

Kubernetes Conformance 确保不同实现支持所需 API 以实现互操作。辉夜计划可以为公共协议和 Agent Tool API 建立自己的 conformance suite，确保多仓库、多语言实现之间不会悄悄漂移。

---

## 11. 前端、可用性与可访问性质量

前端质量不只是"页面能打开"。

### 11.1 前端质量维度

功能正确性、组件一致性、状态管理正确性、API 契约匹配、可访问性（WCAG）、性能（Core Web Vitals）、响应式布局、错误状态处理、空状态和 Loading 状态、国际化准备、视觉回归。

### 11.2 前端测试要求

组件测试覆盖独立组件行为；API mock / contract test 确保前后端契约一致；E2E 覆盖核心交互路径；可访问性检查确保键盘导航和辅助技术兼容；性能预算确保 LCP、INP、CLS 不超限。

Core Web Vitals 将 LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1 作为良好体验阈值。辉夜计划的前端项目应以此为性能基线。

### 11.3 可用性验证

对关键界面应进行可用性验证，尤其是 Agent 状态可视化、评测 Dashboard、仿真控制面板和 Onboarding 流程。可用性测试的核心是观察真实用户执行任务时的行为和阻碍——ISO 9241-11 将可用性定义为特定用户在特定环境下以有效性、效率和满意度达成目标的程度。

---

## 12. 后端、服务与运行质量

### 12.1 服务质量维度

API 正确性、数据一致性、事务边界、并发安全、超时与重试策略、幂等性、认证授权、速率限制、资源隔离、可观测性、回滚与降级、备份恢复、迁移安全。

### 12.2 后端测试要求

单元测试覆盖业务逻辑；集成测试覆盖数据库交互和外部服务调用；契约测试确保 API 一致性；迁移测试验证 schema 变更安全；授权测试验证权限边界；故障注入验证降级行为；负载测试验证容量。

### 12.3 SLO 与运行质量

所有 QA-L3 及以上服务应定义 SLO，至少覆盖可用性、延迟和错误率。数据管线还需 freshness SLO；存储系统需 durability SLO。每个 SLO 应有对应的 error budget policy——预算耗尽时的行动不能是空白。

Google SRE 的核心洞见：100% 可靠性既不现实也不理想。SLO 和 error budget 的价值在于在可靠性和创新速度之间建立明确而可操作的平衡点。辉夜计划应逐步建立这一体系，而不是只在事故后临时补 SLO。

---

## 13. 数据、模型与 AI Agent 质量

这是辉夜计划区别于普通软件项目的关键章节。传统测试体系无法覆盖 AI 系统的质量——需要评测、对抗测试、漂移监控和行为审查。

### 13.1 数据质量

所有正式数据集（训练集、评测集、RAG 文档库、长期记忆数据）的质量门禁：

- **来源与许可**：provenance 清楚、license 合规、不含未授权受保护表达；
- **结构完整**：schema 固定、类型正确、缺失率可控、无重复污染；
- **分布健康**：无异常漂移、无 train/eval 泄漏、敏感字段已标注或脱敏；
- **版本可控**：数据集有版本、有变更记录、有保留策略。

TensorFlow Data Validation 的 schema 推断和漂移检测思路可作为参考实现。Datasheets for Datasets 提出的数据说明文档（动机、组成、采集过程、推荐用途）应成为辉夜计划的 Dataset Card 最低内容。

### 13.2 模型质量

模型或模型服务的质量证据：适用场景、超出范围的使用、训练数据来源、评测数据和指标、子群性能差异、已知限制、鲁棒性、校准质量、推理延迟和成本、漂移趋势、安全行为、降级策略。

Model Cards 要求发布的模型附带文档说明适用边界、评估流程和局限。辉夜计划的每个正式模型服务都应维护 Model Card。

### 13.3 AI 生产就绪检查

参考 Google ML Test Score 的思路，辉夜计划定义 AI 生产就绪的四个维度：

**数据维度**：schema 固定、训练/评测集版本固定、漂移监控就位、泄漏检测完成、来源和许可清楚。

**模型维度**：版本固定、评测结果归档、性能基线存在、回归 suite 存在、fallback 策略存在。

**系统维度**：推理延迟监控、成本预算监控、错误处理完备、输入输出验证、发布和回滚机制就位。

**监控维度**：在线质量指标、漂移检测、幻觉/不确定代理指标、用户反馈回路、事故报告机制。

四个维度都达标，AI 系统才可以声称生产就绪。

### 13.4 Agent 质量

Agent 不只是模型——它是一个有工具、有记忆、有策略、有权限边界的行为系统。Agent 质量必须覆盖：

- System prompt / policy 版本控制；
- 工具权限矩阵审查；
- 工具调用正确性和拒绝测试；
- Prompt injection 对抗回归；
- 记忆读写行为测试和记忆投毒防护；
- RAG 检索精度和召回；
- 长上下文稳定性；
- 人格/行为一致性；
- 不确定性处理和拒绝行为；
- 危险动作阻断；
- 成本/延迟预算；
- 循环检测和人类交接；
- 审计日志完整性。

OWASP LLM Top 10 将 Prompt Injection、Insecure Output Handling、Training Data Poisoning 等列为重要风险。辉夜计划的 Agent 质量门禁必须覆盖这些已知攻击面。

### 13.5 AI Eval Report

每次 AI/Agent 系统的正式发布都应产出评测报告，记录：系统版本、评测范围、评测数据来源和版本、任务类型、核心指标、与基线的对比、回归情况、安全测试结果、人工审查结论、最终判定（Pass / Conditional Pass / Fail）、已知限制和后续跟进 Issue。

---

## 14. 具身智能与物理安全质量

具身系统的错误产生物理后果——质量要求必须比纯软件更严格。

### 14.1 具身质量阶段

```text
Design Hazard Analysis
  ↓
Simulation
  ↓
Software-in-the-loop (SIL)
  ↓
Hardware-in-the-loop (HIL)
  ↓
Controlled Physical Test
  ↓
Human-in-the-loop Operation
  ↓
Limited Autonomy
  ↓
Operational Acceptance
```

每一步都需要质量证据才能进入下一步。跳步是具身安全最常见的失败模式。

### 14.2 具身验证要求

- 危害分析覆盖所有已识别风险场景；
- 传感器有效性和故障响应经过验证；
- 执行器的速度、力和扭矩限制已设定并测试；
- 工作空间边界已定义且不可逾越；
- 碰撞处理策略已验证；
- 通信超时时系统进入安全状态；
- E-Stop 在所有场景下有效；
- 人类可在任何时刻接管；
- 所有物理测试有完整日志归档。

NASA 软件保障标准要求安全关键软件拒绝可能造成危险的乱序命令、检测内存修改并恢复安全状态、对输入输出进行完整性检查。ISO/TS 15066 规定协作机器人系统的安全要求。辉夜计划的具身系统在设计阶段就必须将这些约束内建，而不是在集成后补。

### 14.3 ROS / 机器人中间件质量

若使用 ROS 2 或类似中间件，核心包和消息接口应维护 Quality Declaration（参照 REP-2004）、定义 QoS profile、验证消息兼容性、测试 lifecycle state 转换、执行故障注入、验证延迟预算和安全边界。

---

## 15. 安全与供应链质量

本节与 `02-Security-Ethics.md` 有交叉，但这里关注的是**验证证据**——安全策略写在安全文档里，安全证据属于质量保障。

### 15.1 安全验证要求

所有正式仓库必须执行：secret 扫描、依赖扫描、依赖 review、许可证检查、SAST。发布制品还需：容器扫描、SBOM 生成、provenance 记录、artifact 签名。

OpenSSF Scorecard 可自动检查开源项目的安全启发式指标。SLSA 用 provenance 记录构建实体和过程。Sigstore 可用于签名和验证发布制品。辉夜计划的正式发布应逐步达到 SLSA Level 2，关键系统争取 Level 3。

### 15.2 Web / API 安全验证

Web 和 API 服务最低参考 OWASP ASVS，覆盖认证、授权、会话、输入验证、输出编码、注入防护、文件上传、日志、错误处理和速率限制。安全测试不是可选附加——它是 QA-L3 及以上质量等级的必要证据。

---

## 16. 发布质量与生产就绪

### 16.1 Release Quality Report

每次正式发布（非 Draft / 实验性发布）应产出 Release Quality Report，记录：版本和构建信息、测试摘要（各层通过情况）、开放缺陷、风险评估和接受的风险、运行就绪状态（监控/告警/Runbook/回滚）、最终判定（Go / No-Go / Conditional Go）和批准记录。

### 16.2 生产就绪检查

QA-L3 服务的生产就绪最低要求：CI 全部通过、集成和契约测试通过、数据迁移 dry run 通过（如适用）、监控和告警已配置、SLO 已定义、Runbook 已完成、回滚方案已验证、Backup Owner 已确认、安全扫描通过。

QA-L4 AI/Agent 服务还需：模型/prompt/policy 版本固定、Eval Report 完成、Prompt Injection 测试通过、工具权限矩阵审查完成、行为回归通过、回滚/禁用机制可用。

QA-L5 具身系统还需：Hazard analysis 完成、仿真和 SIL/HIL 测试通过、物理边界定义完成、传感器故障测试通过、HITL 可用、E-Stop 验证通过、独立安全 Reviewer 批准。

Kubernetes Release Cycle 的 Code Freeze 和文档审查阶段是质量控制的好例子——特性需要提前完成测试计划和生产就绪审查，而不是在最终发布前临时补齐。辉夜计划的正式版本发布应借鉴此冻结和检查机制。

---

## 17. 缺陷、回归与事故闭环

### 17.1 缺陷生命周期

```text
Report → Triage → Reproduce → Classify → Root Cause → Fix → Regression Test → Release → Verify → Close
```

每个环节都有 Owner，不允许缺陷在某个环节无限期停留。

### 17.2 缺陷分级

| 等级 | 含义 | 响应要求 |
|------|------|----------|
| **P0** | 生产中断、安全泄露、具身危险、数据损坏 | 立即处理 |
| **P1** | 关键功能不可用、严重回归、重大隐私风险 | 优先修复 |
| **P2** | 重要功能异常、存在 workaround | 正常迭代修复 |
| **P3** | 小 bug、文档问题、低影响体验问题 | 维护计划内处理 |
| **P4** | 改进建议、清理项 | Backlog |

### 17.3 修复必须补偿质量证据

Bug 修复不是"改完就完"。每次修复至少应补充以下之一：回归测试、更强的校验、更清晰的错误信息、更完善的日志、文档更新、监控告警或 Runbook 条目。修了 Bug 却不补防线，等于在同一个地方等下一次摔倒。

### 17.4 Flaky Test 治理

Flaky test 处理流程：检测 → 标记 → 分配 Owner → 隔离（仅在必要时）→ 修复或删除 → 重新启用 → 跟踪复发。

规则：Flaky test 不得长期阻塞 main；隔离必须有 Owner 和修复 SLA；不允许通过习惯性 rerun 掩盖不稳定；高风险路径上的 flaky test 必须优先修复。

---

## 18. 质量度量

质量指标用于发现系统性问题、改进流程和降低风险，不用于机械排名个人或惩罚贡献者。

### 18.1 推荐指标

| 类别 | 关键指标 |
|------|----------|
| 代码质量 | lint/typecheck failure rate、review defect density、complexity hotspots |
| 测试质量 | test pass rate、flaky test rate、coverage trend |
| 缺陷质量 | escaped defect rate、regression rate、P0/P1 count、time to fix |
| 交付质量 | lead time、deployment frequency、change failure rate、recovery time |
| 运行质量 | availability、latency、error rate、SLO burn、incident count |
| 安全质量 | open critical vulnerabilities、secret leaks、dependency age、SBOM coverage |
| 数据质量 | schema violation rate、drift events、contamination incidents |
| AI 质量 | eval pass rate、hallucination proxy、unsafe output rate、tool-call failure rate |
| 具身质量 | simulation pass rate、near-miss count、E-Stop test pass rate |
| 用户质量 | task success rate、accessibility issues、Core Web Vitals、support issue volume |

DORA 将 deployment frequency、lead time、change failure rate 和 time to restore 作为交付和稳定性的核心指标。辉夜计划应逐步对所有 QA-L3+ 服务建立这四个指标的可观测能力。

---

## 19. 质量例外与质量债

必须允许例外——但例外不能是免费的。

### 19.1 Quality Exception

质量例外的条件：有 Owner、有理由、有影响范围、有临时缓解措施、有过期时间、有复审日期。不得突破安全、隐私、法律、具身安全和未授权资产底线。每个例外必须有对应的追踪 Issue。

### 19.2 Quality Debt

质量债包括：缺失测试、缺失文档、缺失监控、过期依赖、flaky test、手工部署、无回滚方案、无 Owner、模型评测不足、数据 provenance 不完整、具身仿真覆盖不足。

规则：质量债不得只存在于 PR 评论和个人记忆中——必须进入 Issue / Project 成为可追踪的工作项。高风险质量债（影响安全、生产或具身安全）必须有修复 SLA。

---

## 20. 工具、自动化与 Agent 辅助

### 20.1 Kaguya QA Sentinel

辉夜计划可部署 QA Sentinel Agent 辅助质量保障工作：汇总 CI 失败趋势、标记 flaky tests、生成 Release Quality Report 草稿、检查 PR 是否缺少测试说明或契约测试、检查 AI 变更是否缺少 Eval Report、检查数据变更是否缺少 Dataset Card、检查具身变更是否缺少仿真日志、每周生成 Quality Digest。

> QA Sentinel 可以提醒、汇总、检查和生成报告，不得自动批准 PR、绕过 CI、删除失败测试或替代专项 Reviewer 的判断。Agent 辅助质量，不裁决质量。

### 20.2 自动化策略

- 所有可自动化的检查都应在 CI 中执行，减少人工 Review 的低级错误负担；
- 契约检查、schema diff、依赖审查应自动触发评论或标签；
- 性能回归和 AI eval 回归应自动生成对比报告并附加到 PR；
- 质量指标应定期自动采集并可视化，而非靠人工统计；
- 告警噪声和 flaky test 趋势应自动追踪并通知 Owner。

---

## 21. 模板与检查清单

以下模板为辉夜计划质量保障体系的配套产出物，具体模板内容随工程实践迭代，可放入 `templates/` 或 `05-Knowledge/`：

- `QUALITY.md` — 质量等级声明
- Test Plan — 测试计划
- Release Quality Report — 发布质量报告
- AI Evaluation Report — AI 评测报告
- Dataset Card — 数据集说明
- Model Card — 模型说明
- Embodiment Test Report — 具身测试报告
- Flaky Test Report — 不稳定测试报告
- Defect Report — 缺陷报告
- Quality Exception — 质量例外申请
- Post-release Review — 发布后复盘

---

## 22. 反模式

以下行为属于质量保障反模式：

1. 把 QA 理解为"发布前跑一轮测试"；
2. 只有 E2E，没有单元、集成和契约测试（倒金字塔）；
3. 通过反复 rerun 掩盖 flaky test 而不修复；
4. CI 失败后口头放行或绕过合并；
5. 原型无任何质量门禁直接进入生产依赖；
6. 公共 API 改动无契约测试和兼容性验证；
7. 数据集无 provenance、license 或 schema 检查；
8. 模型只看 benchmark 分数，不测失败模式和安全行为；
9. Agent 获得新工具权限但无权限矩阵测试；
10. RAG 系统无检索质量验证和污染检测；
11. 具身系统只通过仿真就直接开放物理动作；
12. Bug 修复不补回归测试；
13. 发布无 rollback plan 和运行就绪确认；
14. 上线后不看监控、不配告警、不写 Runbook；
15. 质量债只存在于口头约定和 PR 评论中；
16. 把测试覆盖率当作质量本身（高覆盖率不等于高质量）；
17. 为追求速度长期降低质量基线而不追踪代价；
18. 用 AI 生成测试但无人理解其行为和验证其正确性。

---

## 23. 修订

本文只能通过公开 RFC 修订，修订需写明是质量要求被证明过重或过轻、新类型系统缺少覆盖、还是某条规则被证明在实践中阻碍而非保护工程健康。与 `01-Foundation/01-Principles.md` 的"冲突与修订"一致：当本文与安全审查或组织权限冲突时，以对应专项文档为准；当与法律、安全伦理底线冲突时，底线优先。旧版存于版本控制，随时可查。

本文的硬核心只有五条：

1. 每个正式资产必须声明质量等级。
2. 每个质量等级必须有最低证据要求。
3. 每个高风险变更必须通过相应质量门禁。
4. 每个缺陷和事故必须沉淀为防回归机制。
5. 每个 AI / Agent / 具身系统必须有传统软件测试之外的专项质量证据。

守住这五条，辉夜计划才能从实验和 Demo 稳定进入长期可维护、可发布、可审计、可运行的工程体系。
