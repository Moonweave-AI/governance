import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './fs-utils.mjs';

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const packageJson = readJson(path.join(packageRoot, 'package.json'));
export const manifest = readJson(path.join(packageRoot, 'core', 'manifest.json'));
export const commandMap = readJson(path.join(packageRoot, 'core', 'command-map.json'));
export const platformTargets = readJson(path.join(packageRoot, 'core', 'platform-targets.json'));
export const riskModel = readJson(path.join(packageRoot, 'core', 'risk-model.json'));
export const qualityModel = readJson(path.join(packageRoot, 'core', 'quality-model.json'));
export const lifecycle = readJson(path.join(packageRoot, 'core', 'lifecycle.json'));

export const supportedAgents = Object.keys(platformTargets.platforms);
export const defaultAgents = ['cursor', 'codex', 'claude', 'opencode', 'kilo', 'antigravity'];
