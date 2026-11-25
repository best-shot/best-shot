import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

async function applyAsset(chain) {
  const assetModuleFilename = chain.output.get('assetModuleFilename');

  const withRules = [];

  function set({ name, extname, ext, raw }) {
    const io = chain.module.rule(name).test(extToRegexp({ extname }));

    io.oneOf('url').dependency('url');

    if (ext) {
      io.oneOf('url').generator.filename(
        assetModuleFilename.replace('[ext]', () => `.${ext}`),
      );
    }

    io.oneOf('not-url').oneOf('raw').type(raw);

    // `with` (import attributes) is not understood by VueLoaderPlugin's
    // internal RuleSetCompiler, so register these rules after all plugins
    // have cloned the user rules.
    withRules.push({
      test: extToRegexp({ extname: [...extname] }),
      with: { type: 'url' },
      type: 'asset/resource',
      ...(ext && {
        generator: {
          filename: assetModuleFilename.replace('[ext]', () => `.${ext}`),
        },
      }),
    });
  }

  set({
    name: 'text',
    extname: ['txt'],
    raw: 'asset/source',
  });

  set({
    name: 'json',
    extname: ['json'],
    raw: 'json',
  });

  set({
    name: 'yaml',
    extname: ['yaml', 'yml'],
    ext: 'json',
    raw: 'json',
  });

  chain.module
    .rule('yaml')
    .use('yaml-loader')
    .loader(fileURLToPath(import.meta.resolve('yaml-loader')))
    .options({ asJSON: true });

  if (withRules.length > 0) {
    chain.plugin('with-asset').use(
      class WithAssetPlugin {
        apply(compiler) {
          compiler.hooks.afterPlugins.tap('WithAssetPlugin', () => {
            compiler.options.module.rules.push(...withRules);
          });
        }
      },
    );
  }

  if (!chain.optimization.get('minimize')) return;

  const { default: JsonMinimizerPlugin } =
    await import('json-minimizer-webpack-plugin');

  chain.optimization.minimizer('json').use(JsonMinimizerPlugin);
}

export function apply() {
  return applyAsset;
}

export const name = 'asset-next';
