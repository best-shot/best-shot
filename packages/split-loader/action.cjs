'use strict';

const { transform } = require('./ast.cjs');
const { serializeTemplate } = require('@padcom/vue-ast-serializer');
const format = require('html-format');

exports.action = function action(template) {
  const { ast } = transform(template.ast);

  const tmp1 = serializeTemplate({ ast });

  return format(tmp1, {
    parser: 'vue',
    htmlWhitespaceSensitivity: 'ignore',
    singleQuote: true,
  });
};
