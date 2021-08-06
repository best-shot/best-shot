'use strict';

const crypto = require('crypto');

const transliterate = require('@sindresorhus/transliterate');

// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\u0000-\u007F]+/g;

function hex(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(-8);
}

module.exports = {
  nonAscii(name) {
    return transliterate(name.toLowerCase().replace(/\s/g, '-')).replace(
      nonAsciiRegex,
      hex,
    );
  },
  removeRoot(name) {
    return name.replace(/^(src|packages)\//, '');
  },
};
