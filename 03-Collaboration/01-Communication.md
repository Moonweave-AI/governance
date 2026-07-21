# 沟通规范

> 本文用于呈现项目的组织通信系统设计。它解决"什么事情在哪个平台说、哪些信息必须沉淀、哪些沟通可以临时发生、哪些结论必须回到 GitHub / Notion / RFC / ADR、会议如何创建记录追踪、Agent 自动推送什么不能推送什么、交接缺席事故升级如何处理"。

一个核心判断：

> **聊天工具负责快速沟通，GitHub 负责工程事实，Notion / 知识库负责组织记忆，日历负责节奏，Agent 负责提醒与路由、但不成为事实源。**

---

## 1. 目的与适用范围

本文定义辉夜计划在日常协作、工程开发、研究推进、社区参与、会议、事故响应、知识沉淀和自动化通知中的沟通方式。

本文适用于：

- GitHub Issues / Pull Requests / Discussions / Projects；
- 飞书群聊、私聊、日历、会议、文档、机器人；
- Notion 或等价知识库；
- 微信群与 Discord 社区（对外交流）；
- RFC / ADR / Research Logs；
- 自动化通知、Agent 推送和运行告警；
- 公开社区空间与内部协作空间。

本文不替代 `01-Organization.md` 中的角色权限定义，不替代 `03-RFC-Process.md` 中的正式决策流程，不替代 `02-Security-Ethics.md` 中的安全披露与事故处理规则。

---

## 2. 沟通原则

1. **异步优先，同步补充** — 默认优先使用可追溯的异步沟通。会议、语音和即时聊天只用于快速澄清、冲突收敛、事故处理和高带宽讨论。
2. **重要结论必须有权威链接** — 任何影响项目方向、公共接口、发布、安全边界、路线图、Owner、权限或社区成员权益的结论，都必须回到 GitHub Issue、PR、RFC、ADR、Notion 权威页面或会议记录中。聊天里的结论不能单独构成组织事实。
3. **单一事实源** — 每个主题只能有一个权威事实源。聊天、会议纪要、任务看板和自动化推送可以引用事实源，但不得制造互相冲突的并行事实。

   | 信息类型          | 权威事实源                       |
   | --------------- | ---------------------------- |
   | 代码变更            | GitHub PR                    |
   | Bug / Feature / Task | GitHub Issue                 |
   | 跨仓库规划          | GitHub Project / Planning 文档 |
   | 重大技术提案          | RFC                          |
   | 已接受架构决策         | ADR                          |
   | 长期组织知识          | Notion / Wiki verified page  |
   | 会议结论            | 会议纪要 + 关联 Issue/RFC/ADR      |
   | 安全事件            | 安全事件记录，不走普通公开 Issue          |
   | 发布事实            | Release notes / Changelog    |

4. **公开优先，私密有界** — 默认在公开或团队可见空间沟通。只有涉及安全漏洞、隐私、法律、行为准则、未公开合作、凭据、个人事务或高风险具身事故时，才进入受限空间。
5. **聊天不是任务系统** — 飞书 / 微信 / Discord 聊天可以提醒和协调，但不得作为任务、决策、风险、技术债或交付物的唯一记录。产生任务 → 转 GitHub Issue / Notion Task / RFC action item；产生技术结论 → 转 Issue comment / PR comment / RFC update / ADR。
6. **自动化提醒服务于人，不反向支配人** — Agent 和机器人用于减少遗忘、路由信息、暴露风险和生成摘要；不得用低质量、高频率、不可配置的推送制造噪声。
7. **沟通必须支持交接** — 任何长期任务、Owner 职责、事故处理和跨仓库推进事项，都必须能在负责人缺席时被接手。推进、记录一切、把所有权转移给下一个人，然后继续其他工作。

---

## 3. 平台分工

每种平台角色必须明确，否则后期会出现 GitHub、Notion、飞书群、会议口头各一套说法，最后没人知道哪个才是可参考的。

