'use strict';

const { format } = require('prettier');
const { stringify } = require('javascript-stringify');

function formatJs(code) {
  return format(code, {
    parser: 'babel',
    singleQuote: true
  });
}

module.exports = function concatStr({ input, output, schema, stamp }) {
  return formatJs(`
// eslint-disable

// Generate by \`best-shot\`
// repository: https://github.com/airkro/best-shot
// website: https://www.npmjs.com/org/best-shot
// stamp: ${stamp}

exports.schema = ${schema.toString()}

exports.input = ${stringify(input)}

exports.config = ${output.toString()}
`);
};
