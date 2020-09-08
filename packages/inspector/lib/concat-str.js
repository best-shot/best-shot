const sortObject = require('sort-object');
const { stringify } = require('javascript-stringify');

function formatJs(code) {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { format } = require('prettier');
    return format(code, {
      parser: 'babel',
      singleQuote: true,
    });
  } catch {
    return code;
  }
}

function formatJson(json) {
  return JSON.stringify(sortObject(json), null, '  ');
}

module.exports = function concatStr({ input, output, schema, stamp }) {
  return formatJs(`
// Generate by \`best-shot\`
// repository: https://github.com/best-shot/best-shot
// website: https://www.npmjs.com/org/best-shot
// stamp: ${stamp}

/* eslint-disable */
exports.schema = ${formatJson(schema)}

exports.input = ${stringify(input)}

exports.config = ${output.toString()}
`);
};