| 平台                    | 角色                                                 | 不承担              |
| --------------------- | -------------------------------------------------- | ---------------- |
| **GitHub**            | 工程事实源：Issue、PR、Discussion、Project、RFC、ADR、Release  | 临时闲聊、内部私密事项      |
| **飞书**                | 内部即时沟通、会议、日历、提醒、机器人通知、事故协同                         | 长期事实源、架构最终记录     |
| **Notion / Wiki**     | 内部组织知识、项目索引、Owner Registry、会议归档、Onboarding、Runbook | 代码 Review、正式工程变更 |
| **Guidelines Repo**   | 公开原则、治理、协作、工程标准、RFC/ADR 存档                         | 临时任务管理           |
| **微信群**              | 中文社区对外交流、兴趣讨论、新人引导                                 | 工程事实、决策、安全披露     |
| **Discord**           | 国际社区对外交流、兴趣讨论、语音/视频社区活动                            | 工程事实、决策、安全披露     |
| **Calendar**          | 会议节奏、公开社区会议、审查窗口、发布窗口                              | 决策文本本身           |
| **Agent / Bot Layer** | 事件路由、摘要、提醒、状态检查                                    | 事实裁决、权限替代、人类责任替代 |

事实源规则：

> GitHub 是工程活动事实源。Notion 是内部组织知识事实源。Guidelines Repo 是组织规则事实源。飞书是内部沟通与通知通道，不是事实源。微信与 Discord 是社区交流入口，不是事实源。Agent 是路由器，不是裁决者。

微信与 Discord 这两个平台面向对辉夜计划感兴趣的外部参与者，承担兴趣讨论、问答、新人引导和社区活动；任何在其中有价值的技术结论，必须由参与者或 Maintainer 回写 GitHub Issue / Discussion / RFC。不回写的，不构成项目事实。

---

## 4. 信息分级与沟通渠道

| 场景      | 默认平台                       | 必须沉淀到                             |
| ------- | -------------------------- | --------------------------------- |
| Bug     | GitHub Issue               | Issue                             |
| Feature | GitHub Issue / Discussion  | Issue / RFC                       |
| Code review | GitHub PR                  | PR                                |
| 架构争议    | GitHub Issue → RFC         | RFC / ADR                         |
| 发布准备    | GitHub Project + 飞书提醒      | Release checklist                 |
| 研究讨论    | GitHub Discussion / Notion | Research log                      |
| 实验结果    | Notion / repo research log | Research log                      |
| 日常协调    | 飞书                         | 必要时 Issue                         |
| 决策会议    | 飞书会议                       | Meeting notes + Issue/RFC/ADR     |
| 事故响应    | 飞书 incident channel        | Incident report / Postmortem      |
| 安全漏洞    | 私密安全渠道                     | Security advisory / private issue |
| 组织公告    | 飞书公告 + GitHub/Notion       | Announcement record               |
| 社区问答    | GitHub Discussions / 微信 / Discord | Discussion                        |
| Roadmap | GitHub Project / Notion    | Project / Planning doc            |
| Owner 变更 | Notion Owner Registry + PR | Organization record               |

---

## 5. GitHub 沟通规范

### 5.1 Issues

使用场景：Bug 报告；Feature request；任务跟踪；研究复现问题；文档缺口；技术债；跨仓库依赖；安全以外的可公开问题。

Issue 必须包含：Background / Context；Expected outcome；Scope；Owner / DRI；Status；Related PR / RFC / ADR；Risk level；Deadline or review date (if applicable)。

### 5.2 Pull Requests

PR 是实现讨论空间，不是大型方向争论空间。

允许讨论：实现正确性；测试；可维护性；接口兼容；文档更新；安全风险；是否符合既有 RFC / ADR。

不应展开：是否重写整个系统；是否改变长期技术路线；是否修改公共协议；是否建立新工作组；是否改变组织规则——这些应转到 RFC、ADR 或 Planning。

### 5.3 Discussions

适合：开放问题；用户反馈；技术方向预讨论；社区问答；初步想法；非承诺性讨论。

不适合：安全漏洞披露；已需要执行的任务；需要 Owner 的交付事项；高风险决策；发布阻断事项。

### 5.4 GitHub Projects

用于跨仓库规划：Roadmap；Milestone；Release train；RFC pipeline；Research milestone；Security review queue；Embodied test pipeline。

推荐字段：

