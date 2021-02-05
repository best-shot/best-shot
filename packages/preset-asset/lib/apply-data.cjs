const extToRegexp = require('ext-to-regexp');

function outputFile(ext = '[ext]') {
  return (rule) => {
    rule
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: `[path][name].[contenthash:8].${ext}`,
        outputPath: (name) => name.replace(/^src\//, '').replace('.[hash]', ''),
      });
  };
}

module.exports = function applyData(chain) {
  chain.module
    .rule('json')
    .test(
      extToRegexp({
        suffix: ['\\[hash]'],
        extname: ['json'],
      }),
    )
    .type('javascript/auto')
    .batch(outputFile());

  // ----------

  const yaml = chain.module
    .rule('yaml')
    .test(extToRegexp({ extname: ['yaml', 'yml'] }));

  yaml
    .oneOf('external')
    .test(/\.\[hash]/)
    .batch(outputFile('json'))
    .use('yaml-loader')
    .loader('yaml-loader');

  yaml // align
    .oneOf('internal')
    .type('json')
    .use('yaml-loader')
    .loader('yaml-loader');

  // ----------

  const text = chain.module
    .rule('text')
    .test(extToRegexp({ extname: ['txt'] }));

  text
    .oneOf('external')
    .test(/\.\[hash]/)
    .batch(outputFile());

  text // align
    .oneOf('internal')
    .use('raw-loader')
    .loader('raw-loader');
};
