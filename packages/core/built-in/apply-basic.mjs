import { resolve } from 'node:path';

import extToRegexp from 'ext-to-regexp';

import { targetIsNode } from '../lib/utils.mjs';

export function apply({ cwd, config }) {
  const outputConfig = config.output ?? {};
  const experiments = config.experiments ?? {};
  const optimization = config.optimization ?? {};
  const { publicPath, path, module: useModule } = outputConfig;
  const { buildHttp } = experiments;
  const { minimize } = optimization;
  const { target, dependencies, externalsPresets, performance } = config;
  const contextInput = config.context;

  return (chain) => {
    if (contextInput) {
      chain.context(resolve(cwd, contextInput));
    }

    if (target !== undefined) {
      chain.target(target);
    }

    if (dependencies) {
      chain.dependencies(dependencies);
    }

    // webpack 5.110 exposes nodeModules as an externals preset, replacing
    // webpack-node-externals. Merge so the built-in target presets (node,
    // electron, …) that webpack applies itself are not disturbed.
    if (externalsPresets) {
      chain.externalsPresets(externalsPresets);
    }

    // webpack-chain stores `performance` outside the chain map, so `get`
    // cannot read it. Apply the project's size thresholds together with any
    // user options in one call.
    chain.performance({
      maxEntrypointSize: 1024 ** 2,
      maxAssetSize: 1024 ** 2,
      ...performance,
    });

    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.devtool(false);

    chain.optimization
      .minimize(minimize ?? mode === 'production')
      .removeEmptyChunks(true)
      .removeAvailableModules(true);

    // Keep webpack's built-in asset minimizer for CSS/HTML/JSON, but leave JS
    // to the terser preset so its custom options (drop_console, ascii_only,
    // extractComments) and per-preset `exclude` (preset-mini) stay in force.
    // The built-in plugin is injected through the "..." placeholder once a
    // user minimizer (terser) is registered.
    chain.optimization.set('minimizeOptions', {
      javascript: false,
      json: true,
    });
    chain.get('x').addHooks((io) => {
      const minimizers = io.optimization?.minimizer;

      if (
        Array.isArray(minimizers) &&
        minimizers.length > 0 &&
        !minimizers.includes('...')
      ) {
        minimizers.push('...');
      }
    });

    if (watch) {
      chain.watchOptions.ignored(/node_modules/);
      chain.output.pathinfo(false);
      chain.optimization.removeAvailableModules(false).innerGraph(false);
    }

    chain.optimization
      .providedExports(true)
      .usedExports(true)
      .concatenateModules(true);

    chain.module.strictExportPresence(!watch);

    const name = chain.get('name') || '';

    const isNode = targetIsNode(target);

    chain.output
      .filename(
        isNode ? (useModule ? '[name].mjs' : '[name].cjs') : '[name].js',
      )
      .cssFilename('[name].css');

    if (!watch) {
      chain.output.clean(true);
    }

    if (publicPath !== undefined) {
      chain.output.publicPath(publicPath);
    }

    const { cachePath } = chain.get('x');

    chain.experiments.buildHttp({
      allowedUris: [],
      lockfileLocation: cachePath('locks/lock'),
      cacheLocation: cachePath('locks/cache'),
      upgrade: true,
      frozen: false,
      ...buildHttp,
    });

    if (useModule) {
      // ESM output is controlled by `output.module` (set via outputConfig
      // above); `experiments.outputModule` was removed in webpack 5.111.
      chain.output.chunkFormat('module').chunkLoading('import');
      // chain.output.library.type('module');
    } else if (isNode) {
      chain.output.library.type('commonjs-static');
    }

    chain.output.assetModuleFilename('[path][name][ext]');

    chain.output.merge(outputConfig);

    chain.output.path(
      resolve(
        cwd,
        path
          .replaceAll('[config-name]', () => name)
          .replaceAll('[mode]', () => mode),
      ),
    );

    chain.module.parser.javascript({
      amd: false,
      requireJs: false,
      system: false,
      importMeta: !isNode,
      importMetaContext: true,
    });

    chain.module.parser.json({
      namedExports: true,
    });

    chain.module
      .rule('esm')
      .test(extToRegexp({ extname: ['js', 'mjs'] }))
      .resolve.fullySpecified(false);
  };
}

export const name = 'basic';

export const schema = {
  context: {
    type: 'string',
  },
  externalsPresets: {
    type: 'object',
    default: {},
    additionalProperties: true,
  },
  performance: {
    type: 'object',
    default: {},
    additionalProperties: true,
  },
  output: {
    type: 'object',
    default: {},
    properties: {
      path: {
        default: 'dist',
        description:
          'It can be a relative path. Additional placeholder: [mode][config-name]',
        minLength: 1,
        type: 'string',
      },
    },
  },
  optimization: {
    type: 'object',
    default: {},
    properties: {
      minimize: {},
    },
  },
};