| 字段               | 说明                                                                |
| ---------------- | ----------------------------------------------------------------- |
| Area             | Agent / Infra / Frontend / Backend / Embodiment / Research / Docs |
| Type             | Bug / Feature / RFC / ADR / Experiment / Security / Release       |
| Priority         | P0 / P1 / P2 / P3                                                 |
| Risk             | S0–S5                                                             |
| Owner            | 当前负责人                                                             |
| Status           | Backlog / Ready / In Progress / Review / Blocked / Done           |
| Target Milestone | 所属阶段                                                              |
| Last Update      | 最后状态更新时间                                                          |
| Blocking         | 是否阻塞其他工作                                                          |

### 5.5 GitHub 通知策略

每位核心成员应配置 GitHub notification，至少关注：自己负责的仓库；自己所属 Area；被请求 Review 的 PR；被 @mention 的 Issue / PR / Discussion；Release；Security alerts。

---

## 6. 飞书沟通规范

飞书作为内部实时沟通 + 日历 + 会议 + 自动化通知入口。

### 6.1 群组设计

固定命名规则：

```text
mw-announcements
mw-general
mw-engineering
mw-research
mw-agent
mw-infra
mw-frontend-backend
mw-embodiment
mw-security-private
mw-incidents
mw-rfc-review
mw-releases
mw-community
mw-random
wg-<working-group-name>
area-<area-name>
project-<project-name>
```

### 6.2 群组类型

| 群组                    | 用途             | 权限                        |
| --------------------- | -------------- | ------------------------- |
| `mw-announcements`    | 组织级公告、发布、治理变更  | 只允许 Owner / Maintainer 发言 |
| `mw-general`          | 日常同步、轻量问题      | 全员                        |
| `mw-engineering`      | 工程协作、技术协调      | 工程成员                      |
| `mw-research`         | 论文、实验、复现讨论     | 研究成员                      |
| `mw-security-private` | 安全漏洞、凭据泄露、隐私事件 | 受限                        |
| `mw-incidents`        | 线上事故、服务中断、具身异常 | 受限或按事故开放                  |
| `mw-rfc-review`       | RFC 审查提醒和收敛    | Maintainer / Reviewer     |
| `wg-*`                | 工作组临时沟通        | 工作组成员                     |
| `project-*`           | 具体项目推进         | 项目成员                      |

### 6.3 飞书沟通硬规则

1. 不在飞书中做无记录的最终技术决策。
2. 不在普通群里发送密钥、token、生产配置、用户隐私、未公开安全漏洞。
3. 不用私聊替代公共协作；私聊形成结论后必须回写。
4. 不使用 @all / @here 处理非紧急事项。
5. 不在多个群重复讨论同一技术争议；应回到 Issue / RFC。
6. 所有机器人必须登记 Owner、权限、目标群、触发事件和关闭方式。

### 6.4 飞书消息格式

**请求帮助**

```markdown
[Help Needed]
Context:
Problem:
What I tried:
Link:
Needed from:
Deadline:
```

**决策提醒**

```markdown
[Decision Needed]
Topic:
Options:
Recommended option:
Trade-offs:
Decision owner:
Deadline:
Canonical link:
```

**状态更新**

```markdown
[Status Update]
Project:
Owner:
Last progress:
Blockers:
Next step:
Risk:
Links:
```

**事故消息**

```markdown
[Incident]
Severity:
Affected system:
Start time:
Current impact:
Incident DRI:
Live doc / issue:
Next update time:
```

---

## 7. Notion / Wiki 规范

Notion 不取代 GitHub 的工程事实，承担内部知识组织。

### 7.1 推荐用途

Organization Overview；Owner Registry；Onboarding；Meeting Index；Project Brief；Internal Roadmap；Research Reading List；Runbook；Access Map；Communication Directory；Glossary；Decision Index。

### 7.2 页面元数据

所有正式页面必须有：

```text
Owner:
Status: Draft / Active / Deprecated / Archived
Visibility: Public / Internal / Restricted
Sensitivity: Normal / Confidential / Security / Personal Data
Last Reviewed:
Next Review:
Related GitHub Issue / RFC / ADR:
Canonical: yes / no
```

### 7.3 Verified Page 规则

