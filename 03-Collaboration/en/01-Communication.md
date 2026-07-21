# Communication Standards

> This document presents the organizational communication system design for the project. It addresses "which platform is used for which matters, which information must be captured, which communication can be ephemeral, which conclusions must return to GitHub / Notion / RFC / ADR, how meetings create records for tracking, what Agent automation may and may not push, and how handoffs, absences, incidents, and escalations are handled."

One core judgment:

> **Chat tools handle fast communication; GitHub holds engineering facts; Notion / the knowledge base holds organizational memory; the calendar holds cadence; Agents handle reminders and routing—but never become the source of truth.**

---

## 1. Purpose and Scope

This document defines communication practices for the Kaguya Project in day-to-day collaboration, engineering development, research advancement, community participation, meetings, incident response, knowledge capture, and automated notifications.

This document applies to:

- GitHub Issues / Pull Requests / Discussions / Projects;
- Feishu (Lark) group chats, direct messages, calendar, meetings, documents, and bots;
- Notion or equivalent knowledge bases;
- WeChat groups and Discord community (external communication);
- RFC / ADR / Research Logs;
- Automated notifications, Agent pushes, and operational alerts;
- Public community spaces and internal collaboration spaces.

This document does not replace role and permission definitions in `../../02-Governance/en/01-Organization.md`, formal decision processes in `03-RFC-Process.md`, or security disclosure and incident handling rules in `../../01-Foundation/en/02-Security-Ethics.md`.

---

## 2. Communication Principles

1. **Async first, sync as supplement** — Default to traceable asynchronous communication. Meetings, voice, and instant chat are used only for quick clarification, conflict resolution, incident handling, and high-bandwidth discussion.
2. **Important conclusions must have an authoritative link** — Any conclusion affecting project direction, public interfaces, releases, security boundaries, roadmaps, Owners, permissions, or community member rights must return to a GitHub Issue, PR, RFC, ADR, authoritative Notion page, or meeting record. Conclusions in chat alone do not constitute organizational fact.
3. **Single source of truth** — Each topic has exactly one authoritative source of truth. Chat, meeting notes, task boards, and automated pushes may reference the source of truth but must not create conflicting parallel facts.

   | Information type | Authoritative source of truth |
   | ---------------- | ----------------------------- |
   | Code changes | GitHub PR |
   | Bug / Feature / Task | GitHub Issue |
   | Cross-repository planning | GitHub Project / Planning doc |
   | Major technical proposals | RFC |
   | Accepted architecture decisions | ADR |
   | Long-term organizational knowledge | Notion / Wiki verified page |
   | Meeting conclusions | Meeting notes + linked Issue/RFC/ADR |
   | Security incidents | Security incident record—not ordinary public Issues |
   | Release facts | Release notes / Changelog |

4. **Open by default, bounded privacy** — Default to open or team-visible spaces. Restricted spaces are used only for security vulnerabilities, privacy, legal matters, code of conduct, undisclosed partnerships, credentials, personal matters, or high-risk embodied incidents.
5. **Chat is not a task system** — Feishu / WeChat / Discord chat may remind and coordinate, but must not be the sole record for tasks, decisions, risks, technical debt, or deliverables. Tasks → convert to GitHub Issue / Notion Task / RFC action item; technical conclusions → convert to Issue comment / PR comment / RFC update / ADR.
6. **Automation serves people, not the reverse** — Agents and bots reduce forgetfulness, route information, surface risk, and generate summaries; they must not create noise through low-quality, high-frequency, non-configurable pushes.
7. **Communication must support handoff** — Any long-running task, Owner responsibility, incident handling, or cross-repository initiative must be pick-up-able when the responsible person is absent. Push forward, record everything, transfer ownership to the next person, then continue other work.

---

## 3. Platform Roles

Each platform's role must be explicit; otherwise GitHub, Notion, Feishu groups, and meeting verbal statements will diverge and nobody will know which is authoritative.

