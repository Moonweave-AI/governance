# 文档与知识管理

本文档定义 Moonweave/辉夜计划（Kaguya Project）治理文档中使用的技术写作、文档系统、知识组织与信息架构相关术语。

---

## Diátaxis

**中文名称：** 文档四分法（Diátaxis）

按用户需求组织内容的文档框架，分为四类：教程（学习导向）、操作指南（任务导向）、参考（信息导向）与解释（理解导向）。防止单一文档混合多种目的；辉夜计划文档结构参照 Diátaxis 划分。

## Docs as Code

**中文名称：** 文档即代码

以与代码相同严谨度对待文档的理念：存储于 Git、经 PR 修改、同行审查、CI 测试并自动部署。确保文档与代码库同步演进；辉夜计划全部治理与项目文档遵循此原则。

## SSoT (Single Source of Truth)

**中文名称：** 单一事实源（SSoT）

每项信息有且仅有一个权威位置的原则。所有其他引用须指向 SSoT，而非重复或与之矛盾。辉夜计划治理体系以本仓库为治理文档的 SSoT。

## Front Matter

**中文名称：** 文档元数据（Front Matter）

文档开头的结构化元数据（通常为 YAML），声明标题、作者、状态、负责人、日期、类型等属性。支持自动化工具、索引与生命周期管理；辉夜计划 Markdown 文档普遍采用 Front Matter。

## GFM (GitHub Flavored Markdown)

**中文名称：** GitHub Flavored Markdown（GFM）

GitHub 扩展的 Markdown 规范，在标准 Markdown 基础上增加表格、任务列表、删除线、自动链接与围栏代码块等。辉夜计划的默认写作格式。

## Mermaid

**中文名称：** Mermaid

基于文本的图表语言，从 Markdown 代码块渲染流程图、时序图、类图等。可版本控制且可 diff，优于二进制图片格式；辉夜计划架构与流程文档广泛使用 Mermaid。

## Vale

**中文名称：** Vale

散文 linter，对 Markdown、AsciiDoc 等文本格式强制执行写作风格规则（术语一致性、被动语态检测、术语规避等）。可配置自定义风格包；辉夜计划文档 CI 可集成 Vale 检查。

## markdownlint

**中文名称：** markdownlint

Markdown 文件的静态分析工具，强制执行一致格式规则：标题结构、列表缩进、行长度、空行与代码块格式等。辉夜计划仓库通过 CI 运行 markdownlint。

## Technical Radar

**中文名称：** 技术雷达

可视化工具（源自 ThoughtWorks），将技术分为四环：采用（推荐默认）、试验（有限使用且有退出路径）、评估（仅研究）、暂缓（勿引入）。用于技术治理；辉夜计划技术选型参考内部技术雷达。

## Changelog

**中文名称：** 变更日志

记录项目各版本重要变更的文件（通常为 `CHANGELOG.md`），按发布组织。面向用户与维护者（区别于 Git log）；辉夜计划各组件遵循 Keep a Changelog 或 Conventional Commits 自动生成。

## Release Notes

**中文名称：** 发布说明

随发布附带的面向用户的文档，以易懂语言突出重要变更、破坏性变更、迁移步骤与已知问题。与 Changelog 互补，侧重用户视角；每次生产发布须编写 Release Notes。

## Glossary

**中文名称：** 术语表

确保项目内一致理解的术语定义集合。本文档体系即为辉夜计划术语表系统的一部分，与英文版 `06-Glossary/en/` 一一对应。

## DOI (Digital Object Identifier)

**中文名称：** 数字对象标识符（DOI）

数字对象（论文、数据集、软件版本）的持久标识符，确保长期可发现与可引用，不受 URL 变更影响。辉夜计划对外发布的研究数据与软件版本建议注册 DOI。

## REUSE

**中文名称：** REUSE

FSFE 规范，使软件许可与版权信息在文件级别机器可读且无歧义，使用 SPDX 标识符。辉夜计划开源组件须符合 REUSE 合规要求。

## Quality Declaration

**中文名称：** 质量声明

组件声明其质量级别并提供如何满足该级别要求的证据的文档（灵感来自 ROS 2 REP-2004）。涵盖测试、文档、版本策略与依赖；辉夜计划 QA-L2 及以上组件须发布 Quality Declaration。

## Runbook

**中文名称：** 运维手册

提供系统管理、事故响应与恢复分步流程的运维文档。区别于用户文档——面向时间压力下的运维人员。与基础设施术语表中的 Runbook 定义一致，强调运维人员视角。

## Knowledge Asset

**中文名称：** 知识资产

任何能够支持理解、维护、复现、审计或工作延续的记录性知识。包括代码、文档、决策、实验、数据记录与运维流程；辉夜计划治理要求对关键 Knowledge Asset 明确 Owner 与保留策略。
