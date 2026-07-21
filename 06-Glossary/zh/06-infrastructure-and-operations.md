# 基础设施与运维

本文档定义 Moonweave/辉夜计划（Kaguya Project）治理文档中使用的部署、发布管理、监控、事故响应与运维可靠性相关术语。

---

## OCI (Open Container Initiative)

**中文名称：** 开放容器倡议（OCI）

容器镜像格式与运行时规范的行业标准集合。确保容器镜像在不同容器运行时与 registry 间可移植；辉夜计划容器制品遵循 OCI 标准以保证环境一致性。

## Container

**中文名称：** 容器

轻量、隔离的执行环境，将应用与其依赖打包在一起。由镜像（Dockerfile）构建，在开发、CI 与生产环境中一致运行。是辉夜计划服务部署与 Dev Container 的基础单元。

## Multi-stage Build

**中文名称：** 多阶段构建

Dockerfile 技术，使用多个 `FROM` 语句将构建时依赖与运行时依赖分离，产出更小、更安全的最终镜像。辉夜计划生产镜像均采用多阶段构建以减小攻击面。

## Docker / Dockerfile

**中文名称：** Docker / Dockerfile

Docker 是容器平台；Dockerfile 是按层定义如何构建容器镜像的文本文件。最佳实践包括固定基础镜像、最小化层数与使用 `.dockerignore`；辉夜计划 CI 对 Dockerfile 变更进行安全与大小审查。

## Compose (Docker Compose)

**中文名称：** Compose（Docker Compose）

使用 `compose.yaml` 定义并运行多容器应用的工具。适用于需要多服务的本地开发环境；辉夜计划本地 Agent 栈与仿真环境常用 Compose 编排。

## Canary Release

**中文名称：** 金丝雀发布

部署策略：新版本先暴露给一小部分流量，再全量发布。可在有限影响范围内发现问题；若金丝雀指标退化则回滚。辉夜计划 QA-L3 及以上服务发布优先采用金丝雀策略。

## Staged Rollout

**中文名称：** 分阶段发布

逐步扩大新版本暴露范围：内部试用 → 金丝雀 1% → 金丝雀 10% → 区域 → 全量生产。每阶段有成功标准方可推进；与 Feature Flag 及 Release Readiness 审查配合使用。

## Blue-Green Deployment

**中文名称：** 蓝绿部署

维护两套相同生产环境（蓝与绿）的策略。流量在二者间原子切换，可通过切回实现即时回滚。适用于需要零停机且回滚路径明确的关键服务。

## Rolling Update

**中文名称：** 滚动更新

逐步用新实例替换旧实例，全程保持可用性。Kubernetes Deployment 默认采用此策略；辉夜计划容器化服务的常规更新方式。

## Preview Environment

**中文名称：** 预览环境

为 PR 自动创建的临时环境，供审查者在合并前交互验证变更（UI、API、文档）。PR 关闭后销毁；辉夜计划前端与 API 变更鼓励配置 Preview Environment。

## Health Check

**中文名称：** 健康检查

报告服务是否可运行的端点或探针。负载均衡器、编排器与监控系统据此检测故障并绕行；是 Observability 与自动恢复的基础。

## Readiness Probe

**中文名称：** 就绪探针

判断服务实例是否准备好接收流量的检查。与健康检查（存活探针）不同——服务可以存活但尚未就绪。辉夜计划服务启动须正确区分 liveness 与 readiness。

## Runbook

**中文名称：** 运维手册

提供常见操作、事故响应、回滚与恢复分步流程的运维文档。须在事故时间压力下可用；每个 Alert 应链接对应 Runbook。辉夜计划 QA-L3 及以上服务须维护 Runbook。

## SLI (Service Level Indicator)

**中文名称：** 服务级别指标（SLI）

服务行为的量化测量（如请求延迟、错误率、可用性）。评估 SLO 的原始数据；辉夜计划各生产服务须定义并采集核心 SLI。

## SLA (Service Level Agreement)

**中文名称：** 服务级别协议（SLA）

服务提供方与消费者之间的正式合同，规定最低性能水平及违约后果。比 SLO 更具约束力；对外承诺的服务须明确 SLA 条款。

## DORA Metrics

**中文名称：** DORA 指标

DevOps Research and Assessment 项目的四项关键指标：部署频率、变更前置时间、变更失败率、服务恢复时间。同时衡量交付速度与稳定性；辉夜计划运维改进以此作为参考框架。

## Observability

**中文名称：** 可观测性

从系统外部输出（日志、指标、追踪）理解其内部状态的能力。当无需部署新 instrumentation 即可诊断问题时，系统具备可观测性。辉夜计划 S3 及以上服务须达到定义的可观测性基线。

## OpenTelemetry

**中文名称：** OpenTelemetry

生成、采集与导出遥测数据（追踪、指标、日志）的厂商中立标准。在异构技术栈间提供一致的可观测性；辉夜计划新服务优先采用 OpenTelemetry SDK。

## Tracing (Distributed Tracing)

**中文名称：** 分布式追踪

记录请求流经多个服务的路径，捕获各步骤的时序、依赖与错误。调试分布式系统所必需；Agent 多工具调用链与微服务架构中尤为关键。

## Metrics

**中文名称：** 指标

随时间采集的数值测量：计数器、仪表盘、直方图等。用于仪表盘、告警与容量规划（如请求率、错误率、延迟分位数）。与 Logging、Tracing 共同构成可观测性三支柱。

## Logging

**中文名称：** 日志

离散事件的结构化记录（错误、状态变更、决策）。区别于指标（聚合数值）与追踪（请求路径）；不得包含秘密或 PII。辉夜计划日志规范与 Security Level 要求一致。

## Alert

**中文名称：** 告警

当指标越阈或检测到异常时触发的自动通知。有效告警应可操作、具体且链接 Runbook；辉夜计划禁止「告警疲劳」——每条告警须有明确响应流程。

## Error Budget Policy

**中文名称：** 错误预算策略

定义 SLO 错误预算耗尽后如何处理：通常冻结功能发布、优先可靠性工作，待预算恢复后再恢复功能交付节奏。与 Quality Gate Q5 及 Release Readiness 决策联动。

## Incident

**中文名称：** 事故

导致服务降级、中断、数据丢失、安全泄露或安全关切的非计划事件。按严重级别（P0–P4）分类并经正式生命周期跟踪；P0–P2 须触发 Postmortem。

## Release Readiness

**中文名称：** 发布就绪

确认生产发布所有先决条件已满足的结构化审查：CI 通过、审查完成、监控就绪、回滚已测、归属已确认。辉夜计划每次生产发布前须完成 Release Readiness 检查清单。
