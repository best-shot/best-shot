import babel from '@babel/core';

export function transformJS(targets) {
  console.log(targets);

  return (input, absoluteFrom) => {
    const minified = process.env.NODE_ENV === 'production';

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
      compact: !minified,
      retainLines: !minified,
      envName: process.env.NODE_ENV,
      minified,
    });

    return (result?.code || input).replace(
      ';Object.defineProperty(exports,"__esModule",{value:true});',
      ';',
    );
  };
}
