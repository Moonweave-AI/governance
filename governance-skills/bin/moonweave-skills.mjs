#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { auditRepository } from '../lib/audit.mjs';
import { packageJson, packageRoot } from '../lib/config.mjs';
import { emit, findingsMarkdown, toSarif } from '../lib/output.mjs';
import { doctor, doctorMarkdown, generateChecksums, install, listContent, uninstall } from '../lib/installer.mjs';
import { lintMarkdown, lintSkills } from '../lib/skill-lint.mjs';
import { routeMarkdown, routeText } from '../lib/router.mjs';
import { renderTemplate, templateNames } from '../lib/templates.mjs';
import { ensureDir, readJson } from '../lib/fs-utils.mjs';

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--') {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (token.startsWith('--')) {
      const eq = token.indexOf('=');
      if (eq > 2) {
        options[token.slice(2, eq)] = token.slice(eq + 1);
      } else {
        const key = token.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('-')) {
          options[key] = next;
          i += 1;
        } else options[key] = true;
      }
    } else if (token === '-h' || token === '-?') options.help = true;
    else if (token === '-v') options.version = true;
    else positional.push(token);
  }
  return { positional, options };
}

function help() {
  return `Moonweave Governance Skills ${packageJson.version}

Usage:
  moonweave-skills <command> [options]

Commands:
  list                         List skills, commands, templates, and platforms
  install                      Install skills, rules, and command adapters
  doctor                       Check runtime environment, installation, and drift
  route                        Run S0-S5 / QA-L0-L5 governance routing for a task
  new <template>               Generate a governance, engineering, research, or ops template
  audit                        Read-only audit of project governance and engineering baseline
  lint-skills                  Statically check Agent Skills format and dangerous patterns
  eval-static                  Run routing, trigger, and static safety regressions
  checksums                    Generate checksums.sha256
  uninstall                    Safely uninstall items recorded by the lock file

Examples:
  moonweave-skills route --text "Let an Agent write to the production database autonomously"
  moonweave-skills install --root . --agents all --scope project --mode copy
  moonweave-skills new rfc --title "Unify the long-term memory protocol" --out 05-Knowledge/rfc/0000-memory.md
  moonweave-skills audit --root . --profile ai-agent --format markdown

Run "moonweave-skills <command> --help" for command-specific options.
`;
}

function listMarkdown(data) {
  const lines = [`# ${data.package} ${data.version}`, '', '## Platforms', ''];
  for (const item of data.agents) lines.push(`- ${item}`);
  lines.push('', `## Skills (${data.skills.length})`, '');
  for (const item of data.skills) lines.push(`- \`${item}\``);
  lines.push('', `## Commands (${data.commands.length})`, '', '| Command | Skill | Description |', '|---|---|---|');
  for (const item of data.commands) lines.push(`| \`/${item.command}\` | \`${item.skill}\` | ${item.description} |`);
  lines.push('', `## Templates (${data.templates.length})`, '');
  for (const item of data.templates) lines.push(`- \`${item}\``);
  return lines.join('\n');
}