以下页面必须使用 Verified Page 或等价机制：Owner Registry；Onboarding Guide；Release Calendar；Security Contact；Incident Runbook；Access Request Guide；Communication Directory；Project Index；Active Roadmap。verification 过期后 Owner 收到提醒并须复审。

### 7.4 Notion 与 GitHub 的边界

Notion 解释背景、索引资源和组织知识；GitHub 保存工程事实、代码变更、Review、RFC、ADR 和 Release。Notion 页面包含工程决策时，应链接到 RFC / ADR；RFC / ADR 需要背景知识时，可反向链接 Notion 页面。

---

## 8. 日历、会议与会议记录

### 8.1 日历系统

内部日历使用飞书日历；公开社区会议可同步到 Google Calendar / iCalendar 订阅，便于外部参与者加入。

### 8.2 日历命名

```text
Moonweave - Governance
Moonweave - Engineering
Moonweave - Research
Moonweave - RFC Review
Moonweave - Release
Moonweave - Community
Moonweave - Security / Incident
```

### 8.3 会议创建规则

> 没有议程，不开会。没有 DRI，不开会。没有预期输出，不开会。可以异步解决的问题，默认不创建会议。

### 8.4 会议邀请必须包含

```text
Title:
Purpose:
Expected output:
DRI:
Required participants:
Optional participants:
Agenda doc:
Pre-read:
Related Issue / RFC / ADR:
Decision needed: yes / no
Recording / minutes policy:
```

### 8.5 会议类型

| 类型                | 频率        | 目的               | 产物                       |
| ----------------- | --------- | ---------------- | ------------------------ |
| Governance Sync   | 月度        | 治理状态、Owner 缺口、风险 | Summary + Action items   |
| Engineering Sync  | 周度或双周     | 跨仓库阻塞和工程节奏       | Issue updates            |
| RFC Review        | 按需或固定窗口   | 重大提案收敛           | RFC comments / decision  |
| Research Review   | 双周        | 实验、论文、复现         | Research log             |
| Release Review    | 每个 release 前 | 发布风险和准备度         | Release checklist        |
| Incident Review   | 事故后       | 复盘               | Postmortem               |
| Community Meeting | 月度        | 公开社区同步           | Public notes / recording |

### 8.6 会议纪要格式

```markdown
# Meeting Notes

Date:
Meeting:
DRI:
Participants:
Related links:

## Agenda

## Decisions
| Decision | Owner | Link |
|---|---|---|

## Action Items
| Action | Owner | Due | Tracking Issue |
|---|---|---|---|

## Risks / Blockers

## Open Questions

## Follow-up
```

---

## 9. 对外社区交流：微信群与 Discord

辉夜计划建立微信群与 Discord 社区，供对项目感兴趣的人加入、讨论与交流。

### 9.1 定位

微信群面向中文社区，Discord 面向国际社区与语音/视频活动。两者都是**对外社区交流入口**，不是内部协作主通道，也不是工程事实源。

### 9.2 推荐用途

- 项目兴趣讨论与科普；
- 新人问答与引导；
- 社区活动公告与报名；
- 研究与设计方向的开放讨论；
- Demo、分享会、社区会议的预告与回放；
- 贡献者与潜在贡献者之间的非正式交流。

### 9.3 频道/分组结构

**Discord**（建议频道）：

```text
#announcements      官方公告（仅管理员发言）
#general            通用讨论
#introductions      新人自我介绍
#questions          问答与求助
#agent              Agent 相关讨论
#infra              AI Infra 讨论
#embodiment         具身智能讨论
#research           论文、实验、复现
#rfc-discussion     RFC 公开讨论与反馈
#community-events   社区活动、Meetup
#showcase           作品与 Demo 展示
#off-topic          闲聊
```

**微信群**（建议分组）：

- 辉夜计划·公告
- 辉夜计划·综合讨论
- 辉夜计划·新人入群 / 问答
- 辉夜计划·Agent / Infra / 具身（按兴趣分群，规模上来后再拆）
- 辉夜计划·RFC 公开讨论
- 辉夜计划·社区活动

### 9.4 边界与硬规则

