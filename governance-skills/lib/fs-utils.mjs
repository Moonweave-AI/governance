import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';

export function expandHome(value) {
  if (!value) return value;
  if (value === '~') return os.homedir();
  if (value.startsWith(`~${path.sep}`) || value.startsWith('~/')) {
    return path.join(os.homedir(), value.slice(2));
  }
  return value;
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

export function normalizeRel(value) {
  return value.split(path.sep).join('/');
}

export function walkFiles(root, options = {}) {
  const {
    ignore = new Set(),
    includeSymlinks = false,
    maxFiles = 100000,
  } = options;
  const output = [];
  if (!fs.existsSync(root)) return output;

  function visit(current) {
    if (output.length >= maxFiles) return;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (ignore.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isSymbolicLink()) {
        if (includeSymlinks) output.push(full);
      } else if (entry.isDirectory()) {
        visit(full);
      } else if (entry.isFile()) {
        output.push(full);
      }
      if (output.length >= maxFiles) return;
    }
  }
  visit(root);
  return output;
}

export function copyDir(source, destination, options = {}) {
  const { overwrite = false } = options;
  ensureDir(destination);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dst = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dst, options);
    } else if (entry.isSymbolicLink()) {
      const target = fs.readlinkSync(src);
      if (!fs.existsSync(dst) || overwrite) {
        if (fs.existsSync(dst) || fs.lstatSync(dst, { throwIfNoEntry: false })) fs.rmSync(dst, { recursive: true, force: true });
        fs.symlinkSync(target, dst);
      }
    } else if (!fs.existsSync(dst) || overwrite) {
      ensureDir(path.dirname(dst));
      fs.copyFileSync(src, dst);
      fs.chmodSync(dst, fs.statSync(src).mode);
    }
  }
}

export function copyFileSafe(source, destination, options = {}) {
  const { overwrite = false } = options;
  if (fs.existsSync(destination) && !overwrite) return { written: false, reason: 'exists' };
  ensureDir(path.dirname(destination));
  fs.copyFileSync(source, destination);
  fs.chmodSync(destination, fs.statSync(source).mode);
  return { written: true };
}

export function writeFileSafe(destination, content, options = {}) {
  const { overwrite = false } = options;
  if (fs.existsSync(destination) && !overwrite) return { written: false, reason: 'exists' };
  ensureDir(path.dirname(destination));
  fs.writeFileSync(destination, content, 'utf8');
  return { written: true };
}

export function appendManagedBlock(file, block, marker = 'MOONWEAVE-GOVERNANCE', options = {}) {
  const { force = false } = options;
  const begin = `<!-- BEGIN ${marker} -->`;
  const end = `<!-- END ${marker} -->`;
  const managed = `${begin}\n${block.trim()}\n${end}`;
  ensureDir(path.dirname(file));
  let current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const pattern = new RegExp(`${escapeRegExp(begin)}[\\s\\S]*?${escapeRegExp(end)}`, 'm');
  if (pattern.test(current)) {
    current = current.replace(pattern, managed);
  } else {
    if (current.trim().length > 0) current = `${current.trimEnd()}\n\n`;
    current += `${managed}\n`;
  }
  fs.writeFileSync(file, current, 'utf8');
  return { written: true, force };
}

export function removeManagedBlock(file, marker = 'MOONWEAVE-GOVERNANCE') {
  if (!fs.existsSync(file)) return false;
  const begin = `<!-- BEGIN ${marker} -->`;
  const end = `<!-- END ${marker} -->`;
  const pattern = new RegExp(`\\n?${escapeRegExp(begin)}[\\s\\S]*?${escapeRegExp(end)}\\n?`, 'm');
  const current = fs.readFileSync(file, 'utf8');
  const next = current.replace(pattern, '\n').replace(/^\s+|\s+$/g, '');
  if (next.length === 0) fs.rmSync(file, { force: true });
  else fs.writeFileSync(file, `${next}\n`, 'utf8');
  return current !== next;
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isTextFile(file, maxBytes = 1024 * 1024) {
  let stat;
  try { stat = fs.statSync(file); } catch { return false; }
  if (!stat.isFile() || stat.size > maxBytes) return false;
  const sample = fs.readFileSync(file).subarray(0, Math.min(stat.size, 8192));
  return !sample.includes(0);
}

export function redactSecret(value) {
  if (!value) return '[REDACTED]';
  if (value.length <= 8) return '[REDACTED]';
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function relativeOrSelf(root, file) {
  const rel = path.relative(root, file);
  return normalizeRel(rel || '.');
}
