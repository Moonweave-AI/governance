import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTemplate } from '../lib/templates.mjs';

test('renders RFC title', () => {
  const rendered = renderTemplate('rfc', { title: 'Unify the long-term memory protocol' });
  assert.match(rendered.content, /Unify the long-term memory protocol/);
  assert.match(rendered.content, /Non-goals/);
});

test('rejects unknown template', () => {
  assert.throws(() => renderTemplate('unknown'), /Unknown template/i);
});