| Platform | Role | Does not handle |
| -------- | ---- | --------------- |
| **GitHub** | Engineering source of truth: Issue, PR, Discussion, Project, RFC, ADR, Release | Casual chat, internal private matters |
| **Feishu** | Internal real-time communication, meetings, calendar, reminders, bot notifications, incident coordination | Long-term source of truth, final architecture records |
| **Notion / Wiki** | Internal organizational knowledge, project index, Owner Registry, meeting archive, Onboarding, Runbook | Code Review, formal engineering changes |
| **Guidelines Repo** | Public principles, governance, collaboration, engineering standards, RFC/ADR archive | Ad-hoc task management |
| **WeChat groups** | Chinese community external communication, interest discussion, newcomer guidance | Engineering facts, decisions, security disclosure |
| **Discord** | International community external communication, interest discussion, voice/video community events | Engineering facts, decisions, security disclosure |
| **Calendar** | Meeting cadence, public community meetings, review windows, release windows | Decision text itself |
| **Agent / Bot Layer** | Event routing, summaries, reminders, status checks | Fact adjudication, permission substitution, human responsibility substitution |

Source-of-truth rules:

> GitHub is the source of truth for engineering activity. Notion is the source of truth for internal organizational knowledge. The Guidelines Repo is the source of truth for organizational rules. Feishu is an internal communication and notification channel—not a source of truth. WeChat and Discord are community entry points—not sources of truth. Agents are routers, not adjudicators.

WeChat and Discord serve external participants interested in the Kaguya Project, hosting interest discussion, Q&A, newcomer guidance, and community events; any valuable technical conclusions there must be written back to GitHub Issue / Discussion / RFC by participants or Maintainers. What is not written back does not constitute project fact.

---

## 4. Information Classification and Communication Channels

| Scenario | Default platform | Must be captured in |
| -------- | ---------------- | ------------------- |
| Bug | GitHub Issue | Issue |
| Feature | GitHub Issue / Discussion | Issue / RFC |
| Code review | GitHub PR | PR |
| Architecture dispute | GitHub Issue → RFC | RFC / ADR |
| Release preparation | GitHub Project + Feishu reminder | Release checklist |
| Research discussion | GitHub Discussion / Notion | Research log |
| Experiment results | Notion / repo research log | Research log |
| Daily coordination | Feishu | Issue when necessary |
| Decision meeting | Feishu meeting | Meeting notes + Issue/RFC/ADR |
| Incident response | Feishu incident channel | Incident report / Postmortem |
| Security vulnerability | Private security channel | Security advisory / private issue |
| Organization announcement | Feishu announcement + GitHub/Notion | Announcement record |
| Community Q&A | GitHub Discussions / WeChat / Discord | Discussion |
| Roadmap | GitHub Project / Notion | Project / Planning doc |
| Owner change | Notion Owner Registry + PR | Organization record |

---

## 5. GitHub Communication Standards

### 5.1 Issues

Use for: Bug reports; Feature requests; Task tracking; Research reproduction issues; Documentation gaps; Technical debt; Cross-repository dependencies; Public issues other than security.

An Issue must include: Background / Context; Expected outcome; Scope; Owner / DRI; Status; Related PR / RFC / ADR; Risk level; Deadline or review date (if applicable).

### 5.2 Pull Requests

A PR is an implementation discussion space—not a venue for large directional debates.

Permitted discussion: Implementation correctness; Tests; Maintainability; Interface compatibility; Documentation updates; Security risks; Compliance with existing RFC / ADR.

Should not expand into: Whether to rewrite the entire system; Whether to change long-term technical direction; Whether to modify public protocols; Whether to establish new working groups; Whether to change organizational rules—these belong in RFC, ADR, or Planning.

### 5.3 Discussions

Suitable for: Open questions; User feedback; Preliminary technical direction discussion; Community Q&A; Initial ideas; Non-committing discussion.

Not suitable for: Security vulnerability disclosure; Tasks already requiring execution; Deliverables needing an Owner; High-risk decisions; Release-blocking matters.

### 5.4 GitHub Projects

Used for cross-repository planning: Roadmap; Milestone; Release train; RFC pipeline; Research milestone; Security review queue; Embodied test pipeline.

Recommended fields:

| Field | Description |
| ----- | ----------- |
| Area | Agent / Infra / Frontend / Backend / Embodiment / Research / Docs |
| Type | Bug / Feature / RFC / ADR / Experiment / Security / Release |
| Priority | P0 / P1 / P2 / P3 |
| Risk | S0–S5 |
| Owner | Current responsible person |
| Status | Backlog / Ready / In Progress / Review / Blocked / Done |
| Target Milestone | Associated phase |
| Last Update | Last status update time |
| Blocking | Whether blocking other work |

### 5.5 GitHub Notification Strategy

