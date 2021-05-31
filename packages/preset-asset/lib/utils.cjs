const crypto = require('crypto');

// eslint-disable-next-line no-control-regex
const nonAsciiRegex = /[^\u0000-\u007F]+/g;

module.exports = {
  nonAscii(name) {
    return nonAsciiRegex.test(name)
      ? name.replace(nonAsciiRegex, (item) =>
          crypto.createHash('sha1').update(item).digest('hex').slice(-8),
        )
      : name;
  },
};
