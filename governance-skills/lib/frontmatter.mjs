export function parseFrontmatter(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) return { data: {}, body: text, error: 'missing-frontmatter' };
  const normalized = text.replaceAll('\r\n', '\n');
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) return { data: {}, body: normalized, error: 'unclosed-frontmatter' };
  const raw = normalized.slice(4, end);
  const body = normalized.slice(end + 5);
  const data = {};
  let currentObject = null;
  for (const rawLine of raw.split('\n')) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;
    const indent = rawLine.match(/^\s*/)[0].length;
    const line = rawLine.trim();
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    if (indent > 0 && currentObject) {
      if (typeof data[currentObject] !== 'object') data[currentObject] = {};
      data[currentObject][key] = value;
    } else if (!value) {
      currentObject = key;
      data[key] = {};
    } else {
      currentObject = null;
      data[key] = value;
    }
  }
  return { data, body, raw, error: null };
}