1. 微信与 Discord 中的技术结论不构成项目事实——有价值的讨论须由参与者或 Maintainer 回写 GitHub Discussion / Issue / RFC，不回写的不算数。
2. 不得在公开群发送密钥、token、生产配置、用户隐私、未公开安全漏洞、未授权素材。安全漏洞走 `02-Security-Ethics.md` §11 的私密披露渠道，不在社区群讨论。
3. 社区群的行为准则适用 `02-Community.md` §9；骚扰、羞辱、歧视、身份冒充、隐私泄露、恶意刷屏、未授权宣传同样被禁止。
4. 社区群应有明确 Moderator 与 Owner（见 §13），公开群不应无主。
5. 群内机器人需登记 Owner、权限、触发事件与关闭方式；未登记机器人不得进入正式社区群。
6. 社区群不是发布通道——路线图、安全声明、合作关系、法律承诺、发布公告只能由获授权者以官方身份发布（见 `02-Community.md` §14）。

### 9.5 与内部通道的衔接

社区群里涌现的贡献意向、Bug 线索、研究想法，由对应 Area 的 Maintainer 或社区 Moderator 路由到 GitHub Issue / Discussion。反向地，公开 RFC、社区会议、Release 也会通过 `#announcements` 与公告群向社区同步。社区群是漏斗的入口，不是漏斗本身。

---

## 10. 自动化通知与 Agent 推送

> Agent 是通信路由器，不是负责人。Agent 可以提醒、摘要、检查、创建草案，但不能替代 DRI、Maintainer 或 Owner 作出组织决策。

### 10.1 推荐 Agent 架构

```text
GitHub Events
Notion Events
Feishu Calendar
CI/CD
Security Alerts
Monitoring
        ↓
Moonweave Communication Hub
        ↓
Feishu Bot Cards
GitHub Comments
Notion Updates
Calendar Reminders
Weekly Digest
（Discord / 微信公告频道，仅限公开信息）
```

### 10.2 推荐 Agent 角色

**Kaguya Relay** — GitHub / CI / Release / Security 事件路由。

| 事件                       | 推送方式                      |
| ------------------------ | ------------------------- |
| P0 / P1 incident         | 即时飞书消息 + incident channel |
| Security alert           | 安全群私密推送                   |
| PR review requested      | 对应 Area 群或 Reviewer 私信    |
| CI failure on main       | 工程群                       |
| RFC review window opened | RFC 群 + Discord #rfc-discussion |
| Release published        | announcements + Discord/微信公告频道 |
| 普通 Issue 更新              | 日报或周报摘要                   |

**Kaguya Scribe** — 会议记录与决策提取。检查会议是否有 agenda；会前提醒补充议程；会后生成 minutes 草稿；提取 decisions / action items；要求人类 DRI 确认后再写入 Notion / GitHub；自动关联 Issue / RFC / ADR。

**Kaguya Steward** — 治理与交接提醒。每周生成 Owner 缺口报告；提醒即将过期的 Notion verified pages；提醒无人响应的 Issue / PR；提醒过期 RFC；提醒长期未更新的 Roadmap item；生成 Maintainer weekly digest；检查 Working Group 是否超出时间边界。

**Kaguya Sentinel** — 安全与事故沟通。检测 security label / secret leak / incident label；自动创建 incident live doc；拉起 incident channel；提醒 Incident DRI；记录时间线；定时提醒下一次状态更新；事故结束后生成 postmortem 草稿。

### 10.3 Agent 权限规则

所有 Agent 必须登记：Name；Owner；Purpose；Data access scope；Write permissions；Target channels；Trigger events；Rate limit；Disable method；Audit log location。

禁止：未登记机器人进入正式群；Bot 自动 @all / @everyone / @here；Bot 读取安全群以外的敏感内容后扩散到普通群；Bot 自动合并 PR；Bot 自动批准 RFC；Bot 自动发布 release；Bot 在无人确认下修改 Owner Registry 或 Security policy。

---

## 11. 交接、缺席与上下文转移

长期项目会被"某个人知道"拖垮，这节必须具体。

### 11.1 什么时候必须交接

以下情况必须创建 Handoff Note：DRI 离开任务超过 2 个工作日；Owner 暂时无法响应关键系统；Release DRI 更换；Incident DRI 更换；Working Group 负责人更换；Maintainer 进入 Inactive / Emeritus；项目暂停或归档；跨仓库任务转移给其他 Area。

