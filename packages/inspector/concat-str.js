const prettier = require('prettier');

function formatJs(code) {
  return prettier.format(code, {
    parser: 'babel',
    singleQuote: true
  });
}

function concatStr({
  input: { webpackChain, ...input },
  output = '{}',
  schema,
  stamp
}) {
  const chain = webpackChain ? webpackChain.toString() : undefined;

  const inputObj = JSON.stringify(input, null, ' ');

  const result = chain
    ? inputObj.replace(/}$/, `,webpackChain:${chain}}`)
    : inputObj;

  const text = `// eslint-disable

// Generate by best-shot
// website: https://www.npmjs.com/org/best-shot
// stamp: ${stamp}

exports.schema = ${schema}

exports.input = ${result}

exports.output = ${output}`;

  return formatJs(text);
}

module.exports = {
  concatStr,
  formatJs
};
