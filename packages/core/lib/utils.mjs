import { resolve } from 'path';

export function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
}

const cwd = process.cwd();

export function cachePath(...args) {
  return resolve(cwd, 'node_modules/.cache/best-shot', ...args);
}

export function isNode(target) {
  return Array.isArray(target) ? target.includes('node') : target === 'node';
}