function installMarkdown(result) {
  const lines = ['# Installation complete', '', `- Root: \`${result.root}\``, `- Scope: ${result.scope}`, `- Mode: ${result.mode}`, `- Agents: ${result.agents.join(', ')}`, `- Skills: ${result.skills}`, `- Lock: \`${result.lock_path}\``, '', '## Log', ''];
  for (const line of result.messages) lines.push(`- ${line}`);
  if (result.mode === 'symlink') lines.push('', '> Symlink mode requires the skills package path to persist long-term; when running via npx temporarily, the default copy mode is recommended.');
  return lines.join('\n');
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function staticTrigger(skill, text) {
  const t = String(text ?? '').toLowerCase();
  const map = {
    'moonweave-governance-router': /(治理路由|下一步.*(流程|技能)|风险等级|qa-l[0-5]|m[0-9].*成熟度|该走.*(?:rfc|adr|issue)|不确定.*(?:流程|规范))/i,
    'moonweave-project-bootstrap': /(新建.*(?:仓库|项目|服务)|项目初始化|仓库基线|把.*(?:poc|原型|demo).*(?:工程化|正式.*项目)|接管遗留仓库)/i,
    'moonweave-idea-triage': /(有个想法|idea.*(?:triage|分诊)|需求澄清|是否值得做|backlog.*清理|discovery.*问题|想法.*优先级)/i,
    'moonweave-project-planning': /(roadmap|milestone|项目计划|任务拆解|规划.*项目|原型.*晋级|暂停.*归档|生命周期门禁)/i,
    'moonweave-rfc': /(公共协议|公共接口|schema|核心数据库|治理|角色权限|跨仓库|breaking|重大.*(?:架构|变更)|\brfc\b)/i,
    'moonweave-adr': /(架构决策记录|\badr\b|记录.*(?:技术选型|架构决定)|替代.*旧.*决策|已作出.*架构选择)/i,
    'moonweave-issue': /(创建.*issue|补全.*issue|github issue|分诊.*issue|action item.*任务|把.*聊天.*落到.*任务)/i,
    'moonweave-engineering-brief': /(engineering brief|工程简报|实现前.*技术设计|领域概念.*不变量|不变量.*失败模式|进入.*engineering ready)/i,
    'moonweave-implementation': /(开始实现|实际开发|实现.*feature|修复.*bug|跨文件实现|代码重构|按.*验收标准.*编码)/i,
    'moonweave-pull-request': /(创建.*\bpr\b|准备.*\bpr\b|pr描述|pull request.*说明|可审查.*pull request|整理.*pull request|合并前自检|整理.*可审查.*变更)/i,
    'moonweave-code-review': /(review|审查|检查.*diff|检查.*pr|可合并|request changes|code review)/i,
    'moonweave-security-review': /(oauth|认证|授权|shell|个人信息|隐私|机器人|执行器|密钥|安全|agent.*工具|威胁模型|许可证.*来源)/i,
    'moonweave-quality-assurance': /(质量保障|qa-l[0-5]|测试计划|ci门禁|flaky test|质量证据|生产质量|测试分层)/i,
    'moonweave-release-readiness': /(release readiness|生产就绪|准备.*发布|准备.*部署|上线前检查|go\/no-go|灰度发布|回滚决策)/i,
    'moonweave-documentation': /(编写.*文档|审查.*文档|readme|tutorial|how-to|reference|runbook|文档过期|知识资产|api文档)/i,
    'moonweave-research': /(论文|复现|模型评测|负面结果|实验|数据集|research|paper|dataset card|model card)/i,
    'moonweave-incident-response': /(事故|宕机|数据损坏|安全漏洞|越权|重大回归|incident|outage|postmortem|hotfix)/i,
    'moonweave-handoff': /(交接|handoff|负责人.*离开|owner.*移交|dri.*更换|换班|inactive|emeritus)/i,
    'moonweave-repository-audit': /(仓库审计|治理审计|repository audit|检查.*仓库.*基线|遗留仓库.*缺失|季度.*治理检查)/i,
    'moonweave-gap-analysis': /(补漏|差距分析|治理漂移|重复.*漏项|规范.*实际.*不一致|gap analysis|流程.*经常漏)/i,
    'moonweave-retrospective': /(复盘|反思|retrospective|季度回顾|发布后回顾|比较.*预期.*实际|持续改进)/i,
    'moonweave-community-contribution': /(首次贡献|good first issue|贡献者路径|mentorship|社区摩擦|行为准则|非代码贡献|ai批量贡献)/i,
    'moonweave-governance-change': /(修改.*治理|更新.*原则|新增.*skill|弃用.*skill|平台适配器.*更新|平台格式.*(?:变化|更新)|更新.*适配器|治理规范.*演进|skills体系.*修改)/i,
    'moonweave-help': /(该用哪个.*skill|用什么.*命令|which skill.*use|what command.*run|不知道.*用.*skill|help.*pick.*skill)/i,
    'moonweave-flow': /(推进到.*工程化|从.*原型.*到.*发布|take this from idea|run this.*through to release|分阶段.*流程|staged.*flow|idea.*到.*engineering-ready|项目.*全流程)/i,
  };
  return map[skill]?.test(t) ?? false;
}
function runStaticEvals() {
  const routingCases = readJson(path.join(packageRoot, 'evals', 'cases', 'routing.json'));
  const triggerCases = readJson(path.join(packageRoot, 'evals', 'cases', 'triggering.json'));
  const cases = [];
  for (const test of routingCases) {
    const actual = routeText(test.text);
    const failures = [];
    if (actual.risk !== test.expected_risk) failures.push(`risk expected ${test.expected_risk}, got ${actual.risk}`);
    for (const skill of test.expected_skills || []) if (!actual.required_skills.includes(skill)) failures.push(`missing skill ${skill}`);
    for (const skill of test.must_not || []) if (actual.required_skills.includes(skill)) failures.push(`unexpected skill ${skill}`);
    if (typeof test.stop_ship === 'boolean' && actual.stop_ship !== test.stop_ship) failures.push(`stop_ship expected ${test.stop_ship}, got ${actual.stop_ship}`);
    cases.push({ id: `routing:${test.id}`, pass: failures.length === 0, failures, actual });
  }
  for (const test of triggerCases) {
    for (const text of test.positive || []) {
      const pass = staticTrigger(test.skill, text);
      cases.push({ id: `trigger:${test.skill}:positive:${text}`, pass, failures: pass ? [] : ['expected trigger'] });
    }
    for (const text of test.negative || []) {
      const pass = !staticTrigger(test.skill, text);
      cases.push({ id: `trigger:${test.skill}:negative:${text}`, pass, failures: pass ? [] : ['unexpected trigger'] });
    }
  }
  const lint = lintSkills();
  cases.push({ id: 'lint-skills', pass: lint.summary.errors === 0, failures: lint.findings.filter((x) => x.severity === 'error').map((x) => `${x.id}: ${x.path}`) });
  const failed = cases.filter((x) => !x.pass);
  return { generated_at: new Date().toISOString(), total: cases.length, passed: cases.length - failed.length, failed: failed.length, cases };
}

function evalMarkdown(report) {
  const lines = ['# Moonweave Static Evaluation', '', `- Total: ${report.total}`, `- Passed: ${report.passed}`, `- Failed: ${report.failed}`, '', '| Case | Result | Details |', '|---|---|---|'];
  for (const item of report.cases) lines.push(`| ${item.id.replaceAll('|', '\\|')} | ${item.pass ? 'PASS' : 'FAIL'} | ${(item.failures || []).join('; ').replaceAll('|', '\\|')} |`);
  return lines.join('\n');
}

function severityRank(value) {
  return ({ blocker: 4, high: 3, medium: 2, low: 1, info: 0 })[value] ?? -1;
}

async function main() {
  const { positional, options } = parseArgs(process.argv.slice(2));
  const command = positional.shift();
  if (options.version || command === 'version') {
    process.stdout.write(`${packageJson.version}\n`);
    return;
  }
  if (!command || options.help && !command) {
    process.stdout.write(help());
    return;
  }

  switch (command) {
    case 'help':
      process.stdout.write(help());
      break;
    case 'list': {
      const data = listContent();
      emit(options.format === 'json' ? data : listMarkdown(data), { format: options.format || 'markdown', out: options.out });
      break;
    }
    case 'install': {
      if (options.help) {
        process.stdout.write('Usage: moonweave-skills install [--root .] [--agents all|cursor,codex,...] [--scope project|global] [--mode copy|symlink] [--profile auto|docs|library|service|ai-agent|embodied] [--with-github] [--force]\n');
        break;
      }
      const result = install({ root: options.root || '.', agents: options.agents || 'all', scope: options.scope || 'project', mode: options.mode || 'copy', profile: options.profile || 'auto', withGithub: Boolean(options['with-github']), force: Boolean(options.force) });
      emit(options.format === 'json' ? result : installMarkdown(result), { format: options.format || 'markdown', out: options.out });
      break;
    }
    case 'doctor': {
      const report = doctor(options.root || '.', { strict: options.strict });
      emit(options.format === 'json' ? report : doctorMarkdown(report), { format: options.format || 'markdown', out: options.out });
      if (report.summary.fail > 0 || (options.strict && report.summary.warn > 0)) process.exitCode = 1;
      break;
    }
    case 'route': {
      const input = options.text || positional.join(' ') || await readStdin();
      if (!input.trim()) throw new Error('route requires --text, a positional argument, or stdin.');
      const result = routeText(input);
      emit(options.format === 'json' ? result : routeMarkdown(result), { format: options.format || 'markdown', out: options.out });
      if (result.stop_ship && options['fail-on-stop-ship']) process.exitCode = 2;
      break;
    }
    case 'new': {
      if (options.help || positional.length === 0) {
        process.stdout.write(`Usage: moonweave-skills new <template> [--title ...] [--owner ...] [--out path] [--force]\nTemplates: ${templateNames().join(', ')}\n`);
        break;
      }
      const type = positional.shift();
      const rendered = renderTemplate(type, { title: options.title, owner: options.owner, date: options.date });
      if (options.out) {
        const out = path.resolve(options.out);
        if (fs.existsSync(out) && !options.force) throw new Error(`Target already exists: ${out}. Use --force to overwrite.`);
        ensureDir(path.dirname(out));
        fs.writeFileSync(out, rendered.content, 'utf8');
        emit({ template: type, source: rendered.file, output: out }, { format: options.format || 'json' });
      } else process.stdout.write(rendered.content);
      break;
    }
    case 'audit': {
      const report = auditRepository(options.root || '.', { profile: options.profile || 'auto' });
      const format = options.format || 'markdown';
      const output = format === 'sarif' ? toSarif(report) : format === 'json' ? report : findingsMarkdown(report);
      emit(output, { format, out: options.out });
      if (options['fail-on']) {
        const threshold = severityRank(String(options['fail-on']));
        if (report.findings.some((f) => severityRank(f.severity) >= threshold)) process.exitCode = 1;
      }
      break;
    }
    case 'lint-skills': {
      const report = lintSkills(options.root || path.join(packageRoot, 'skills'));
      emit(options.format === 'json' ? report : lintMarkdown(report), { format: options.format || 'markdown', out: options.out });
      if (report.summary.errors > 0) process.exitCode = 1;
      break;
    }
    case 'eval-static': {
      const report = runStaticEvals();
      emit(options.format === 'json' ? report : evalMarkdown(report), { format: options.format || 'markdown', out: options.out });
      if (report.failed > 0) process.exitCode = 1;
      break;
    }
    case 'checksums': {
      const result = generateChecksums(options.out ? path.resolve(options.out) : undefined);
      emit(result, { format: options.format || 'json' });
      break;
    }
    case 'uninstall': {
      const result = uninstall(options.root || '.', { scope: options.scope || 'project', force: Boolean(options.force) });
      emit(result, { format: options.format || 'json', out: options.out });
      if (result.preserved.length) process.exitCode = 2;
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}\n\n${help()}`);
  }
}

main().catch((error) => {
  process.stderr.write(`moonweave-skills: ${error.message}\n`);
  if (process.env.MOONWEAVE_DEBUG) process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
