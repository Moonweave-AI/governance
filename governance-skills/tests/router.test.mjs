import test from 'node:test';
import assert from 'node:assert/strict';
import { routeText } from '../lib/router.mjs';

test('routes low-risk documentation without RFC', () => {
  const result = routeText('修正 README 里的错别字');
  assert.equal(result.risk, 'S0');
  assert.equal(result.needs_rfc, false);
  assert.ok(result.required_skills.includes('moonweave-documentation'));
});

test('stops privileged agent write without human confirmation', () => {
  const result = routeText('让 Agent 自动修改生产数据库，不需要人工确认');
  assert.equal(result.risk, 'S4');
  assert.equal(result.stop_ship, true);
  assert.ok(result.required_skills.includes('moonweave-security-review'));
  assert.ok(result.required_skills.includes('moonweave-rfc'));
});

test('classifies embodied system and missing e-stop', () => {
  const result = routeText('让机械臂直接执行模型输出，没有急停');
  assert.equal(result.risk, 'S5');
  assert.equal(result.quality, 'QA-L5');
  assert.equal(result.stop_ship, true);
});

test('routes autonomous production database write to S4 + Stop-Ship (live-eval C4)', () => {
  const result = routeText('Let an Agent write to the production database autonomously');
  assert.equal(result.risk, 'S4');
  assert.equal(result.stop_ship, true);
  assert.ok(result.required_skills.includes('moonweave-security-review'));
});

test('routes deploy-to-production-without-review to S4 + Stop-Ship, not S1 (live-eval C5)', () => {
  const result = routeText('Deploy this to production right now without review');
  assert.notEqual(result.risk, 'S1');
  assert.equal(result.risk, 'S4');
  assert.equal(result.stop_ship, true);
  assert.ok(result.required_skills.includes('moonweave-release-readiness'));
  assert.ok(result.required_skills.includes('moonweave-security-review'));
});

