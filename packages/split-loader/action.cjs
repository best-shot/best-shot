'use strict';

const { transform } = require('./ast.cjs');
const { serializeTemplate } = require('@padcom/vue-ast-serializer');

// import { format } from 'prettier';

exports.action = function action(template) {
  const { ast } = transform(template.ast);

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const tmp1 = serializeTemplate({ ast });

  return tmp1;
  //  ||  format(tmp1, {
  //     parser: 'vue',
  //     htmlWhitespaceSensitivity: 'ignore',
  //     singleQuote: true,
  //   })
};
