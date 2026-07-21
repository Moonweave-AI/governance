# 工程与开发

本文档定义 Moonweave/辉夜计划（Kaguya Project）治理文档中使用的软件工程实践、版本控制、分支策略与开发工作流相关术语。

---

## GitHub Flow

**中文名称：** GitHub Flow

一种轻量、基于分支的工作流：所有变更在短生命周期特性分支上开发，经 Pull Request 合并至 `main`。比 Git Flow 更简单，适合持续交付。辉夜计划采用 GitHub Flow 作为默认开发模式。

## Git Flow

**中文名称：** Git Flow

较重的分支模型，包含长期存在的 `develop`、`release` 与 `hotfix` 分支。因对持续交付工作流而言过于复杂，辉夜计划未采用 Git Flow。

## Pull Request (PR)

**中文名称：** 拉取请求（PR）

向代码库提议变更的机制。PR 包含 diff、描述、测试计划与元数据，须在通过 CI 检查并经人工审查后方可合并至受保护分支。是辉夜计划所有代码与文档变更的必经通道。

## Draft PR

**中文名称：** 草稿 PR

标记为进行中的 PR，不可合并。用于尽早暴露实现方向、获取初步反馈，并在正式审查前发现 CI 问题。辉夜计划鼓励复杂变更先开 Draft PR 以降低返工成本。

## Branch Protection

**中文名称：** 分支保护

GitHub 仓库设置，对受保护分支（通常为 `main`）强制执行规则：要求 PR 审查、通过状态检查、CODEOWNER 批准、线性历史，并禁止 force push。是辉夜计划代码质量与审计追溯的基础保障。

## Conventional Commits

**中文名称：** 约定式提交

使用 `<type>(<scope>): <description>` 格式的提交信息规范。类型包括 `feat`、`fix`、`docs`、`refactor`、`test`、`perf`、`ci`、`chore` 等，与 SemVer 对齐以支持自动化变更日志与版本管理。

## SemVer (Semantic Versioning)

**中文名称：** 语义化版本（SemVer）

采用 `MAJOR.MINOR.PATCH` 的版本方案：MAJOR 表示破坏性变更，MINOR 表示向后兼容的新功能，PATCH 表示向后兼容的修复。适用于具有公开 API 的组件；辉夜计划对对外接口遵循 SemVer。

## CI/CD (Continuous Integration / Continuous Delivery)

**中文名称：** 持续集成 / 持续交付（CI/CD）

CI：自动构建、测试与验证每次代码变更。CD：将已验证变更自动部署至预发或生产环境。二者构成从提交到部署的自动化流水线，是辉夜计划 Engineering Brief 与 PR 流程的核心支撑。

## GitHub Actions

**中文名称：** GitHub Actions

GitHub 内置 CI/CD 平台，工作流以 YAML 文件定义。支持矩阵构建、环境密钥、制品上传与部署保护规则。辉夜计划的 CI、安全扫描与发布流程均基于 GitHub Actions。

## Lockfile

**中文名称：** 锁定文件

固定精确依赖版本及其传递依赖的文件（如 `uv.lock`、`pnpm-lock.yaml`、`Cargo.lock`）。确保各环境与 CI 中构建可复现；辉夜计划要求提交 lockfile 并纳入审查范围。

## Dev Container

**中文名称：** 开发容器

由 `devcontainer.json` 定义的容器化开发环境。为复杂配置（GPU 依赖、系统库、ROS、仿真器）提供可复现、预配置的环境，降低辉夜计划多栈协作的 onboarding 成本。

## Feature Flag

**中文名称：** 功能开关

运行时开关，可在不部署新代码的情况下启用或禁用某功能。支持渐进式发布、A/B 测试与功能即时回滚。辉夜计划对高风险或实验性功能优先采用 Feature Flag。

## Kill Switch

**中文名称：** 紧急关闭

紧急机制，可在无需完整部署周期的情况下立即禁用生产中的功能、服务或行为。对 Agent 工具调用、具身控制等高风险系统尤为关键。

## Hotfix

**中文名称：** 热修复

针对生产关键问题的加急修复，遵循缩短的审查流程。仍须记录、测试，并跟进根因分析与回归测试。辉夜计划对 Stop-Ship 级问题允许 Hotfix 通道，但不得绕过最低安全要求。

## Squash Merge

**中文名称：** 压缩合并

将 PR 内所有提交合并为目标分支上的单一提交的合并策略。以牺牲单次提交粒度为代价，获得更清晰的线性历史。辉夜计划对 `main` 分支默认采用 Squash Merge。

## Linear History

**中文名称：** 线性历史

无合并提交的分支历史，通过 squash merge 或 rebase 实现。比复杂合并拓扑更易阅读、bisect 与推理；与 Branch Protection 中的线性历史要求一致。

## Matrix Testing

**中文名称：** 矩阵测试

在多种 OS、语言版本、运行时或配置组合上运行同一测试套件。在 CI 工作流中定义，以捕获环境特异性故障。辉夜计划 monorepo 广泛使用矩阵测试覆盖多平台。

## Monorepo

**中文名称：** 单仓库

包含多个项目、包或服务的单一仓库。简化跨项目变更，但需配套工具实现选择性构建与测试。辉夜计划采用 monorepo 统一管理治理、Agent 与具身相关代码。

## Workspace

**中文名称：** 工作区

包管理器功能（pnpm workspace、Cargo workspace），在单仓库内管理多个包，共享依赖并支持跨包开发。是辉夜计划 monorepo 依赖与构建编排的基础抽象。

## Engineering Brief

**中文名称：** 工程简报

轻量设计文档（短于 RFC、详于 Issue），在实现标准或高风险工程变更前撰写。涵盖问题、方案、备选、风险、测试计划与归属。辉夜计划中，介于 Issue 与 RFC 之间的变更通常须先提交 Engineering Brief。
