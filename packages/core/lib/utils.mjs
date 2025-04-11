import { resolve } from 'node:path';

export function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
}

const cwd = process.cwd();

export function cachePath(...path) {
  return resolve(cwd, 'node_modules/.cache/best-shot', ...path);
}

function isNode(target) {
  return (
    typeof target === 'string' &&
    (target.includes('node') ||
      target.includes('nwjs') ||
      target.includes('electron-main'))
  );
}

export function targetIsNode(target = []) {
  return Array.isArray(target) ? target.some((t) => isNode(t)) : isNode(target);
}
