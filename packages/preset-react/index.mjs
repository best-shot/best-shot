import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'preset-react';

function getReactMajor(cwd) {
  try {
    const require = createRequire(join(cwd, 'package.json'));
    const manifest = join(dirname(require.resolve('react')), 'package.json');

    return Number(JSON.parse(readFileSync(manifest, 'utf8')).version.split('.')[0]);
  } catch {
    // react not installed or unresolvable
    return undefined;
  }
}

export function apply({
  cwd,
  config: { react: { compiler = false } = {} },
}) {
  return async (chain) => {
    const mode = chain.get('mode') || 'development';
    const useHot = chain.devServer.get('hot') || false;
    const reactMajor = getReactMajor(cwd);

    const compilerPlugin = compiler
      ? reactMajor === 18
        ? ['babel-plugin-react-compiler', { target: '18' }]
        : 'babel-plugin-react-compiler'
      : undefined;

    chain.resolve.extensionAlias.set('.jsx', ['.tsx', '.jsx']);

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.module
      .rule('babel')
      .test(fileRegexp.add('jsx', 'tsx'))
      .use('babel-loader')
      .tap(({ presets = [], plugins = [], ...options } = {}) => ({
        ...options,
        presets: [
          ...presets,
          [
            '@babel/react',
            {
              runtime: 'automatic',
              ...(mode === 'development' ? { development: true } : undefined),
            },
          ],
        ],
        plugins: [
          // the compiler should run before other plugins
          ...(compilerPlugin ? [compilerPlugin] : []),
          ...plugins,
          '@babel/transform-react-constant-elements',
          // inlined elements are rejected by react 19 (error #525)
          ...(reactMajor && reactMajor < 19
            ? ['@babel/transform-react-inline-elements']
            : []),
          'transform-react-remove-prop-types',
          ...(useHot ? ['react-refresh/babel'] : []),
        ].filter(Boolean),
      }));

    if (useHot) {
      chain.optimization.runtimeChunk('single');

      const { default: ReactRefreshPlugin } = await import(
        '@pmmmwh/react-refresh-webpack-plugin'
      );
      chain.plugin('react-refresh').use(ReactRefreshPlugin);
    }
  };
}

export const schema = {
  react: {
    default: {},
    type: 'object',
    properties: {
      compiler: {
        default: false,
        type: 'boolean',
        description:
          'Enable React Compiler, React 18 project also need react-compiler-runtime package',
      },
    },
  },
  vendors: {
    type: 'object',
    properties: {
      react: {
        default: [
          'prop-types',
          'react',
          'react-(.)*',
          'scheduler',
          '@remix-run',
          'history',
        ],
      },
    },
  },
};
