const { join } = require('path');
const { outputFileSync } = require('fs-extra');

module.exports = function makeWriteFile(rootPath, stamp) {
  return function writeFile({ name, data }) {
    const fileName = join(rootPath, '.best-shot', `inspect-${stamp}`, name);

    try {
      outputFileSync(fileName, data);
      console.log('-', name);
    } catch (err) {
      console.error(err);
    }
  };
};
