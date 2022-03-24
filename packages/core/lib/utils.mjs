import { resolve } from 'path';

export function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
}

const cwd = process.cwd();

export function cachePath(...path) {
  return resolve(cwd, 'node_modules/.cache/best-shot', ...path);
}

function isNode(target) {
  return (
    target &&
    (target.includes('node') ||
      target.includes('nwjs') ||
      target.includes('electron'))
  );
}

export function targetIsNode(target = []) {
  return Array.isArray(target) ? target.some((t) => isNode(t)) : isNode(target);
}