Each core member should configure GitHub notifications to at least follow: Repositories they own; Their Area; PRs requesting their Review; Issues / PRs / Discussions where they are @mentioned; Releases; Security alerts.

---

## 6. Feishu Communication Standards

Feishu serves as the internal real-time communication + calendar + meetings + automated notification entry point.

### 6.1 Group Design

Fixed naming rules:

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

### 6.2 Group Types

| Group | Purpose | Permissions |
| ----- | ------- | ----------- |
| `mw-announcements` | Organization-level announcements, releases, governance changes | Only Owner / Maintainer may post |
| `mw-general` | Daily sync, lightweight questions | All members |
| `mw-engineering` | Engineering collaboration, technical coordination | Engineering members |
| `mw-research` | Papers, experiments, reproduction discussion | Research members |
| `mw-security-private` | Security vulnerabilities, credential leaks, privacy incidents | Restricted |
| `mw-incidents` | Production incidents, service outages, embodied anomalies | Restricted or opened per incident |
| `mw-rfc-review` | RFC review reminders and convergence | Maintainer / Reviewer |
| `wg-*` | Working group temporary communication | Working group members |
| `project-*` | Specific project advancement | Project members |

### 6.3 Feishu Hard Rules

1. Do not make final technical decisions in Feishu without a record.
2. Do not send keys, tokens, production configuration, user privacy, or undisclosed security vulnerabilities in ordinary groups.
3. Do not use direct messages in place of public collaboration; conclusions formed in DMs must be written back.
4. Do not use @all / @here for non-urgent matters.
5. Do not repeat the same technical dispute across multiple groups; return to Issue / RFC.
6. All bots must be registered with Owner, permissions, target groups, trigger events, and disable method.

### 6.4 Feishu Message Formats

**Help Needed**

```markdown
[Help Needed]
Context:
Problem:
What I tried:
Link:
Needed from:
Deadline:
```

**Decision Reminder**

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

**Status Update**

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

**Incident Message**

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

## 7. Notion / Wiki Standards

Notion does not replace GitHub's engineering facts; it organizes internal knowledge.

### 7.1 Recommended Uses

Organization Overview; Owner Registry; Onboarding; Meeting Index; Project Brief; Internal Roadmap; Research Reading List; Runbook; Access Map; Communication Directory; Glossary; Decision Index.

### 7.2 Page Metadata

All formal pages must have:

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

### 7.3 Verified Page Rules

The following pages must use Verified Page or equivalent mechanism: Owner Registry; Onboarding Guide; Release Calendar; Security Contact; Incident Runbook; Access Request Guide; Communication Directory; Project Index; Active Roadmap. When verification expires, the Owner receives a reminder and must re-review.

### 7.4 Notion and GitHub Boundaries

Notion explains background, indexes resources, and organizes knowledge; GitHub holds engineering facts, code changes, Review, RFC, ADR, and Release. When Notion pages contain engineering decisions, they should link to RFC / ADR; when RFC / ADR need background knowledge, they may link back to Notion pages.

---

## 8. Calendar, Meetings, and Meeting Records

### 8.1 Calendar System

Internal calendar uses Feishu Calendar; public community meetings may sync to Google Calendar / iCalendar subscription for external participants.

### 8.2 Calendar Naming

```text
Moonweave - Governance
Moonweave - Engineering
Moonweave - Research
Moonweave - RFC Review
Moonweave - Release
Moonweave - Community
Moonweave - Security / Incident
```

### 8.3 Meeting Creation Rules

> No agenda, no meeting. No DRI, no meeting. No expected output, no meeting. Problems solvable asynchronously default to no meeting.

### 8.4 Meeting Invitations Must Include

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

### 8.5 Meeting Types

| Type | Frequency | Purpose | Output |
| ---- | --------- | ------- | ------ |
| Governance Sync | Monthly | Governance status, Owner gaps, risk | Summary + Action items |
| Engineering Sync | Weekly or biweekly | Cross-repository blockers and engineering cadence | Issue updates |
| RFC Review | On demand or fixed window | Major proposal convergence | RFC comments / decision |
| Research Review | Biweekly | Experiments, papers, reproduction | Research log |
| Release Review | Before each release | Release risk and readiness | Release checklist |
| Incident Review | After incident | Postmortem | Postmortem |
| Community Meeting | Monthly | Public community sync | Public notes / recording |

### 8.6 Meeting Notes Format

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

