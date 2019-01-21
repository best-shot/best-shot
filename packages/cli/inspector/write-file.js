const { join } = require('path');
const { outputFile } = require('fs-extra');

module.exports = async function writeFile({
  rootPath, name, stamp, data
}) {
  const fileName = join(rootPath, '.best-shot', `inspect-${stamp}`, name);

  await outputFile(fileName, data)
    .then(() => {
      console.log('-', name);
    })
    .catch(err => {
      console.error(err);
    });
};