### 11.2 Handoff Note 模板

```markdown
# Handoff Note

Task / System:
Current DRI:
Next DRI:
Date:
Status:
Canonical links:

## Current State

## Completed Work

## Pending Decisions

## Open Risks

## Blockers

## Next Actions
| Action | Owner | Due | Link |
|---|---|---|---|

## Access / Permission Notes
Do not include secrets. Link to access request process only.

## Context Needed

## Suggested First Step
```

### 11.3 交接规则

1. 交接必须链接到 Issue / Project / RFC / ADR。
2. 不得通过私聊完成唯一交接。
3. 不得在交接文档中写入密钥、token 或生产凭据。
4. 高风险系统必须有 Backup Owner。
5. 交接完成后，Owner Registry 和 Project 状态必须更新。

---

## 12. 升级路径与事故沟通

### 12.1 普通问题升级

```text
Issue / PR comment
  ↓
Owner / Reviewer mention
  ↓
Area channel
  ↓
Maintainer
  ↓
RFC / Planning meeting
  ↓
Maintainer Council
```

### 12.2 安全与事故升级

```text
Detection
  ↓
mw-security-private / mw-incidents
  ↓
Incident DRI assigned
  ↓
Live timeline created
  ↓
Status updates at fixed interval
  ↓
Mitigation / rollback
  ↓
Postmortem
  ↓
Action items tracked in GitHub
```

### 12.3 事故沟通规则

事故期间，所有状态更新必须包含：当前影响；已确认事实；尚未确认的信息；正在采取的动作；下一次更新时间；DRI。

禁止：在未确认前公开猜测根因；多个群并行发布冲突状态；绕过 Incident DRI 对外承诺修复时间；将安全细节扩散到普通频道或社区群。

---

## 13. 安全、隐私与访问边界

以下内容不得出现在普通飞书群、公开 GitHub Issue、公开 Discussion、非受限 Notion 页面，**以及微信/Discord 社区群**：

- 访问密钥、token、私钥、生产配置；
- 未公开安全漏洞；
- 用户个人数据；
- 长期记忆数据；
- 具身终端风险细节；
- 未授权素材或来源不明数据；
- 行为准则举报细节；
- 法律、商业合作和未公开发布事项。

飞书机器人、Notion/GitHub 集成、Discord bot、微信机器人必须最小权限，并登记 Owner、权限边界与审计。

---

## 14. 沟通系统维护机制

> 沟通系统本身也需要 Owner。

| 对象                           | Owner                               |
| ---------------------------- | ----------------------------------- |
| 飞书空间                         | Community / Operations Owner        |
| GitHub organization settings | Maintainer Council / Infra Owner    |
| Notion workspace             | Knowledge Owner                     |
| Calendar                     | Operations Owner                    |
| Discord server               | Community Owner                     |
| 微信群                          | Community Owner                      |
| Bot / Agent                  | Infra Owner + Security Reviewer     |
| Announcement channel         | Stewardship Council                 |
| Security channel             | Security Owner                      |
| Incident channel             | Incident Commander / Security Owner |

每季度审查：

- 飞书 / 微信 / Discord 群是否过多；
- 是否存在无人 Owner 的群；
- 是否存在长期未更新 Notion 页面；
- 是否存在重复事实源；
- 是否存在过度 noisy 的机器人；
- 是否存在无人响应的 Issue / PR；
- 是否存在关键 Owner 单点；
- 是否存在过期会议和无产出的例会。

---

## 15. 修订与核心规则

本文只能通过公开 RFC 修订。旧版存于版本控制，随时可查。与 `01-Principles.md` 的"冲突与修订"一致：当本文与组织权限、RFC 流程或安全规则冲突时，以对应专项文档为准；当与法律、安全伦理底线冲突时，底线优先。

最重要的核心规则是下面三条：

1. 重要结论必须有权威链接。
2. 聊天不能成为唯一事实源——飞书、微信、Discord 都是通道，不是事实源。
3. Agent 只能辅助沟通，不能替代 Owner / DRI / Maintainer 的责任。