## 9. External Community Communication: WeChat Groups and Discord

The Kaguya Project maintains WeChat groups and a Discord community for people interested in the project to join, discuss, and connect.

### 9.1 Positioning

WeChat groups serve the Chinese community; Discord serves the international community and voice/video activities. Both are **external community entry points**—not primary internal collaboration channels and not engineering sources of truth.

### 9.2 Recommended Uses

- Project interest discussion and outreach;
- Newcomer Q&A and guidance;
- Community event announcements and registration;
- Open discussion of research and design direction;
- Demo, sharing session, and community meeting previews and replays;
- Informal exchange among contributors and potential contributors.

### 9.3 Channel / Group Structure

**Discord** (recommended channels):

```text
#announcements      Official announcements (admins only)
#general            General discussion
#introductions      New member introductions
#questions          Q&A and help
#agent              Agent-related discussion
#infra              AI Infra discussion
#embodiment         Embodied intelligence discussion
#research           Papers, experiments, reproduction
#rfc-discussion     Public RFC discussion and feedback
#community-events   Community events, Meetup
#showcase           Work and Demo showcase
#off-topic          Casual chat
```

**WeChat groups** (recommended groups):

- Kaguya Project · Announcements
- Kaguya Project · General Discussion
- Kaguya Project · New Member / Q&A
- Kaguya Project · Agent / Infra / Embodiment (split by interest as scale grows)
- Kaguya Project · Public RFC Discussion
- Kaguya Project · Community Events

### 9.4 Boundaries and Hard Rules

1. Technical conclusions in WeChat and Discord do not constitute project fact—valuable discussion must be written back to GitHub Discussion / Issue / RFC by participants or Maintainers; what is not written back does not count.
2. Do not send keys, tokens, production configuration, user privacy, undisclosed security vulnerabilities, or unauthorized assets in public groups. Security vulnerabilities follow the private disclosure channel in `../../01-Foundation/en/02-Security-Ethics.md` §11—not community group discussion.
3. Community group code of conduct applies per `../../02-Governance/en/02-Community.md` §9; harassment, humiliation, discrimination, identity impersonation, privacy leaks, malicious spam, and unauthorized promotion are likewise prohibited.
4. Community groups must have explicit Moderators and Owners (see §13); public groups must not be ownerless.
5. In-group bots must be registered with Owner, permissions, trigger events, and disable method; unregistered bots must not enter formal community groups.
6. Community groups are not release channels—roadmaps, security statements, partnership announcements, legal commitments, and official announcements may only be published by authorized persons in an official capacity (see `../../02-Governance/en/02-Community.md` §14).

### 9.5 Connection with Internal Channels

Contribution intent, bug leads, and research ideas emerging in community groups are routed by the relevant Area Maintainer or community Moderator to GitHub Issue / Discussion. Conversely, public RFCs, community meetings, and Releases are synced to the community via `#announcements` and announcement groups. Community groups are the funnel entry—not the funnel itself.

---

## 10. Automated Notifications and Agent Push

> Agents are communication routers, not responsible parties. Agents may remind, summarize, check, and draft—but cannot replace DRI, Maintainer, or Owner in making organizational decisions.

