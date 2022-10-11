import crypto from 'node:crypto';

import transliterate from '@sindresorhus/transliterate';

// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\u0000-\u007F]+/g;

function hex(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(-8);
}

export function nonAscii(name) {
  return transliterate(name.toLowerCase().replace(/\s/g, '-')).replace(
    nonAsciiRegex,
    hex,
  );
}

export function removeRoot(name) {
  return name.replace(/^(src|packages)\//, '');
}
