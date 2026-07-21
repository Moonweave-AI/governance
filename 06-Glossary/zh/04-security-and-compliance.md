# 安全与合规

本文档定义 Moonweave/辉夜计划（Kaguya Project）治理文档中使用的应用安全、供应链完整性、合规框架与漏洞管理相关术语。

---

## SBOM (Software Bill of Materials)

**中文名称：** 软件物料清单（SBOM）

软件制品中所有组件、库与依赖的机器可读清单。支持漏洞跟踪、许可证合规与供应链透明。辉夜计划发布流程要求为 S2 及以上制品生成并归档 SBOM。

## SLSA (Supply-chain Levels for Software Artifacts)

**中文名称：** 软件制品供应链级别（SLSA）

通过可验证构建来源确保软件供应链完整性的框架。级别自 L1（基本来源证明）至 L4（密封、可复现构建）。辉夜计划逐步向更高 SLSA 级别对齐发布流水线。

## Provenance

**中文名称：** 来源证明

记录谁、通过何种流程、从哪些源输入、在何种环境下构建制品的文档。对供应链验证与审计追溯至关重要；与 Sigstore 及 GitHub Actions 制品 attestation 配合使用。

## SPDX (Software Package Data Exchange)

**中文名称：** SPDX（软件包数据交换标准）

ISO 标准（ISO/IEC 5962:2021）格式，用于传递软件组件信息，包括许可证、版权与安全引用。辉夜计划 SBOM 与 REUSE 合规均采用 SPDX 标识符。

## SAST (Static Application Security Testing)

**中文名称：** 静态应用安全测试（SAST）

不执行代码的源代码安全分析。在开发阶段识别注入缺陷、硬编码密钥与不安全模式等漏洞。辉夜计划 PR 流程集成 CodeQL 等 SAST 工具。

## DAST (Dynamic Application Security Testing)

**中文名称：** 动态应用安全测试（DAST）

对运行中的应用模拟攻击的安全测试。发现源代码中不可见的运行时漏洞，适用于 QA-L3 及以上对外服务的预发验证。

## CodeQL

**中文名称：** CodeQL

GitHub 的语义代码分析引擎，通过类数据库查询在代码结构上发现安全漏洞与代码质量问题。辉夜计划仓库默认启用 CodeQL 工作流作为 SAST 门禁。

## OWASP (Open Web Application Security Project)

**中文名称：** OWASP（开放 Web 应用安全项目）

产出 Web 应用安全标准、工具与指南的非营利组织。重要成果包括 OWASP Top 10、ASVS 与 SAMM；辉夜计划 Web 与 Agent 接口安全基线参考 OWASP 体系。

## ASVS (Application Security Verification Standard)

**中文名称：** 应用安全验证标准（ASVS）

OWASP 标准，提供 Web 应用安全需求的全面检查清单，按验证级别（L1–L3）组织。辉夜计划 S3 及以上系统应对照 ASVS 相应级别进行设计与验证。

## OWASP SAMM (Software Assurance Maturity Model)

**中文名称：** OWASP SAMM（软件保障成熟度模型）

评估与改进软件安全实践的框架，覆盖治理、设计、实现、验证与运维。用于辉夜计划安全治理成熟度自评与改进规划。

## OWASP LLM Top 10

**中文名称：** OWASP LLM Top 10

大语言模型应用最关键的十大安全风险清单，包括提示注入、不安全输出处理与训练数据投毒等。辉夜计划 Agent 系统（QA-L4）须对照此清单进行威胁建模与 Red Team 测试。

## Secret Scanning

**中文名称：** 密钥扫描

自动检测 Git 历史中意外提交的凭据、API 密钥、令牌等秘密。防止凭据在公开或共享仓库中泄露；辉夜计划启用 GitHub Secret Scanning 与 pre-commit 钩子双重防护。

## Dependency Scanning

**中文名称：** 依赖扫描

自动检测项目依赖中已知漏洞（CVE）。Dependabot 与 GitHub dependency review 提供告警与自动修复 PR；是 Stop-Ship 判定与日常安全运维的常规输入。

## CVE (Common Vulnerabilities and Exposures)

**中文名称：** 公共漏洞与暴露（CVE）

公开已知安全漏洞的标准化标识符（如 CVE-2024-1234）。依赖扫描器据此将已知漏洞与项目依赖匹配；辉夜计划对 Critical/High CVE 有明确的修复时限要求。

## Threat Model

**中文名称：** 威胁模型

对系统潜在安全威胁的结构化分析，识别资产、威胁行为者、攻击向量与缓解措施。S3 及以上系统在实现前须完成威胁建模；Agent 与具身系统为重点关注对象。

## NIST CSF (Cybersecurity Framework)

**中文名称：** NIST 网络安全框架（CSF）

基于风险的网络安全活动框架，组织为识别、保护、检测、响应与恢复五大功能。辉夜计划安全治理与 CSF 2.0 的风险管理思路对齐。

## NIST SSDF (Secure Software Development Framework)

**中文名称：** NIST 安全软件开发框架（SSDF）

NIST SP 800-218：将安全融入软件开发生命周期各阶段（准备、实现、响应与漏洞管理）的实践指南。辉夜计划 Engineering Brief 与 Quality Gate 流程体现 SSDF 原则。

## NIST AI RMF (AI Risk Management Framework)

**中文名称：** NIST AI 风险管理框架（AI RMF）

NIST AI 100-1：管理 AI 系统风险的框架，覆盖有效性、安全、安保、问责、透明、公平与隐私等可信特征。辉夜计划 QA-L4/L5 AI 与具身系统参照此框架进行风险评估。

## OpenSSF Scorecard

**中文名称：** OpenSSF Scorecard

自动评估开源项目安全启发式指标（分支保护、CI 测试、漏洞披露、依赖更新等）并产出得分的工具。辉夜计划公开仓库定期运行 Scorecard 以跟踪安全 hygiene。

## Sigstore

**中文名称：** Sigstore

用于签名、验证软件制品并创建透明日志的工具集。支持发布版、容器镜像与 SBOM 的无密钥签名；辉夜计划发布流水线逐步集成 Sigstore 以增强供应链信任。

## Zero Trust

**中文名称：** 零信任

安全模型：任何实体（用户、服务或网络）均不被默认信任。每次访问请求无论来源均须认证、授权并持续验证。辉夜计划 Agent 工具调用与内部服务间通信遵循零信任原则。

## Supply Chain Attack

**中文名称：** 供应链攻击

针对软件供应链（依赖、构建系统、分发渠道）而非应用本身的攻击。通过 SBOM、来源证明、固定依赖与可复现构建缓解；是辉夜计划 S2 及以上安全等级关注的核心威胁类型。