### 10.1 Recommended Agent Architecture

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
(Discord / WeChat announcement channels—public information only)
```

### 10.2 Recommended Agent Roles

**Kaguya Relay** — Routes GitHub / CI / Release / Security events.

| Event | Push method |
| ----- | ----------- |
| P0 / P1 incident | Immediate Feishu message + incident channel |
| Security alert | Private push to security group |
| PR review requested | Corresponding Area group or Reviewer DM |
| CI failure on main | Engineering group |
| RFC review window opened | RFC group + Discord #rfc-discussion |
| Release published | announcements + Discord/WeChat announcement channels |
| Ordinary Issue update | Daily or weekly digest |

**Kaguya Scribe** — Meeting records and decision extraction. Checks whether meetings have an agenda; reminds to supplement agenda before meeting; generates minutes draft after meeting; extracts decisions / action items; requires human DRI confirmation before writing to Notion / GitHub; auto-links Issue / RFC / ADR.

**Kaguya Steward** — Governance and handoff reminders. Generates weekly Owner gap report; reminds about expiring Notion verified pages; reminds about unresponsive Issues / PRs; reminds about stale RFCs; reminds about long-unupdated Roadmap items; generates Maintainer weekly digest; checks whether Working Groups exceed time boundaries.

**Kaguya Sentinel** — Security and incident communication. Detects security label / secret leak / incident label; auto-creates incident live doc; spins up incident channel; reminds Incident DRI; records timeline; timed reminders for next status update; generates postmortem draft after incident ends.

### 10.3 Agent Permission Rules

All Agents must be registered with: Name; Owner; Purpose; Data access scope; Write permissions; Target channels; Trigger events; Rate limit; Disable method; Audit log location.

Prohibited: Unregistered bots in formal groups; Bot auto @all / @everyone / @here; Bot reading sensitive content outside security groups and spreading to ordinary groups; Bot auto-merge PR; Bot auto-approve RFC; Bot auto-publish release; Bot modifying Owner Registry or Security policy without human confirmation.

---

## 11. Handoff, Absence, and Context Transfer

Long-running projects fail when "someone knows"—this section must be concrete.

### 11.1 When Handoff Is Required

The following require a Handoff Note: DRI leaves a task for more than 2 business days; Owner temporarily unable to respond on critical systems; Release DRI change; Incident DRI change; Working Group lead change; Maintainer enters Inactive / Emeritus; Project paused or archived; Cross-repository task transferred to another Area.

### 11.2 Handoff Note Template

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

### 11.3 Handoff Rules

1. Handoff must link to Issue / Project / RFC / ADR.
2. Handoff must not be completed solely via direct message.
3. Handoff documents must not contain keys, tokens, or production credentials.
4. High-risk systems must have a Backup Owner.
5. After handoff, Owner Registry and Project status must be updated.

---

## 12. Escalation Paths and Incident Communication

### 12.1 Ordinary Issue Escalation

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

### 12.2 Security and Incident Escalation

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

### 12.3 Incident Communication Rules

During an incident, all status updates must include: Current impact; Confirmed facts; Unconfirmed information; Actions in progress; Next update time; DRI.

Prohibited: Publicly guessing root cause before confirmation; Publishing conflicting status across multiple groups in parallel; Bypassing Incident DRI to commit externally to fix times; Spreading security details to ordinary channels or community groups.

---

## 13. Security, Privacy, and Access Boundaries

The following must not appear in ordinary Feishu groups, public GitHub Issues, public Discussions, non-restricted Notion pages, **or WeChat/Discord community groups**:

- Access keys, tokens, private keys, production configuration;
- Undisclosed security vulnerabilities;
- User personal data;
- Long-term memory data;
- Embodied terminal risk details;
- Unauthorized assets or data of unknown provenance;
- Code of conduct report details;
- Legal, business partnership, and undisclosed release matters.

Feishu bots, Notion/GitHub integrations, Discord bots, and WeChat bots must use least privilege and be registered with Owner, permission boundaries, and audit.

---

## 14. Communication System Maintenance

> The communication system itself needs an Owner.

| Object | Owner |
| ------ | ----- |
| Feishu workspace | Community / Operations Owner |
| GitHub organization settings | Maintainer Council / Infra Owner |
| Notion workspace | Knowledge Owner |
| Calendar | Operations Owner |
| Discord server | Community Owner |
| WeChat groups | Community Owner |
| Bot / Agent | Infra Owner + Security Reviewer |
| Announcement channel | Stewardship Council |
| Security channel | Security Owner |
| Incident channel | Incident Commander / Security Owner |

Quarterly review:

- Whether Feishu / WeChat / Discord groups are excessive;
- Whether ownerless groups exist;
- Whether long-unupdated Notion pages exist;
- Whether duplicate sources of truth exist;
- Whether overly noisy bots exist;
- Whether unresponsive Issues / PRs exist;
- Whether critical Owner single points exist;
- Whether stale meetings and unproductive recurring meetings exist.

---

## 15. Revision and Core Rules

This document may only be revised through a public RFC. Previous versions are stored in version control and remain accessible. Consistent with "Conflict and Revision" in `../../01-Foundation/en/01-Principles.md`: when this document conflicts with organizational permissions, RFC process, or security rules, the corresponding specialized document takes precedence; when conflicting with legal or security-ethics baselines, the baseline takes precedence.

The three most important core rules:

1. Important conclusions must have an authoritative link.
2. Chat cannot be the sole source of truth—Feishu, WeChat, and Discord are channels, not sources of truth.
3. Agents may assist communication only—they cannot replace Owner / DRI / Maintainer responsibility.
