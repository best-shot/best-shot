import * as babel from '@babel/core';

export function applyCopy(chain) {
  const { targets } = chain.module
    .rule('babel')
    .use('babel-loader')
    .get('options');

  const minimize = chain.optimization.get('minimize');

  const transform = (input, absoluteFrom) => {
    if (!absoluteFrom.endsWith('.js') || absoluteFrom.endsWith('.mjs')) {
      return input;
    }

    const result = babel.transformSync(input, {
      presets: [['babel-preset-evergreen', { usage: 'pure', mini: true }]],
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { importInterop: 'none' }],
      ],
      targets,
      configFile: false,
      babelrc: false,
      filename: 'a.mjs',
      sourceType: 'commonjs',
      compact: !minimize,
      retainLines: !minimize,
      envName: process.env.NODE_ENV,
      minified: minimize,
    });

    return (result?.code || input).replace(
      ';Object.defineProperty(exports,"__esModule",{value:true});',
      ';',
    );
  };

  // `output.copy` stores an array of patterns. Inject the same transform into
  // each one so copied .js files get the mini-target Babel pass.
  const patterns = chain.output.get('copy');
  chain.output.set(
    'copy',
    patterns.map((pattern) => ({ transform, ...pattern })),
  );
}
