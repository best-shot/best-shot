'use strict';

const { stat, appendFile } = require('fs-extra');
const { join } = require('path');

function getPath(filename) {
  return join(process.cwd(), filename);
}

const files = [
  '.gitignore',
  '.eslintignore',
  '.prettierignore',
  '.stylelintignore'
];

const ignore = '.best-shot/*[build,inspect,stats]/';

const text = `
# best-shot
${ignore}
`;

async function append(filename) {
  const filePath = getPath(filename);
  const exist = await stat(filePath)
    .then(() => true)
    .catch(() => false);
  if (exist) {
    appendFile(filePath, text)
      .then(() => {
        console.log('✔', 'Append to', filename);
      })
      .catch(error => {
        console.error(error);
      });
  }
}

module.exports = function addIgnore() {
  Promise.all(files.map(append)).catch(error => {
    console.error(error);
  });
};
