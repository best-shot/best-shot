'use strict';

const { stat, appendFile } = require('fs-extra');
const { join } = require('path');

const files = [
  '.gitignore',
  '.eslintignore',
  '.prettierignore',
  '.stylelintignore'
];

const text = `
# best-shot
.best-shot/*[build,inspect,stats]/
`;

async function append(filename) {
  const filePath = join(process.cwd(), filename);
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

exports.command = 'ignore';

exports.describe = 'Add temporary directories to .*ignore';

exports.handler = function addIgnore() {
  Promise.all(files.map(append)).catch(error => {
    console.error(error);
  });
};
